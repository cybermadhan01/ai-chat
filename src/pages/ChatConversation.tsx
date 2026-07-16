import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, ArrowUp, Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import './ChatConversation.css';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export const ChatConversation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Welcome back! I am ready to help you build your next big project. What are we working on today?'
    },
    {
      id: '2',
      role: 'user',
      content: 'I want to build a chatbot like ChatGPT with all of its features and options showing in my UI. It should use trending fonts and a trending UI/UX design automatically.'
    },
    {
      id: '3',
      role: 'ai',
      content: 'I have designed a sleek, modern UI for you that follows the latest 2026 design trends. Here are the features included in this interface:\n\n- Typography: Uses Outfit for headers and Inter for body text.\n- Color Palette: Deep Navy (#0F172A) and Vibrant Yellow (#FACC15) accents.\n- Rich Input Box: Modern pill shape with attachment and voice support.'
    }
  ]);
  
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'That sounds great! This is a simulated response demonstrating the UI interaction.'
      }]);
    }, 1000);
  };

  return (
    <div className="chat-conversation-wrapper">
      <div className="chat-messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}>
            <div className="message-content-box">
              {msg.role === 'ai' && (
                <div className="ai-avatar">
                  <Bot size={16} />
                </div>
              )}
              <div className="message-text">
                {msg.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                
                {msg.role === 'ai' && (
                  <div className="message-actions">
                    <button><Copy size={16} /></button>
                    <button><ThumbsUp size={16} /></button>
                    <button><ThumbsDown size={16} /></button>
                    <button><RotateCcw size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <div className="chat-input-box">
          <button className="icon-btn" title="Attach file">
            <Paperclip size={20} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message Elevate AI..."
            rows={1}
          />
          <button className="icon-btn" title="Voice Input">
            <Mic size={20} />
          </button>
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <ArrowUp size={20} />
          </button>
        </div>
        <div className="disclaimer">
          AI can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
};
