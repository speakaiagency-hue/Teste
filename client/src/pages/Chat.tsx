import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Trash2, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message, ChatHistoryItem } from "./types";
import { sendMessage } from "./services/geminiService";

const LOGO_URL =
  "https://speakia.ai/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-20-at-23.50.59.jpeg";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Eu sou Speak AI. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [useContext, setUseContext] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const confirmTimeoutRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    if (confirmClear) setConfirmClear(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      let history: ChatHistoryItem[] = [];
      if (useContext) {
        history = messages
          .filter((m) => m.id !== "1")
          .map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          }));
      }

      const responseText = await sendMessage(input, history);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Erro inesperado.";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `❌ **Erro:** ${errorMsg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearClick = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      if (confirmTimeoutRef.current)
        window.clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = window.setTimeout(() => {
        setConfirmClear(false);
      }, 3000);
    } else {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Olá! Conversa limpa. Como posso ajudar agora?",
          timestamp: new Date(),
        },
      ]);
      setConfirmClear(false);
      if (confirmTimeoutRef.current)
        window.clearTimeout(confirmTimeoutRef.current);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#020617] text-slate-200 overflow-hidden font-light">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg shadow-2xl border border-white/5">
            <img
              src={LOGO_URL}
              alt="Speak AI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-medium tracking-tight bg-gradient-to-r from-[#2d8ff9] to-[#5826fe] bg-clip-text text-transparent">
            Speak AI
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {confirmClear && (
            <span className="text-[10px] text-[#5826fe] animate-pulse font-normal uppercase tracking-tighter">
              Confirmar?
            </span>
          )}
          <button
            onClick={handleClearClick}
            className={`p-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              confirmClear
                ? "bg-[#5826fe]/20 text-[#5826fe] ring-1 ring-[#5826fe]/50 shadow-[0_0_15px_rgba(88,38,254,0.3)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {confirmClear ? (
              <Check className="w-5 h-5" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8 pb-32 flex flex-col items-center">
          {messages.map((m) => (
            <div
              key={m.id}
              className="flex w-full justify-center group animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="w-full">
                <div
                  className={`relative px-6 py-5 rounded-[2rem] shadow-lg border w-full text-center transition-all ${
                    m.role === "user"
                      ? "bg-[#2d8ff9]/5 border-[#2d8ff9]/20 text-[#2d8ff9]"
                      : "bg-slate-900/40 backdrop-blur-sm border-slate-800/50 text-slate-300"
                  }`}
                >
                  <div className="prose prose-sm prose-invert max-w-none break-words leading-relaxed mx-auto font-light tracking-wide">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-[10px] text-slate-600 font-normal tracking-wider">
                      {m.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full justify-center animate-in fade-in">
              <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 px-6 py-4 rounded-full w-fit flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#2d8ff9] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-[#5826fe] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-[#2d8ff9] rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

          {/* Footer */}
      <footer className="flex-shrink-0 p-4 md:p-10 bg-slate-950 border-t border-slate-800/60 pb-[calc(6rem+env(safe-area-inset-bottom))] relative z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-3xl focus-within:border-[#2d8ff9]/50 focus-within:ring-4 focus-within:ring-[#2d8ff9]/10 shadow-2xl transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escreva sua mensagem aqui..."
              rows={1}
              className="w-full bg-transparent text-slate-200 py-5 pl-7 pr-16 outline-none resize-none max-h-32 custom-scrollbar text-center font-normal tracking-wide placeholder:text-slate-600"
              style={{ height: "64px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`absolute right-3 w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                input.trim() && !isTyping
                  ? "bg-gradient-to-tr from-[#2d8ff9] to-[#5826fe] text-white hover:opacity-90 shadow-[0_0_20px_rgba(88,38,254,0.4)] active:scale-90"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
