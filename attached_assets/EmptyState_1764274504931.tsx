import React from 'react';

interface EmptyStateProps {
    onNewChat: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewChat }) => {
  return (
    <>
        <div className="empty-chat-container">
            <img src="https://speakia.ai/wp-content/uploads/2025/11/SPEAK-AI-Proposta-de-Marca-e1763309069966.png" alt="Speak AI Logo" className="logo" />
            <h2>Bem-vindo ao Speak AI</h2>
            <p>Sua jornada para o autoconhecimento começa aqui. <br /> Crie um novo chat para começar a conversar.</p>
        </div>
        <footer className="composer" style={{visibility: 'hidden'}}>
            {/* Placeholder to keep layout consistent */}
        </footer>
    </>
  );
};

export default EmptyState;