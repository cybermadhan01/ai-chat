import React from 'react';
import { Bot, Share2 } from 'lucide-react';
import { Button } from '../components/Button';
import './ChatConversation.css'; // Reusing chat conversation styles

export const SharedChat: React.FC = () => {
  return (
    <div className="chat-conversation-wrapper" style={{ backgroundColor: 'var(--color-bg-page)' }}>
      <div style={{ padding: '24px', borderBottom: 'var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Shared Conversation</h3>
        <Button variant="secondary" style={{ height: '40px', minWidth: '120px' }}><Share2 size={16} /> Copy Link</Button>
      </div>
      
      <div className="chat-messages-container" style={{ paddingBottom: '40px' }}>
        <div className="message-wrapper message-user">
          <div className="message-content-box">
            <div className="message-text">
              <p>I want to build a chatbot like ChatGPT with all of its features and options showing in my UI. It should use trending fonts and a trending UI/UX design automatically.</p>
            </div>
          </div>
        </div>

        <div className="message-wrapper message-ai">
          <div className="message-content-box">
            <div className="ai-avatar"><Bot size={16} /></div>
            <div className="message-text">
              <p>I have designed a sleek, modern UI for you that follows the latest 2026 design trends. Here are the features included in this interface:</p>
              <p>- Typography: Uses Inter exclusively for all text elements.</p>
              <p>- Color Palette: Deep Black (#000000) and Primary Action Yellow (#FFD02B) accents.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
