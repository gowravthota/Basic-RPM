import React from 'react';
import { RavensMatrix } from './components/RavensMatrix';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4">
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow-xl rounded-lg border border-gray-700">
          <RavensMatrix />
        </div>
      </main>
    </div>
  );
}