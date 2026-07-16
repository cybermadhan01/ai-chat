import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import './ChatHistory.css';

export const ChatHistory: React.FC = () => {
  const navigate = useNavigate();

  const history = [
    { id: '1', title: 'Build ChatGPT Clone UI', date: '2026-07-15', snippet: 'You: I want to build a chatbot like ChatGPT with all of its features...' },
    { id: '2', title: 'Latest UX/UI Trends 2026', date: '2026-07-14', snippet: 'AI: The primary trend for 2026 involves deep spatial integration and...' },
    { id: '3', title: 'Python Script Debugging', date: '2026-07-12', snippet: 'You: Help me figure out why this array index is out of bounds...' },
    { id: '4', title: 'Machine Learning Roadmap', date: '2026-07-10', snippet: 'AI: Here is a comprehensive 6-month roadmap for mastering ML...' },
    { id: '5', title: 'React Hooks Explanation', date: '2026-07-08', snippet: 'You: Explain useEffect dependency array in simple terms.' },
  ];

  return (
    <div className="chat-history-page">
      <div className="history-header">
        <h2>All Chat History</h2>
      </div>

      <div className="history-table-container">
        <Card variant="standard" className="history-card">
          <table className="history-table">
            <thead>
              <tr>
                <th>Conversation Title</th>
                <th>Preview</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((chat) => (
                <tr key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)}>
                  <td className="title-cell"><strong>{chat.title}</strong></td>
                  <td className="snippet-cell">{chat.snippet}</td>
                  <td className="date-cell">{chat.date}</td>
                  <td className="action-cell">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/chat/shared/${chat.id}`); }}>
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};
