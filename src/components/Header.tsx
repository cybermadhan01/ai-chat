import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Bot, Menu, X } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="app-header">
      <div className="header-container">
        <NavLink to="/" className="brand-logo" onClick={closeMenu}>
          <Bot size={32} color="var(--color-primary)" />
          <span>Elevate AI</span>
        </NavLink>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive && location.pathname === '/' ? 'nav-link active' : 'nav-link')}
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink 
            to="/chat" 
            className={({ isActive }) => (isActive || location.pathname.startsWith('/chat') ? 'nav-link active' : 'nav-link')}
            onClick={closeMenu}
          >
            Chat
          </NavLink>
          <NavLink 
            to="/models" 
            className={({ isActive }) => (isActive || location.pathname.startsWith('/models') ? 'nav-link active' : 'nav-link')}
            onClick={closeMenu}
          >
            Models
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={closeMenu}
          >
            Settings
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
