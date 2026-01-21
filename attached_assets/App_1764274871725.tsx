import React, { useState } from 'react';
import { generateImage } from './services/geminiService';
import Spinner from './components/Spinner';
import ImagePopup from './components/ImagePopup';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [popupImageUrl, setPopupImageUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [generatedByModel, setGeneratedByModel] = useState<string | null>(null);
  
  const handleGenerateImage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedByModel(null);

    try {
      const { imageUrl, model } = await generateImage(prompt, aspectRatio);
      setPopupImageUrl(imageUrl);
      setGeneratedByModel(model);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-slate-950 h-full text-slate-400 font-sans selection:bg-purple-900 selection:text-white flex flex-col overflow-hidden">
      {/* Navigation Bar */}
      <nav className="relative flex items-center justify-between px-4 py-3 md:px-6 md:py-5 border-b border-slate-800 bg-black/50 backdrop-blur-sm z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img 
              src="https://speakia.ai/wp-content/uploads/2025/11/cropped-SPEAK-AI-Proposta-de-Marca-e1763141139366.png" 
              alt="Speak AI Logo" 
              className="h-8 md:h-9 w-auto object-contain" 
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="https://speakia.ai" className="text-slate-400 hover:text-slate-200 transition-colors">Início</a>
            <a href="https://chat-speak-ai-516262499372.us-west1.run.app" className="text-slate-400 hover:text-slate-200 transition-colors">Chat</a>
            <a href="https://prompt-516262499372.us-west1.run.app" className="text-slate-400 hover:text-slate-200 transition-colors">Gerar Prompt</a>
            <a href="https://gerador-de-imagens-516262499372.us-west1.run.app" className="text-white font-medium relative after:content-[''] after:absolute after:-bottom-6 after:left-0 after:w-full after:h-0.5 after:bg-indigo-500 after:rounded-t-full">Gerar Imagem</a>
            <a href="https://alternador-de-veo3-516262499372.us-west1.run.app" className="text-slate-400 hover:text-slate-200 transition-colors">Gerar Vídeo</a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Menu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
            </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 flex flex-col p-4 gap-4 md:hidden shadow-2xl animate-fadeIn">
                <a href="https://speakia.ai" className="text-slate-300 hover:text-white py-2 text-lg font-medium border-b border-slate-800/50">Início</a>
                <a href="https://chat-speak-ai-516262499372.us-west1.run.app" className="text-slate-300 hover:text-white py-2 text-lg font-medium border-b border-slate-800/50">Chat</a>
                <a href="https://prompt-516262499372.us-west1.run.app" className="text-slate-300 hover:text-white py-2 text-lg font-medium border-b border-slate-800/50">Gerar Prompt</a>
                <a href="https://gerador-de-imagens-516262499372.us-west1.run.app" className="text-indigo-400 py-2 text-lg font-bold border-b border-slate-800/50 flex items-center gap-2">
                    Gerar Imagem 
                    <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full">Ativo</span>
                </a>
                <a href="https://alternador-de-veo3-516262499372.us-west1.run.app" className="text-slate-300 hover:text-white py-2 text-lg font-medium">Gerar Vídeo</a>
            </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-3 md:p-4 mt-2 md:mt-6 pb-8 overflow-y-auto">
        
        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-xl shadow-indigo-900/10">
          
          <div className="p-4 md:p-6 space-y-4 md:space-y-5">
            {/* Text Input Area */}
            <div className="relative bg-slate-950 rounded-xl border border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors p-3 md:p-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Me conta o que você quer ver — eu transformo em imagem pra você rapidinho."
                className="w-full bg-transparent text-slate-200 text-base min-h-[160px] md:min-h-[200px] resize-none focus:outline-none placeholder-slate-500 leading-relaxed"
                disabled={isLoading}
                style={{ fontSize: '16px' }} // Prevents iOS zoom
              />
              
              <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium">
                {prompt.length}/2000
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-start gap-4 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto max-w-full">
                 <button 
                    onClick={() => setAspectRatio('16:9')}
                    className={`px-3 py-2 md:py-1.5 text-sm md:text-xs font-medium rounded-md transition-colors whitespace-nowrap ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                   16:9
                 </button>
                 <button 
                    onClick={() => setAspectRatio('9:16')}
                    className={`px-3 py-2 md:py-1.5 text-sm md:text-xs font-medium rounded-md transition-colors whitespace-nowrap ${aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                   9:16
                 </button>
                 <button 
                    onClick={() => setAspectRatio('1:1')}
                    className={`px-3 py-2 md:py-1.5 text-sm md:text-xs font-medium rounded-md transition-colors whitespace-nowrap ${aspectRatio === '1:1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                   1:1
                 </button>
              </div>
            </div>
          </div>

          {/* Main Action Button - Full Width at Bottom */}
          <button
            onClick={() => handleGenerateImage()}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 md:py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg md:text-xl rounded-b-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(99,102,241,0.25)] active:scale-[0.99]"
          >
            {isLoading ? (
                <>
                    <Spinner />
                    <span>Gerando...</span>
                </>
            ) : (
                "Gerar Imagem"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mt-4 md:mt-5 p-4 bg-red-900/20 border border-red-500 text-red-300 rounded-xl flex items-start md:items-center gap-3 animate-fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5 md:mt-0 text-red-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008h-.008v.008z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
            </div>
        )}

      </main>

      {/* Image Popup */}
      {popupImageUrl && generatedByModel && (
        <ImagePopup
          imageUrl={popupImageUrl}
          altText={prompt}
          onClose={() => setPopupImageUrl(null)}
          modelName={generatedByModel}
        />
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
