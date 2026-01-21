
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, onToggleSidebar }) => {
  const buttonBaseClasses = "px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500";
  const activeClasses = "bg-blue-600 text-white shadow-md";
  const inactiveClasses = "text-gray-300 hover:bg-gray-600";

  return (
    <header className="header">
      <div className="flex items-center space-x-3">
        <button className="menu-btn lg:hidden" onClick={onToggleSidebar} aria-label="Toggle Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
        
        {/* Logo shown in header when sidebar might be hidden or for visual balance */}
        <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
      </div>
      
      <nav className="flex items-center space-x-2 p-1 bg-gray-700 rounded-lg">
        <button
          onClick={() => setView('chat')}
          className={`${buttonBaseClasses} ${currentView === 'chat' ? activeClasses : inactiveClasses}`}
        >
          Conversa
        </button>
        <button
          onClick={() => setView('diary')}
          className={`${buttonBaseClasses} ${currentView === 'diary' ? activeClasses : inactiveClasses}`}
        >
          Diário
        </button>
      </nav>
    </header>
  );
};

export default Header;
