import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Mail, MessageCircle, Globe } from 'lucide-react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Bot size={28} className="footer-logo-icon" />
              <span className="footer-logo-text">Elevate AI</span>
            </Link>
            <p className="footer-tagline">
              Next-generation conversational AI for enterprise and personal productivity.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter"><MessageCircle size={20} /></a>
              <a href="#" aria-label="GitHub"><Globe size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Mail size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><Link to="/chat">Features</Link></li>
              <li><Link to="/models">Models</Link></li>
              <li><Link to="#">Pricing</Link></li>
              <li><Link to="#">Changelog</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="#">Blog</Link></li>
              <li><Link to="#">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Elevate AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
