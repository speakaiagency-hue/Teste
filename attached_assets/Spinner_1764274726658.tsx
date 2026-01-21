import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-4">
      <div className="w-12 h-12 border-4 border-t-indigo-500 border-slate-800 rounded-full animate-spin"></div>
      <p className="text-slate-400">Gerando com Gemini...</p>
    </div>
  );
};