import React from 'react';
import { Card } from '../components/Card';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import './ModelUsage.css';

export const ModelUsage: React.FC = () => {
  return (
    <div className="model-usage-page">
      <div className="page-header">
        <h2>Usage & Analytics</h2>
        <p>Monitor your API token usage and estimated costs for the current billing cycle.</p>
      </div>

      <div className="usage-stats-grid">
        <Card className="usage-stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Cost (MTD)</span>
            <TrendingUp size={20} color="var(--color-primary)" />
          </div>
          <div className="stat-value">$142.50</div>
          <div className="stat-subtitle">+12% from last month</div>
        </Card>

        <Card className="usage-stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Tokens Used</span>
            <BarChart3 size={20} color="var(--color-primary)" />
          </div>
          <div className="stat-value">4.2M</div>
          <div className="stat-subtitle">Input: 3.1M | Output: 1.1M</div>
        </Card>

        <Card className="usage-stat-card" style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', borderColor: 'var(--color-accent)' }}>
          <div className="stat-header">
            <span className="stat-title" style={{ color: '#B45309' }}>Usage Limit</span>
            <AlertCircle size={20} color="#B45309" />
          </div>
          <div className="stat-value" style={{ color: '#B45309' }}>71%</div>
          <div className="stat-subtitle" style={{ color: '#B45309' }}>$142.50 / $200.00 Limit</div>
        </Card>
      </div>

      <Card variant="standard" className="chart-placeholder">
        <div className="chart-header">
          <h3>Usage by Model</h3>
        </div>
        <div className="mock-bar-chart">
          <div className="bar-item">
            <span className="bar-label">GPT-4 Omni</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: '65%' }}></div></div>
            <span className="bar-value">2.8M</span>
          </div>
          <div className="bar-item">
            <span className="bar-label">Claude 3 Opus</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: '25%' }}></div></div>
            <span className="bar-value">1.1M</span>
          </div>
          <div className="bar-item">
            <span className="bar-label">GPT-3.5 Turbo</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: '10%' }}></div></div>
            <span className="bar-value">0.3M</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
