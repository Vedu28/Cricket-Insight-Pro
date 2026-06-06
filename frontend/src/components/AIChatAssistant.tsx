import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trophy, Terminal, Sparkles } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface AIChatAssistantProps {
  backendUrl: string;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ backendUrl }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I am your **AI Cricket Insights Assistant**. I can query match records, predict next-game outcomes, or compare player forms. Try asking me: \n\n* *'Who is in better form, Kohli or Rohit?'*\n* *'Predict Kohli's next score'* \n* *'Compare Mitchell Starc and Jasprit Bumrah'*" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/insights/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Error: Could not reach the AI insights endpoint. Is the python server running?" }]);
    } finally {
      setLoading(false);
    }
  };

  // Function to render markdown-like bold text in response
  const formatText = (text: string) => {
    // Basic conversion of **bold** and *bullet* elements
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let formatted = line;
      // Bold converter
      const boldRegex = /\*\*(.*?)\*\*/g;
      const italicRegex = /\*(.*?)\*/g;
      
      const elements = [];
      let lastIdx = 0;
      let match;
      
      // Match bold
      const htmlText = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

      return (
        <p 
          key={i} 
          className={`text-sm leading-relaxed ${line.startsWith('*') || line.startsWith('-') ? 'pl-4 list-item list-none' : ''}`}
          dangerouslySetInnerHTML={{ __html: htmlText }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-[75vh] glass-panel rounded-2xl border border-slate-900 overflow-hidden shadow-2xl relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>

      {/* Top Banner */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200 flex items-center">
              AI Insights Engine
              <Sparkles className="w-3.5 h-3.5 text-accent-gold ml-1.5 animate-pulse" />
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">FastAPI / Flask query processor active</p>
          </div>
        </div>
        
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400">
          <Terminal className="w-3 h-3 mr-1" />
          Online
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2.5 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-lg shrink-0 ${isUser ? 'bg-blue-500/15 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`p-4 rounded-2xl border text-slate-300 space-y-1.5 shadow-md ${
                  isUser 
                    ? 'bg-blue-950/20 border-blue-900/30 rounded-tr-none text-slate-200' 
                    : 'bg-slate-900/50 border-slate-800/80 rounded-tl-none'
                }`}>
                  {formatText(msg.text)}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 rounded-tl-none flex space-x-1 items-center py-5 px-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-4 bg-slate-950/60 border-t border-slate-900 flex space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Cricket Assistant..."
          className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3.5 rounded-xl shadow-lg shadow-emerald-500/10 transition active:scale-[0.96]"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
};
