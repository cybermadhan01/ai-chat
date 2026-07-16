import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Check, X } from 'lucide-react';
import './ModelCompare.css';

export const ModelCompare: React.FC = () => {
  return (
    <div className="model-compare-page">
      <div className="page-header">
        <h2>Model Comparison</h2>
        <p>Compare capabilities and pricing across different AI models.</p>
      </div>

      <div className="compare-grid">
        <Card className="compare-card">
          <h3>GPT-4 Omni</h3>
          <p className="provider">OpenAI</p>
          <div className="price-tag">$5.00 <span>/ 1M input</span></div>
          
          <ul className="feature-list">
            <li><Check size={16} color="var(--color-primary)" /> Complex Reasoning</li>
            <li><Check size={16} color="var(--color-primary)" /> 128k Context</li>
            <li><Check size={16} color="var(--color-primary)" /> Vision & Image</li>
            <li><Check size={16} color="var(--color-primary)" /> Code Generation</li>
          </ul>
          <Button variant="secondary" style={{ width: '100%', marginTop: 'auto' }}>Select Model</Button>
        </Card>

        <Card className="compare-card">
          <h3>Claude 3 Opus</h3>
          <p className="provider">Anthropic</p>
          <div className="price-tag">$15.00 <span>/ 1M input</span></div>
          
          <ul className="feature-list">
            <li><Check size={16} color="var(--color-primary)" /> Deep Nuance</li>
            <li><Check size={16} color="var(--color-primary)" /> 200k Context</li>
            <li><Check size={16} color="var(--color-primary)" /> Vision & Image</li>
            <li><Check size={16} color="var(--color-primary)" /> Nuanced Writing</li>
          </ul>
          <Button variant="secondary" style={{ width: '100%', marginTop: 'auto' }}>Select Model</Button>
        </Card>

        <Card className="compare-card">
          <h3>Llama 3 70B</h3>
          <p className="provider">Meta / Open Source</p>
          <div className="price-tag">$0.50 <span>/ 1M input</span></div>
          
          <ul className="feature-list">
            <li><Check size={16} color="var(--color-primary)" /> Fast Inference</li>
            <li><Check size={16} color="var(--color-primary)" /> 8k Context</li>
            <li><X size={16} color="var(--color-text-light)" /> <span style={{ color: 'var(--color-text-light)' }}>Vision Support</span></li>
            <li><Check size={16} color="var(--color-primary)" /> Chat & QA</li>
          </ul>
          <Button variant="secondary" style={{ width: '100%', marginTop: 'auto' }}>Select Model</Button>
        </Card>
      </div>
    </div>
  );
};
