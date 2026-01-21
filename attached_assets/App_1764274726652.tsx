import React, { useState } from 'react';
import { generateCreativePrompt } from './services/geminiService';
import { Spinner } from './components/Spinner';
import { CopyIcon, CheckIcon, ClearIcon } from './components/Icons';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedPrompt(null);
    setCopied(false);

    try {
      const result = await generateCreativePrompt(userInput);
      setGeneratedPrompt(result);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Não foi possível completar a sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (generatedPrompt) {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-200 font-sans">
      {/* Barra de navegação substituída */}
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
            <a href="https://prompt-516262499372.us-west1.run.app" className="text-white font-medium relative after:content-[''] after:absolute after:-bottom-6 after:left-0 after:w-full after:h-0.5 after:bg-indigo-500 after:rounded-t-full">Gerar Prompt</a>
            <a href="https://gerador-de-imagens-516262499372.us-west1.run.app" className="text-slate-400 hover:text-slate-200 transition-colors">Gerar Imagem</a>
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
            <a href="https://prompt-516262499372.us-west1.run.app" className="text-indigo-400 py-2 text-lg font-bold border-b border-slate-800/50 flex items-center gap-2">
              Gerar Prompt
              <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full">Ativo</span>
            </a>
            <a href="https://gerador-de-imagens-516262499372.us-west1.run.app" className="text-slate-300 hover:text-white py-2 text-lg font-medium border-b border-slate-800/50">Gerar Imagem</a>
            <a href="https://alternador-de-veo3-516262499372.us-west1.run.app" className="text-slate-300 hover:text-white py-2 text-lg font-medium">Gerar Vídeo</a>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-4 mt-6 md:mt-12 pb-20 w-full">
        <div className="flex flex-col gap-6">
          {/* Input Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-slate-200 mb-4"></h2>
            <div className="relative">
              <textarea
                className="w-full h-36 md:h-40 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                placeholder="Descreva o conteúdo ou envie uma imagem acima para gerar automaticamente..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                maxLength={2000}
                style={{ fontSize: '16px' }}
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-medium">
                {userInput.length}/2000
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !userInput.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Gerando Prompt...' : 'Gerar Prompt'}
          </button>

          {/* Loading State */}
          {loading && <Spinner />}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 p-8 rounded-lg text-center mt-2">
              <h2 className="text-2xl font-bold text-red-400">Ocorreu um Erro</h2>
              <p className="text-red-300 mt-2">{error}</p>
            </div>
          )}
        </div>
      </main>

      {/* Prompt Result Modal */}
      {isModalOpen && generatedPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-800 flex-shrink-0">
              <h3 className="text-xl font-semibold text-slate-200">Gerar Prompt</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              >
                <ClearIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-grow">
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800/50">
                <p className="text-slate-400 leading-relaxed whitespace-pre-wrap font-light text-base">
                  {generatedPrompt}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-6 border-t border-slate-800 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
