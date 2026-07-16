import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import './ModelSelection.css';

export const ModelSelection: React.FC = () => {
  const navigate = useNavigate();

  const models = [
    { id: 'gpt-4', name: 'GPT-4 Omni', provider: 'OpenAI', description: 'Most capable model, great for complex tasks, reasoning, and coding.', type: 'Primary' },
    { id: 'claude-3', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Excellent at writing, nuanced understanding, and large context windows.', type: 'Primary' },
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and cost-effective model for everyday tasks.', type: 'Fast' },
    { id: 'llama-3', name: 'Llama 3 70B', provider: 'Meta', description: 'Powerful open-source model optimized for general purpose chat.', type: 'Open Source' },
  ];

  return (
    <div className="model-selection-page">
      <div className="page-header">
        <h2>Available Models</h2>
        <p>Select a model to view details or configure custom settings.</p>
      </div>

      <div className="models-grid">
        {models.map(model => (
          <Card key={model.id} className="model-card" variant="standard" onClick={() => navigate(`/models/${model.id}`)}>
            <div className="model-card-header">
              <h3>{model.name}</h3>
              <span className="model-badge">{model.type}</span>
            </div>
            <p className="model-provider">by {model.provider}</p>
            <p className="model-desc">{model.description}</p>
            
            <div className="model-card-actions">
              <Button variant="secondary" style={{ width: '100%', height: '48px' }} onClick={(e) => {
                e.stopPropagation();
                navigate(`/models/${model.id}`);
              }}>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
