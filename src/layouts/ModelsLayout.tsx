import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Cpu, Settings2, GitCompare, Activity, Menu, X } from 'lucide-react';
import './ModelsLayout.css';

export const ModelsLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
          <NavLink 
            to="/models" 
            end 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          >
            <Cpu size={18} /> Model Selection
          </NavLink>
          <NavLink 
            to="/models/compare" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          >
            <GitCompare size={18} /> Compare Models
          </NavLink>
          <NavLink 
            to="/models/custom" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          >
            <Settings2 size={18} /> Custom Models
          </NavLink>
          <NavLink 
            to="/models/usage" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          >
            <Activity size={18} /> Usage & Analytics
          </NavLink>
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
