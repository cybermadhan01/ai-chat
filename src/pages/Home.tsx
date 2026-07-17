import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Code, BarChart3, MessageSquare, Quote } from 'lucide-react';
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
            Elevate your workflow with an intelligent assistant designed for clarity, speed, and precision. Built on the powerful Zylohub Design System.
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

      {/* Section 1: Trusted By (Logos) */}
      <section className="trusted-section">
        <p className="trusted-label">TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
        <div className="trusted-logos">
          {/* Simulated logos using text and simple styling */}
          <div className="logo-placeholder">Acme Corp</div>
          <div className="logo-placeholder">GlobalTech</div>
          <div className="logo-placeholder">Nova Solutions</div>
          <div className="logo-placeholder">Quantum UI</div>
          <div className="logo-placeholder">Nexus</div>
        </div>
      </section>

      {/* Section 2: Enterprise Solutions (Use Cases) */}
      <section className="solutions-section">
        <div className="solutions-container">
          <h2>Built for Enterprise Scale</h2>
          <p className="section-subtitle">
            Discover how Elevate AI integrates seamlessly into your professional workflows to drive productivity.
          </p>
          <div className="solutions-grid">
            <Card className="solution-card">
              <MessageSquare size={32} color="var(--primary-yellow)" className="solution-icon" />
              <h3>Customer Support</h3>
              <p>Automate triage and provide instant, accurate responses to customer inquiries 24/7.</p>
            </Card>
            
            <Card className="solution-card" variant="featured">
              <Code size={32} color="var(--interactive-black)" className="solution-icon" />
              <h3>Code Generation</h3>
              <p>Accelerate development cycles with intelligent code suggestions, debugging, and refactoring.</p>
            </Card>

            <Card className="solution-card">
              <BarChart3 size={32} color="var(--primary-yellow)" className="solution-icon" />
              <h3>Data Analysis</h3>
              <p>Extract meaningful insights from complex datasets using natural language queries.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works (Workflow) */}
      <section className="workflow-section">
        <div className="workflow-container">
          <h2>Streamlined Workflow</h2>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <h4>Connect Data</h4>
              <p>Securely integrate your existing knowledge bases and APIs.</p>
            </div>
            <div className="workflow-connector"></div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <h4>Configure Models</h4>
              <p>Select and fine-tune the optimal AI models for your specific use cases.</p>
            </div>
            <div className="workflow-connector"></div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <h4>Deploy Instantly</h4>
              <p>Roll out intelligent agents across your organization with a single click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            <Card className="testimonial-card">
              <Quote size={24} className="quote-icon" />
              <p className="testimonial-text">"Elevate AI has completely transformed our engineering velocity. We're shipping features 30% faster thanks to the code generation capabilities."</p>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div>
                  <div className="author-name">Sarah Jenkins</div>
                  <div className="author-role">VP of Engineering, Nova Solutions</div>
                </div>
              </div>
            </Card>
            <Card className="testimonial-card">
              <Quote size={24} className="quote-icon" />
              <p className="testimonial-text">"The contextual awareness of the support agent means our customers get accurate answers immediately. Customer satisfaction is at an all-time high."</p>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div>
                  <div className="author-name">Michael Chang</div>
                  <div className="author-role">Head of CX, GlobalTech</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 5: Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Transform Your Workflow?</h2>
          <p>Join thousands of professionals already using Elevate AI.</p>
          <div className="cta-actions">
            <Button variant="accent" onClick={() => navigate('/chat')}>
              Get Started for Free
            </Button>
            <Button variant="secondary" onClick={() => navigate('/settings')}>
              Request a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
