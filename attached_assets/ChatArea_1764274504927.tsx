import React, { useRef, useEffect } from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';

interface ChatAreaProps {
  messages: MessageType[];
  isLoading: boolean;
  onDeleteMessage: (messageId: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, onDeleteMessage }) => {
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <main ref={scrollRef} className="chat">
      <div className="chat-messages-container">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} onDelete={onDeleteMessage} />
        ))}
        {isLoading && (
          <div className="message assistant">
              <div className="typing-indicator">
                  <span></span><span></span><span></span>
              </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ChatArea;