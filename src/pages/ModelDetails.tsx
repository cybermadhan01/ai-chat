import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import './ModelDetails.css';

export const ModelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data fetching based on ID
  const modelName = id === 'gpt-4' ? 'GPT-4 Omni' : 'Claude 3 Opus';
  const provider = id === 'gpt-4' ? 'OpenAI' : 'Anthropic';

  return (
    <div className="model-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back to Models
      </button>

      <div className="details-header">
        <h1>{modelName}</h1>
        <p className="provider-subtitle">Provided by {provider}</p>
      </div>

      <div className="details-content">
        <Card className="info-card">
          <h3>Capabilities</h3>
          <ul className="capabilities-list">
            <li><CheckCircle2 size={18} color="var(--color-accent)" /> Advanced reasoning and logic</li>
            <li><CheckCircle2 size={18} color="var(--color-accent)" /> 128k Context Window</li>
            <li><CheckCircle2 size={18} color="var(--color-accent)" /> Vision and image analysis</li>
            <li><CheckCircle2 size={18} color="var(--color-accent)" /> Code generation and debugging</li>
          </ul>
        </Card>

        <Card className="info-card">
          <h3>Pricing & Usage</h3>
          <div className="pricing-grid">
            <div className="price-item">
              <span className="price-label">Input Tokens</span>
              <span className="price-value">$5.00 / 1M</span>
            </div>
            <div className="price-item">
              <span className="price-label">Output Tokens</span>
              <span className="price-value">$15.00 / 1M</span>
            </div>
          </div>
          <Button variant="primary" style={{ marginTop: '32px', width: '100%' }}>
            Set as Default Model
          </Button>
        </Card>
      </div>
    </div>
  );
};
