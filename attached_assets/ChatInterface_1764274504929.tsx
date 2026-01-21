import React, { useRef, useEffect } from 'react';
import { Message as MessageType, Suggestion } from '../types';
import Message from './Message';

interface ChatInterfaceProps {
  messages: MessageType[];
  suggestions: Suggestion[];
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, suggestions, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-grow p-4 md:p-6 overflow-y-auto bg-black hide-scrollbar flex flex-col justify-end">
      <div className="max-w-3xl mx-auto w-full">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start my-2">
            <div className="p-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none shadow">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        {suggestions.length > 0 && (
            <div className="my-4 p-4 bg-gray-800 border border-blue-900 rounded-lg">
                <h3 className="font-bold text-blue-300 mb-2">Aqui estão algumas sugestões que você pode achar úteis:</h3>
                <div className="space-y-2">
                    {suggestions.map((s, i) => (
                        <div key={i} className="p-3 bg-gray-700 rounded-md shadow-sm">
                            <p className="font-semibold text-blue-400">{s.title}</p>
                            <p className="text-sm text-gray-300">{s.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;