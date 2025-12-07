import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { chatWithStylist } from '../services/geminiService';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hey there! I\'m SoleBot. Need help finding a fit or choosing a size?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Format history for Gemini
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const response = await chatWithStylist(history, userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response || "I'm speechless right now!" }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-[#1ce783] text-black rounded-full shadow-[0_0_20px_rgba(28,231,131,0.4)] hover:scale-110 flex items-center justify-center transition-all z-50"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-[#15171c] rounded-2xl shadow-2xl border border-gray-800 flex flex-col z-50 overflow-hidden h-[500px]">
      <div className="bg-[#0b0c0f] p-4 flex justify-between items-center text-white border-b border-gray-800">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#1ce783] rounded-full animate-pulse shadow-[0_0_8px_#1ce783]"></div>
            <h3 className="font-bold tracking-wide">SoleBot Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#15171c] space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              msg.role === 'user' 
                ? 'bg-[#1ce783] text-black font-medium rounded-br-none shadow-lg' 
                : 'bg-[#252830] text-gray-200 border border-gray-700 shadow-sm rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-[#252830] p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-700">
                <Loader2 className="h-4 w-4 animate-spin text-[#1ce783]" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#0b0c0f] border-t border-gray-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about shoes..."
          className="flex-1 bg-[#15171c] text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1ce783] border border-gray-700 placeholder-gray-500"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-[#1ce783] text-black p-2 rounded-full hover:bg-[#15bd6b] disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};