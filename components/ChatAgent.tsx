
import React, { useState, useRef, useEffect } from 'react';
import { processChat, speakHindi } from '../services/gemini';
import { CrmAction } from '../types';

const ChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([
    { text: "Namaste! Main Sudarshan Assistant hoon. Business growth ya khata book ke liye kuch puchiye.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const response: CrmAction = await processChat(userMsg);
      setMessages(prev => [...prev, { text: response.reply, sender: 'bot' }]);
      speakHindi(response.reply);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Network thoda dheela hai, kripya dobara try karein.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50/50">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] relative shadow-sm border ${
              m.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-700' 
                : 'bg-white text-slate-800 font-bold rounded-tl-none border-slate-100 shadow-md'
            }`}>
              <p className="text-base leading-relaxed tracking-tight">{m.text}</p>
              {m.sender === 'bot' && (
                <button 
                  onClick={() => speakHindi(m.text)}
                  className="absolute -right-12 bottom-2 w-9 h-9 rounded-full bg-white text-indigo-600 flex items-center justify-center active:scale-90 transition-all border border-slate-100 shadow-sm"
                >
                  <i className="fas fa-volume-up text-sm"></i>
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-sm flex gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="flex gap-3 max-w-md mx-auto items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Kuch likhein..."
            className="flex-1 bg-slate-100 border-none rounded-[1.5rem] px-6 py-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-90 transition-all disabled:opacity-30"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;
