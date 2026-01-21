
import React from 'react';
import { View } from '../types';

interface MainHeaderProps {
    currentView: View;
    setView: (view: View) => void;
    onToggleSidebar: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ currentView, setView, onToggleSidebar }) => {
    const isActive = (viewName: View) => currentView === viewName;

    const navItems = [
        { label: 'Início', href: 'https://speakia.ai/' },
        { label: 'Chat', value: 'chat' as View, href: 'https://chat-speak-ai-516262499372.us-west1.run.app' },
        { label: 'Gerar Prompt', value: 'prompt' as View, href: 'https://prompt-516262499372.us-west1.run.app' },
        { label: 'Gerar Imagem', value: 'image' as View, href: 'https://gerador-de-imagens-516262499372.us-west1.run.app' },
        { label: 'Gerar Vídeo', value: 'video' as View, href: 'https://alternador-de-veo3-516262499372.us-west1.run.app' },
    ];

    return (
        <header className="header relative h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm z-20">
            <div className="flex items-center gap-6">
                {/* Logo - Left aligned */}
                <div className="flex items-center gap-2 z-10">
                    <img 
                        src="https://speakia.ai/wp-content/uploads/2025/11/cropped-SPEAK-AI-Proposta-de-Marca-e1763141139366.png" 
                        alt="Speak AI" 
                        className="h-8 w-auto object-contain"
                    />
                </div>

                {/* Desktop Navigation - Next to logo */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {navItems.map((item) => {
                        const active = item.value && isActive(item.value);
                        
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => {
                                    if (!item.href && item.value) {
                                        e.preventDefault();
                                        setView(item.value);
                                    }
                                }}
                                className={`
                                    relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline
                                    ${active ? 'bg-slate-800 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}
                                `}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>
            </div>

            {/* Right: Menu Button (Mobile) */}
            <div className="flex items-center md:hidden">
                <button 
                    onClick={onToggleSidebar}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default MainHeader;