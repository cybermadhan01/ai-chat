import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
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
          <NavLink 
            to="/chat/dashboard" 
            className={({ isActive }) => `history-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
            style={{ fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/chat/history" 
            className={({ isActive }) => `history-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
            style={{ fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '16px' }}
          >
            All History
          </NavLink>
          
          <div className="history-section-title" style={{ marginTop: '24px', pointerEvents: 'none' }}>Recent Chats</div>
          <NavLink 
            to="/chat/1" 
            className={({ isActive }) => `history-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          >
            Build ChatGPT Clone UI
          </NavLink>
          <NavLink 
            to="/chat/2" 
            className={({ isActive }) => `history-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          >
            Latest UX/UI Trends 2026
          </NavLink>
          <NavLink 
            to="/chat/3" 
            className={({ isActive }) => `history-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          >
            Python Script Debugging
          </NavLink>
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
