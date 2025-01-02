import { RavensProblem } from '../types/RavensProblem';
import { extractFeatures } from './image/features';
import { getDeltas, getSimilarity, normalizeFeatures } from './math/featureAnalysis';

export class Agent {
  private readonly width = 184;
  private readonly height = 184;

  public async solve(problem: RavensProblem): Promise<Record<string, number>> {
    // Extract features for matrix images
    const features: Record<string, Record<string, number>> = {};
    for (const [key, figure] of Object.entries(problem.figures)) {
      if (/^[A-Z]$/.test(key)) {
        features[key] = await extractFeatures(figure.visualFilename, this.width, this.height);
      }
    }

    const grid = Object.keys(features).length <= 4 ? 2 : 3;

    // Calculate and analyze patterns
    const deltas = this.calculateDeltas(features, grid);
    const predicted = this.predictFeatures(features, deltas);

    // Analyze answer choices
    const answers: Record<string, Record<string, number>> = {};
    const answerKeys = Object.keys(problem.figures).filter(k => /^\d+$/.test(k));
    
    for (const key of answerKeys) {
      answers[key] = await extractFeatures(
        problem.figures[key].visualFilename,
        this.width,
        this.height
      );
    }

    // Calculate similarity scores
    return this.calculateScores(predicted, answers);
  }

  private calculateDeltas(
    features: Record<string, Record<string, number>>,
    grid: number
  ): Record<string, number> {
    const deltas: Record<string, Record<string, number>> = {};
    
    if (grid === 3 && features['A'] && features['B'] && features['C']) {
      deltas['row1'] = getDeltas(features['A'], features['B']);
      deltas['row2'] = getDeltas(features['B'], features['C']);
    } else if (grid === 2 && features['A'] && features['B']) {
      deltas['row1'] = getDeltas(features['A'], features['B']);
    }

    // Calculate average deltas
    const avg: Record<string, number> = {};
    const pattern = grid === 3 ? 'row2' : 'row1';
    if (deltas[pattern]) {
      for (const key in deltas[pattern]) {
        avg[key] = deltas[pattern][key];
      }
    }

    return avg;
  }

  private predictFeatures(
    features: Record<string, Record<string, number>>,
    deltas: Record<string, number>
  ): Record<string, number> {
    const lastKey = Object.keys(features).sort().pop()!;
    const predicted: Record<string, number> = {};
    
    for (const key in features[lastKey]) {
      predicted[key] = features[lastKey][key] * (1 + (deltas[key] || 0));
    }
    
    return predicted;
  }

  private calculateScores(
    predicted: Record<string, number>,
    answers: Record<string, Record<string, number>>
  ): Record<string, number> {
    // Calculate feature ranges
    const allFeatures = [...Object.values(answers), predicted];
    const mins: Record<string, number> = {};
    const maxs: Record<string, number> = {};
    
    for (const key in predicted) {
      const values = allFeatures.map(f => f[key]);
      mins[key] = Math.min(...values);
      maxs[key] = Math.max(...values);
    }

    // Normalize and calculate similarity
    const normalizedPredicted = normalizeFeatures(predicted, mins, maxs);
    const scores: Record<string, number> = {};
    
    for (const [key, answer] of Object.entries(answers)) {
      const normalizedAnswer = normalizeFeatures(answer, mins, maxs);
      scores[key] = getSimilarity(normalizedAnswer, normalizedPredicted);
    }

    return scores;
  }
}