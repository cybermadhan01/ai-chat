import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MessageSquare, Clock, BarChart2 } from 'lucide-react';
import './ChatDashboard.css';

export const ChatDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="chat-dashboard">
      <div className="dashboard-header">
        <h2>Chat Dashboard</h2>
        <Button variant="accent" onClick={() => navigate('/chat/new')}>
          Start New Chat
        </Button>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card">
          <MessageSquare size={24} color="var(--color-primary)" />
          <div className="stat-info">
            <span className="stat-value">24</span>
            <span className="stat-label">Total Chats</span>
          </div>
        </Card>
        <Card className="stat-card">
          <Clock size={24} color="var(--color-primary)" />
          <div className="stat-info">
            <span className="stat-value">12h</span>
            <span className="stat-label">Time Saved</span>
          </div>
        </Card>
        <Card className="stat-card">
          <BarChart2 size={24} color="var(--color-primary)" />
          <div className="stat-info">
            <span className="stat-value">1.2k</span>
            <span className="stat-label">Queries Answered</span>
          </div>
        </Card>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <Card className="activity-item" variant="standard" onClick={() => navigate('/chat/1')}>
            <div className="activity-content">
              <h4>Build ChatGPT Clone UI</h4>
              <p>You: I want to build a chatbot like ChatGPT with all of its features...</p>
            </div>
            <span className="activity-time">2 hours ago</span>
          </Card>
          
          <Card className="activity-item" variant="standard" onClick={() => navigate('/chat/2')}>
            <div className="activity-content">
              <h4>Latest UX/UI Trends 2026</h4>
              <p>AI: The primary trend for 2026 involves deep spatial integration and...</p>
            </div>
            <span className="activity-time">Yesterday</span>
          </Card>
        </div>
      </div>
    </div>
  );
};
