

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat, LiveSession } from '@google/genai';
import { Message, Conversation, View, DiaryEntry } from './types';
import * as geminiService from './services/geminiService';
import { createBlob } from './utils/audio';
import Sidebar from './components/Sidebar';
import MainHeader from './components/MainHeader';
import ChatArea from './components/ChatArea';
import Composer from './components/Composer';
import EmptyState from './components/EmptyState';
import Diary from './components/Diary';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('speakAiConversations');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Falha ao carregar conversas do localStorage:", error);
      return [];
    }
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    try {
        const saved = localStorage.getItem('speakAiDiaryEntries');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
// FIX: Added curly braces to the catch block to fix a syntax error.
        console.error("Falha ao carregar anotações do diário do localStorage:", error);
        return [];
    }
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveUserInput, setLiveUserInput] = useState<string>('');
  const [liveModelOutput, setLiveModelOutput] = useState<string>('');
  const [view, setView] = useState<View>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const chatRef = useRef<Chat | null>(null);
  const liveSessionRef = useRef<LiveSession | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const conversationsRef = useRef(conversations);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  const messages = activeConversation?.messages ?? [];
  const allMessages = [...messages];
  if (liveUserInput) {
      allMessages.push({ id: 'live-input', role: 'user', text: liveUserInput });
  }
  if (liveModelOutput) {
      allMessages.push({ id: 'live-model', role: 'model', text: liveModelOutput });
  }

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial height

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  useEffect(() => {
    conversationsRef.current = conversations;
  });

  useEffect(() => {
    try {
      localStorage.setItem('speakAiConversations', JSON.stringify(conversations));
    } catch (error) {
      console.error("Falha ao salvar conversas no localStorage:", error);
    }
  }, [conversations]);

  useEffect(() => {
    try {
        localStorage.setItem('speakAiDiaryEntries', JSON.stringify(diaryEntries));
    } catch (error) {
        console.error("Falha ao salvar anotações do diário no localStorage:", error);
    }
  }, [diaryEntries]);

  useEffect(() => {
    if (activeConversation) {
      const history = activeConversation.messages
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      chatRef.current = geminiService.createChat(history);
    }
  }, [activeConversationId, conversations]);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = isSidebarOpen ? 'hidden' : '';
    }
    return () => {
        if(body) body.style.overflow = '';
    }
  }, [isSidebarOpen]);


  const updateConversation = (id: string, updates: Partial<Omit<Conversation, 'id'>>) => {
    setConversations(prev => {
        const updatedConversations = prev.map(c => 
            c.id === id ? { ...c, ...updates, lastUpdated: Date.now() } : c
        );
        return updatedConversations.sort((a, b) => b.lastUpdated - a.lastUpdated);
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!chatRef.current || !activeConversationId) return;
    
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text };
    const currentMessages = activeConversation?.messages || [];
    const updatedMessages = [...currentMessages, userMessage];
    const isFirstMessage = currentMessages.length === 0;

    updateConversation(activeConversationId, { messages: updatedMessages });
    
    setIsLoading(true);

    try {
      if (isFirstMessage) {
        const title = await geminiService.generateTitle(text);
        updateConversation(activeConversationId, { title });
      }

      const response = await geminiService.sendMessage(chatRef.current, text);
      const modelMessage: Message = { id: Date.now().toString() + 'm', role: 'model', text: response.text };
      updateConversation(activeConversationId, { messages: [...updatedMessages, modelMessage] });
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = { id: Date.now().toString() + 'e', role: 'system', text: 'Desculpe, encontrei um erro. Por favor, tente novamente.' };
      updateConversation(activeConversationId, { messages: [...updatedMessages, errorMessage] });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewChat = () => {
    const newConversation: Conversation = {
        id: Date.now().toString(),
        title: 'Nova Conversa',
        messages: [],
        lastUpdated: Date.now()
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setView('chat');
    setIsSidebarOpen(false);
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setView('chat');
    setIsSidebarOpen(false);
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!activeConversationId) return;
    const currentConversation = conversations.find(c => c.id === activeConversationId);
    if (!currentConversation) return;

    const updatedMessages = currentConversation.messages.filter(m => m.id !== messageId);
    updateConversation(activeConversationId, { messages: updatedMessages });
  };

  const handleDeleteConversation = useCallback((idToDelete: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== idToDelete);
      if (activeConversationId === idToDelete) {
        setActiveConversationId(updated[0]?.id || null);
      }
      return updated;
    });
  }, [activeConversationId]);

  const handleDeleteDiaryEntry = (entryId: string) => {
    setDiaryEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const stopRecording = () => {
    if (liveSessionRef.current) {
        liveSessionRef.current.close();
        liveSessionRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    setIsRecording(false);
    setLiveUserInput('');
    setLiveModelOutput('');
  }

  const handleToggleRecording = async () => {
    if (isRecording) {
        stopRecording();
    } else {
        setIsRecording(true);
        try {
            const currentConvId = activeConversationId || (() => { handleNewChat(); return conversations[0]?.id || Date.now().toString() })();

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            const sessionPromise = geminiService.startLiveSession({
                onInputTranscription: setLiveUserInput,
                onOutputTranscription: setLiveModelOutput,
                onTurnComplete: (fullInput, fullOutput) => {
                    if (!fullInput.trim() && !fullOutput.trim()) return;

                    setConversations(prev => {
                        return prev.map(c => {
                            if (c.id === currentConvId) {
                                const newMessages: Message[] = [
                                    ...c.messages,
                                    ...(fullInput.trim() ? [{ id: Date.now().toString(), role: 'user' as const, text: fullInput }] : []),
                                    ...(fullOutput.trim() ? [{ id: Date.now().toString() + 'm', role: 'model' as const, text: fullOutput }] : [])
                                ];
                                
                                const history = newMessages
                                    .filter(m => m.role !== 'system')
                                    .map(m => ({ role: m.role, parts: [{ text: m.text }] }));
                                chatRef.current = geminiService.createChat(history);
                                
                                return { ...c, messages: newMessages, lastUpdated: Date.now() };
                            }
                            return c;
                        });
                    });
                    setLiveUserInput('');
                    setLiveModelOutput('');
                },
                onError: (e) => {
                    console.error(e);
                    stopRecording();
                },
                onClose: () => {
                   // This is handled by the stopRecording function
                }
            });

            liveSessionRef.current = await sessionPromise;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);

        } catch (error) {
            console.error("Failed to start recording:", error);
            alert("Não foi possível acessar o microfone. Por favor, verifique as permissões do seu navegador.");
            setIsRecording(false);
        }
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (view === 'diary') {
        return (
            <main className="diary-container">
                <Diary entries={diaryEntries} onDeleteEntry={handleDeleteDiaryEntry} />
            </main>
        )
    }

    if (view === 'prompt' || view === 'image' || view === 'video') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500" style={{gridArea: 'chat', gridRow: '2 / -1'}}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 className="text-xl font-medium mb-2 text-slate-300">Em Breve</h3>
                <p>A funcionalidade de {view === 'image' ? 'Imagem' : view === 'video' ? 'Vídeo' : 'Prompt'} estará disponível em breve.</p>
            </div>
        );
    }

    // Chat View
    if (activeConversation) {
        return (
            <>
                <ChatArea 
                    messages={allMessages} 
                    isLoading={isLoading}
                    onDeleteMessage={handleDeleteMessage}
                />
                <Composer 
                    onSendMessage={handleSendMessage} 
                    isLoading={isLoading} 
                    isRecording={isRecording}
                    onToggleRecording={handleToggleRecording}
                />
            </>
        )
    }
    return <EmptyState onNewChat={handleNewChat} />;
  }

  return (
    <div className="app-container">
      <div 
        className={`mobile-backdrop ${isSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <MainHeader 
        currentView={view}
        setView={setView}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        conversations={filteredConversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentView={view}
        setView={setView}
      />
      {renderContent()}
    </div>
  );
};

export default App;
