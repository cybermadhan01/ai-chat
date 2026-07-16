import React from 'react';
import { Button } from '../components/Button';
import './Settings.css'; // Reuse settings form styles

export const CustomModel: React.FC = () => {
  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2>Custom Model Configuration</h2>
        <p style={{ color: 'var(--color-text-body)', marginBottom: '32px' }}>
          Connect your own API endpoints or adjust global system prompts.
        </p>
        
        <div className="settings-section">
          <h3>API Configuration</h3>
          <div className="form-group">
            <label htmlFor="provider">Provider</label>
            <select id="provider" className="form-select">
              <option value="openai">OpenAI Compatible</option>
              <option value="anthropic">Anthropic</option>
              <option value="ollama">Local (Ollama)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="endpoint">Base URL Endpoint</label>
            <input type="text" id="endpoint" placeholder="https://api.openai.com/v1" className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="apikey">API Key</label>
            <input type="password" id="apikey" placeholder="sk-..." className="form-input" />
          </div>
        </div>

        <div className="settings-section">
          <h3>System Behavior</h3>
          <div className="form-group">
            <label htmlFor="system-prompt">Global System Prompt</label>
            <textarea 
              id="system-prompt" 
              className="form-input" 
              style={{ minHeight: '120px', resize: 'vertical' }}
              placeholder="You are a helpful AI assistant..."
            ></textarea>
          </div>
        </div>

        <div className="settings-actions">
          <Button variant="primary">Save Configuration</Button>
        </div>
      </div>
    </div>
  );
};
