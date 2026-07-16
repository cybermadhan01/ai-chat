import React from 'react';
import { Button } from '../components/Button';
import './Settings.css';

export const Settings: React.FC = () => {
  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2>Settings</h2>
        
        <div className="settings-section">
          <h3>Profile Information</h3>
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input type="text" id="name" defaultValue="Admin User" className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" defaultValue="admin@cybermadhan.in" className="form-input" />
          </div>
        </div>

        <div className="settings-section">
          <h3>Preferences</h3>
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select id="theme" className="form-select">
              <option value="light">Elevate Light (Default)</option>
              <option value="dark">Elevate Dark</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="model">Default AI Model</label>
            <select id="model" className="form-select">
              <option value="gpt-4">GPT-4 (Recommended)</option>
              <option value="gpt-3.5">GPT-3.5 Turbo</option>
              <option value="claude-3">Claude 3 Opus</option>
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <Button variant="primary">Save Changes</Button>
          <Button variant="secondary" style={{ marginLeft: '16px' }}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};
