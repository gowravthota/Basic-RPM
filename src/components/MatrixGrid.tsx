import React from 'react';
import { ImageUploader } from './ImageUploader';

interface Props {
  size: number;
  images: Record<string, string>;
  onImageSelect: (label: string, file: File) => void;
}

export const MatrixGrid: React.FC<Props> = ({ size, images, onImageSelect }) => {
  const getLabel = (row: number, col: number): string => {
    if (row === size - 1 && col === size - 1) return '?';
    return String.fromCharCode(65 + row * size + col);
  };

  return (
    <div 
      className="grid gap-4" 
      style={{ 
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        width: 'fit-content'
      }}
    >
      {Array.from({ length: size * size }, (_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const label = getLabel(row, col);
        
        return label === '?' ? (
          <div key={label} className="w-32 h-32 bg-gray-700 flex items-center justify-center text-2xl text-gray-400 rounded-lg">
            {label}
          </div>
        ) : (
          <ImageUploader
            key={label}
            label={label}
            onImageSelect={(file) => onImageSelect(label, file)}
            preview={images[label]}
          />
        );
      })}
    </div>
  );
}