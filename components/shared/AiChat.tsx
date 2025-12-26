import { geminiService } from '@/lib/services/gimini';
import { ChatMessage } from '@/types/actionTypes';
import React, { useState, useRef, useEffect } from 'react';


const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your Amz-Analytics assistant. I can help you analyze your store performance, suggest pricing strategies, or explain complex trends. What can I do for you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage, isThinking: useThinking }]);
    setIsLoading(true);

    try {
      const responseText = await geminiService.sendMessage(userMessage, useThinking);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not reach the AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Analytics Assistant</h3>
            <p className="text-xs text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Powered by Gemini 3 Pro
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-500">Thinking Mode</span>
          <button 
            onClick={() => setUseThinking(!useThinking)}
            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useThinking ? 'bg-orange-500' : 'bg-gray-200'}`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useThinking ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-orange-500 text-white rounded-br-none' 
                : 'bg-white border text-gray-800 rounded-bl-none'
            }`}>
              {msg.isThinking && (
                <div className="mb-2 flex items-center text-[10px] font-bold uppercase tracking-wider opacity-70">
                  <span className="mr-1">🧠</span> Deep Analysis Active
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm rounded-bl-none flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-xs text-gray-400 italic">
                {useThinking ? 'Analyzing complex patterns...' : 'Assistant is typing...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={useThinking ? "Ask a complex analysis question..." : "Ask me anything about your data..."}
            className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-orange-400 hover:bg-orange-500 disabled:bg-gray-300 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-400 text-center">
          Thinking Mode uses advanced reasoning for complex data queries and might take longer to respond.
        </p>
      </form>
    </div>
  );
};

export default AIChat;