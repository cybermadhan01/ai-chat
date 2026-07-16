import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import './ChatLayout.css';

export const ChatLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="chat-layout">
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: '500' }}>Chat Menu</span>
      </button>

      {/* Sidebar */}
      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="new-chat-btn" onClick={() => handleNav('/chat/new')}>
          <span style={{ fontSize: '20px' }}>+</span> New chat
        </button>
        
        <div className="chat-history-sidebar">
          <div className="history-section-title" onClick={() => handleNav('/chat/dashboard')} style={{cursor: 'pointer', color: 'var(--color-primary)'}}>Dashboard</div>
          <div className="history-section-title" onClick={() => handleNav('/chat/history')} style={{cursor: 'pointer', marginTop: '16px'}}>All History</div>
          
          <div className="history-section-title" style={{ marginTop: '24px' }}>Recent Chats</div>
          <div className="history-item" onClick={() => handleNav('/chat/1')}>Build ChatGPT Clone UI</div>
          <div className="history-item" onClick={() => handleNav('/chat/2')}>Latest UX/UI Trends 2026</div>
          <div className="history-item" onClick={() => handleNav('/chat/3')}>Python Script Debugging</div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile" onClick={() => handleNav('/settings')}>
            <div className="user-info">
              <div className="user-avatar"><User size={18} /></div>
              <span>Admin User</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="chat-main-area">
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};
