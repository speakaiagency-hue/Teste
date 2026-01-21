import React, { useState } from 'react';

interface FooterProps {
  onSendMessage: (message: string) => void;
  onToggleRecording: () => void;
  isRecording: boolean;
  isLoading: boolean;
}

const Footer: React.FC<FooterProps> = ({ onSendMessage, onToggleRecording, isRecording, isLoading }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSend();
    }
  };

  return (
    <footer className="bg-gray-800 p-4 border-t border-gray-700 shrink-0">
      <div className="max-w-3xl mx-auto flex items-center space-x-3">
        <div className="flex-grow relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Ouvindo..." : "Digite seus pensamentos aqui..."}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            disabled={isLoading || isRecording}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading || isRecording || !text.trim()}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
        <button
          onClick={onToggleRecording}
          disabled={isLoading}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 ${
            isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;