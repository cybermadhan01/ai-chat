import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Cpu, Settings2, GitCompare, Activity, Menu, X } from 'lucide-react';
import './ModelsLayout.css';

export const ModelsLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="models-layout">
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: '500' }}>Models Menu</span>
      </button>

      {/* Sidebar */}
      <aside className={`models-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2 className="sidebar-heading">AI Models</h2>
        
        <div className="models-nav">
          <div className="nav-item" onClick={() => handleNav('/models')}>
            <Cpu size={18} /> Model Selection
          </div>
          <div className="nav-item" onClick={() => handleNav('/models/compare')}>
            <GitCompare size={18} /> Compare Models
          </div>
          <div className="nav-item" onClick={() => handleNav('/models/custom')}>
            <Settings2 size={18} /> Custom Models
          </div>
          <div className="nav-item" onClick={() => handleNav('/models/usage')}>
            <Activity size={18} /> Usage & Analytics
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="models-main-area">
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};
