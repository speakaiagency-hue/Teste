import React, { useState, useRef, useEffect } from 'react';

interface ComposerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isRecording?: boolean;
  onToggleRecording?: () => void;
}

const Composer: React.FC<ComposerProps> = ({ onSendMessage, isLoading, isRecording, onToggleRecording }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="composer">
      <div className="input">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Ouvindo..." : "Escreva uma mensagem..."}
          disabled={isLoading || isRecording}
          rows={1}
        />
        <button 
            className="icon-btn"
            title={isRecording ? "Parar gravação" : "Gravar áudio"}
            onClick={onToggleRecording}
            disabled={isLoading && !isRecording}
            style={{ 
                background: isRecording ? 'var(--danger)' : 'transparent',
                color: isRecording ? 'white' : 'var(--muted)',
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
        </button>
        <button 
            className="icon-btn send" 
            title="Enviar" 
            onClick={handleSend}
            disabled={isLoading || isRecording || !text.trim()}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        </button>
      </div>
    </footer>
  );
};

export default Composer;