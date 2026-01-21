import React, { useState } from 'react';

interface ImagePopupProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
  modelName: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ imageUrl, altText, onClose, modelName }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Impede que o clique no conteúdo do modal o feche
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;
    
    setIsProcessing(true);

    try {
      // Converte Data URL para Blob para criar um arquivo limpo
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Cria um nome de arquivo descritivo e seguro a partir do prompt
      const cleanPrompt = altText.replace(/[^\w\sÀ-ÿ]/g, ' ').trim();
      const words = cleanPrompt.split(/\s+/).filter(w => w.length > 0);
      let filenameStr = words.slice(0, 6).join('-').toLowerCase();
      if (!filenameStr) filenameStr = 'imagem-ia';
      const suffix = Math.floor(Math.random() * 1000);
      const filename = `${filenameStr}-${suffix}.jpg`;

      // Aciona o download direto, sem compartilhar
      downloadBlob(blob, filename);

    } catch (error) {
      console.error('Erro no processo de download:', error);
      // Fallback final para abrir a imagem em nova aba
      window.open(imageUrl, '_blank');
    } finally {
        setIsProcessing(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn p-2 md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visualização da Imagem Gerada"
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] animate-scaleUp flex flex-col"
        onClick={handleContentClick}
      >
        {/* Close Button - Positioned inside for better mobile experience */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-slate-950/50 border border-slate-700 hover:bg-red-600 hover:border-red-600 rounded-full p-2 transition-all focus:outline-none z-30 backdrop-blur-md shadow-lg"
          aria-label="Fechar pop-up"
        >
          <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-2 md:p-4 bg-slate-900 rounded-xl flex flex-col h-full">
            <div className="relative flex-1 overflow-hidden rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 min-h-0">
                <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-full object-contain max-h-[75vh]"
                />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-4 gap-3 md:gap-4 shrink-0">
                <div className="flex flex-col md:items-start items-center text-center md:text-left w-full md:w-auto md:max-w-[60%]">
                    <p className="text-slate-500 text-xs md:text-sm line-clamp-2 italic">
                        "{altText}"
                    </p>
                </div>

                <button
                    onClick={handleDownload}
                    disabled={isProcessing}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors transform active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processando...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5M8.25 12.75l3.75 3.75 3.75-3.75" />
                            </svg>
                            <span>Baixar Imagem</span>
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ImagePopup;
