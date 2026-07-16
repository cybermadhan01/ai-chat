import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Zap, Shield, Sparkles } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Experience Next-Gen<br />Conversational AI</h1>
          <p className="hero-subtitle">
            Elevate your workflow with an intelligent assistant designed for clarity, speed, and precision. Built on the powerful Elevate Design System.
          </p>
          <div className="hero-actions">
            <Button variant="accent" onClick={() => navigate('/chat')}>
              Start Chatting Now
            </Button>
            <Button variant="secondary" onClick={() => navigate('/settings')}>
              Configure Settings
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2>Why Choose Elevate AI</h2>
          <div className="feature-grid">
            <Card className="feature-card">
              <Zap size={40} color="var(--color-accent)" className="feature-icon" />
              <h3>Lightning Fast</h3>
              <p>Get instant responses to complex queries without any noticeable latency. Time is your most valuable asset.</p>
            </Card>
            
            <Card className="feature-card">
              <Shield size={40} color="var(--color-accent)" className="feature-icon" />
              <h3>Enterprise Security</h3>
              <p>Your data remains yours. We employ state-of-the-art encryption to ensure your conversations stay private.</p>
            </Card>

            <Card className="feature-card">
              <Sparkles size={40} color="var(--color-accent)" className="feature-icon" />
              <h3>Smart Context</h3>
              <p>Elevate AI remembers the nuances of your conversation, providing highly contextual and relevant answers.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
