import React from 'react';
import { Grid2x2, Grid3x3 } from 'lucide-react';

interface Props {
  size: number;
  onChange: (size: number) => void;
}

export const MatrixSizeControl: React.FC<Props> = ({ size, onChange }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
      <Grid2x2 className="w-5 h-5 text-gray-400" />
      <input
        type="range"
        min="2"
        max="8"
        value={size}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-48 accent-blue-500"
      />
      <Grid3x3 className="w-5 h-5 text-gray-400" />
      <span className="text-gray-300 font-medium ml-2">
        {size}×{size} Matrix
      </span>
    </div>
  );
}