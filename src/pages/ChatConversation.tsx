import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Paperclip, Mic, ArrowUp, Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, X, FileText, Image as ImageIcon } from 'lucide-react';
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
  
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/chat/new') {
      setMessages([{
        id: Date.now().toString(),
        role: 'ai',
        content: 'Hi there! I am Elevate AI. How can I help you today?'
      }]);
    }
  }, [location.pathname]);
  
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    let content = input;
    if (attachments.length > 0) {
      const fileNames = attachments.map(f => f.name).join(', ');
      content += (content ? '\n' : '') + `[Attached: ${fileNames}]`;
    }

    const newMsg: Message = { id: Date.now().toString(), role: 'user', content };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput('');
    setAttachments([]);
    setIsLoading(true);
    
    try {
      // Map conversation history to OpenRouter format
      // Skip the initial greeting if it's the only message and it's a new chat, but it's safe to include.
      const apiMessages = updatedMessages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseContent = data.choices[0].message.content;

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: aiResponseContent
      }]);
    } catch (error) {
      console.error('Error fetching from OpenRouter:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: 'Sorry, I encountered an error communicating with the server. Please check your API key and connection.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false; // keep it simple, just final result

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div 
      className="chat-conversation-wrapper"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
        {isLoading && (
          <div className="message-wrapper message-ai">
            <div className="message-content-box">
              <div className="ai-avatar">
                <Bot size={16} />
              </div>
              <div className="message-text">
                <p className="loading-dots">Typing<span>.</span><span>.</span><span>.</span></p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`chat-input-container ${isDragging ? 'drag-active' : ''}`}>
        {isDragging && (
          <div className="drag-overlay">
            <p>Drop files here to attach</p>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="attachments-preview">
            {attachments.map((file, i) => (
              <div key={i} className="attachment-item">
                {file.type.startsWith('image/') ? <ImageIcon size={16} /> : <FileText size={16} />}
                <span className="attachment-name">{file.name}</span>
                <button className="remove-attachment" onClick={() => removeAttachment(i)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="chat-input-box">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            multiple 
            onChange={handleFileSelect} 
          />
          <button className="icon-btn" title="Attach file" onClick={() => fileInputRef.current?.click()}>
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
          <button 
            className={`icon-btn ${isListening ? 'listening' : ''}`} 
            title="Voice Input"
            onClick={handleVoiceInput}
          >
            <Mic size={20} color={isListening ? '#ef4444' : 'currentColor'} />
          </button>
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
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
