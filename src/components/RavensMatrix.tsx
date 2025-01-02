import React, { useState } from 'react';
import { Agent } from '../utils/Agent';
import { ImageUploader } from './ImageUploader';
import { Brain } from 'lucide-react';
import { MatrixSizeControl } from './MatrixSizeControl';
import { MatrixGrid } from './MatrixGrid';

interface ConfidenceScore {
  answer: number;
  confidence: number;
}

export const RavensMatrix: React.FC = () => {
  const [size, setSize] = useState(2);
  const [images, setImages] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<ConfidenceScore[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (label: string, file: File) => {
    const url = URL.createObjectURL(file);
    setImages(prev => ({ ...prev, [label]: url }));
    setScores([]);
  };

  const getRequiredLabels = () => {
    const labels: string[] = [];
    const totalCells = size * size - 1; // Excluding the question mark cell
    for (let i = 0; i < totalCells; i++) {
      labels.push(String.fromCharCode(65 + i));
    }
    return labels;
  };

  const canSolve = () => {
    const required = getRequiredLabels();
    const hasAnswers = Object.keys(images).some(key => /^\d+$/.test(key));
    return required.every(key => images[key]) && hasAnswers;
  };

  const solve = async () => {
    if (!canSolve()) return;

    setLoading(true);
    try {
      const agent = new Agent();
      const result = await agent.solve({
        name: "Custom Problem",
        problemType: size === 2 ? "2x2" : "3x3",
        problemSetName: "Custom",
        hasVisual: true,
        hasVerbal: false,
        figures: Object.entries(images).reduce((acc, [key, url]) => {
          acc[key] = { name: key, visualFilename: url };
          return acc;
        }, {} as Record<string, { name: string; visualFilename: string; }>)
      });

      const maxScore = Math.max(...Object.values(result));
      const minScore = Math.min(...Object.values(result));
      const range = maxScore - minScore;

      const confidenceScores = Object.entries(result).map(([answer, score]) => ({
        answer: parseInt(answer),
        confidence: range === 0 ? 1 : (maxScore - score) / range
      }));

      setScores(confidenceScores);
    } catch (error) {
      console.error('Error solving matrix:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setImages({});
    setScores([]);
  };

  const renderAnswerChoices = () => (
    <div className="grid grid-cols-4 gap-x-8 gap-y-12">
      {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => {
        const score = scores.find(s => s.answer === num);
        const isHighestScore = score?.confidence === Math.max(...(scores.map(s => s.confidence) || []));
        return (
          <ImageUploader
            key={num}
            label={num.toString()}
            onImageSelect={(file) => handleImageSelect(num.toString(), file)}
            preview={images[num.toString()]}
            confidence={score?.confidence}
            highlight={isHighestScore}
          />
        );
      })}
    </div>
  );

  return (
    <div className="p-6 text-gray-100">
      <div className="mb-8">
        <MatrixSizeControl size={size} onChange={handleSizeChange} />
      </div>
      
      <h2 className="text-xl font-bold mb-4">Matrix Pattern</h2>
      <div className="mb-12">
        <MatrixGrid 
          size={size}
          images={images}
          onImageSelect={handleImageSelect}
        />
      </div>

      <h3 className="text-lg font-semibold mb-6">Answer Choices</h3>
      {renderAnswerChoices()}

      <div className="mt-12 flex gap-4 items-center">
        <button
          onClick={solve}
          disabled={!canSolve() || loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            canSolve() && !loading
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Brain className="w-5 h-5" />
          {loading ? 'Analyzing...' : 'Analyze Pattern'}
        </button>
      </div>
    </div>
  );
}