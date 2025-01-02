import React from 'react';
import { Upload } from 'lucide-react';

interface Props {
  label: string;
  onImageSelect: (file: File) => void;
  preview?: string;
  confidence?: number;
  highlight?: boolean;
}

export const ImageUploader: React.FC<Props> = ({ 
  label, 
  onImageSelect, 
  preview, 
  confidence,
  highlight 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id={`uploader-${label}`}
      />
      <label
        htmlFor={`uploader-${label}`}
        className="cursor-pointer block"
      >
        {preview ? (
          <div className={`relative group ${highlight ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800 rounded-lg' : ''}`}>
            <img 
              src={preview} 
              alt={label} 
              className="w-32 h-32 object-contain border-2 border-gray-700 rounded-lg bg-gray-800" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-0 left-0 bg-gray-800 text-gray-300 px-2 rounded-br">{label}</div>
            {confidence !== undefined && (
              <div className={`absolute -bottom-6 left-0 right-0 text-center text-sm ${
                highlight ? 'text-blue-400 font-bold' : 'text-gray-400'
              }`}>
                {(confidence * 100).toFixed(1)}%
              </div>
            )}
          </div>
        ) : (
          <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
            <Upload className="w-6 h-6 text-gray-500 mb-2" />
            <span className="text-sm text-gray-400">{label}</span>
          </div>
        )}
      </label>
    </div>
  );
}