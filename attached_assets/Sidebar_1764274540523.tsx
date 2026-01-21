

import React from 'react';
import { Conversation, View } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onCloseSidebar: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, 
    onCloseSidebar,
    conversations, 
    activeConversationId, 
    onNewChat, 
    onSelectConversation, 
    onDeleteConversation, 
    searchTerm, 
    onSearchChange,
    currentView,
    setView
}) => {
  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza de que deseja excluir a conversa "${title}"?`)) {
        onDeleteConversation(id);
    }
  };

  const mobileNavItems = [
      { label: 'Início', href: 'https://speakia.ai/' },
      { label: 'Chat', value: 'chat' as View, href: 'https://chat-speak-ai-516262499372.us-west1.run.app' },
      { label: 'Gerar Prompt', value: 'prompt' as View, href: 'https://prompt-516262499372.us-west1.run.app' },
      { label: 'Gerar Imagem', value: 'image' as View, href: 'https://gerador-de-imagens-516262499372.us-west1.run.app' },
      { label: 'Gerar Vídeo', value: 'video' as View, href: 'https://alternador-de-veo3-516262499372.us-west1.run.app' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile Header Section (Logo + Close) - Only visible on mobile */}
      <div className="md:hidden flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-2">
             <img 
                src="https://speakia.ai/wp-content/uploads/2025/11/cropped-SPEAK-AI-Proposta-de-Marca-e1763141139366.png" 
                alt="Speak AI" 
                className="h-7 w-auto object-contain"
             />
          </div>
          <button onClick={onCloseSidebar} className="text-slate-400 hover:text-white p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
      </div>

      {/* Mobile Navigation List - Only visible on mobile */}
      <div className="md:hidden flex flex-col mb-8">
          {mobileNavItems.map(item => {
              const isActive = item.value && currentView === item.value;
              
              return (
                <a 
                    key={item.label}
                    href={item.href}
                    className={`
                        flex items-center gap-3 py-4 
                        border-b border-slate-800
                        text-[15px] 
                        ${isActive ? 'font-bold text-indigo-400' : 'font-medium text-slate-200'}
                        hover:bg-white/5 transition-colors no-underline
                    `}
                >
                    <span>{item.label}</span>
                    {isActive && (
                        <span className="bg-slate-800 text-indigo-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full leading-none">
                            Ativo
                        </span>
                    )}
                </a>
              );
          })}
      </div>

      {/* Standard Sidebar Content - Visible on Desktop and Mobile (below nav) */}
      <div className="new-chat" onClick={onNewChat}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nova Conversa
      </div>
      
      <div className="search mt-3">
        <svg className="icon" viewBox="0 0 24 24" fill="none">
          <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm9-1.5-4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="chats mt-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Histórico</h3>
        {conversations.length > 0 ? conversations.map(convo => (
          <div 
            key={convo.id} 
            className={`chat-item ${convo.id === activeConversationId ? 'active' : ''}`}
            onClick={() => onSelectConversation(convo.id)}
          >
            <div className="title">{convo.title || 'Nova Conversa'}</div>
            <button
                className="delete-chat-btn"
                aria-label="Excluir conversa"
                onClick={(e) => handleDelete(e, convo.id, convo.title)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center p-4 text-center opacity-60 mt-4">
            <span className="text-sm text-slate-400">Nenhuma conversa recente.</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;