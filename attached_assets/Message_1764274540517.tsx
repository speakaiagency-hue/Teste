import React, { useState, useRef, useEffect } from 'react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
  onDelete: (id: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isUser = message.role === 'user';
  const roleClass = isUser ? 'user' : 'assistant';
  const authorName = isUser ? 'Você' : 'Speak AI';
  const isLive = message.id.startsWith('live-');
  
  const getTimestamp = () => {
    const parsed = parseInt(message.id.replace(/[a-zA-Z-]/g, ''));
    return !isNaN(parsed) ? new Date(parsed).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
  };

  const timestamp = getTimestamp();

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDelete = () => {
    onDelete(message.id);
    setIsMenuOpen(false);
  };

  return (
    <div className={`message ${roleClass}`} style={{ opacity: isLive ? 0.7 : 1 }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
        {!isLive && timestamp && <div className="meta">{authorName} • {timestamp}</div>}
        
        {isUser && !isLive && (
            <>
                <button 
                    className="more-options-btn" 
                    aria-label="Mais opções"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(prev => !prev);
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                </button>
                {isMenuOpen && (
                    <div ref={menuRef} className="context-menu">
                        <button className="context-menu-item delete-action" onClick={handleDelete}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Excluir
                        </button>
                    </div>
                )}
            </>
        )}
    </div>
  );
};

export default Message;