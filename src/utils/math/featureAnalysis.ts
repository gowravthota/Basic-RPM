export function getDeltas(features1: Record<string, number>, features2: Record<string, number>): Record<string, number> {
  const deltas: Record<string, number> = {};
  for (const key in features1) {
    deltas[key] = features1[key] === 0 ? 0 : (features2[key] - features1[key]) / features1[key];
  }
  return deltas;
}

export function getSimilarity(features1: Record<string, number>, features2: Record<string, number>): number {
  return Object.keys(features1).reduce((sum, key) => 
    sum + Math.abs(features1[key] - features2[key]), 0);
}

export function normalizeFeatures(
  features: Record<string, number>,
  featureMins: Record<string, number>,
  featureMaxs: Record<string, number>
): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const key in features) {
    const min = featureMins[key];
    const max = featureMaxs[key];
    normalized[key] = max - min === 0 ? 0 : (features[key] - min) / (max - min);
  }
  return normalized;
}