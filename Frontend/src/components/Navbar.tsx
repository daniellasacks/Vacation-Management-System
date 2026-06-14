import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="tech-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <span className="brand-icon">✈️</span>
            <span className="brand-text">
              <span className="glitch-text" data-text="VACATION HUB">VACATION HUB</span>
            </span>
          </div>
        </Link>
        
        <div className="navbar-nav">
          {!isAuthenticated ? (
            <div className="nav-links">
              <Link to="/login" className="nav-link tech-btn">
                <span className="btn-icon">🚀</span>
                <span>LOGIN</span>
                <div className="btn-glow"></div>
              </Link>
              <Link to="/register" className="nav-link tech-btn primary">
                <span className="btn-icon">💫</span>
                <span>JOIN</span>
                <div className="btn-glow"></div>
              </Link>
            </div>
          ) : (
            <div className="nav-links">
              <Link to="/vacations" className="nav-link tech-btn">
                <span className="btn-icon">🌍</span>
                <span>EXPLORE</span>
                <div className="btn-glow"></div>
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin/vacations" className="nav-link tech-btn admin">
                    <span className="btn-icon">👑</span>
                    <span>MANAGE</span>
                    <div className="btn-glow"></div>
                  </Link>
                  <Link to="/admin/report" className="nav-link tech-btn admin">
                    <span className="btn-icon">📊</span>
                    <span>REPORTS</span>
                    <div className="btn-glow"></div>
                  </Link>
                </>
              )}
              <div className="navbar-user">
                <div className="user-info">
                  <div className="user-avatar">
                    <span className="avatar-icon">👤</span>
                    <div className="avatar-glow"></div>
                  </div>
                  <div className="user-details">
                    <span className="user-name">Hey {user?.first_name}!</span>
                    <span className="user-status">ONLINE</span>
                  </div>
                </div>
                <button onClick={logout} className="nav-link tech-btn logout">
                  <span className="btn-icon">👋</span>
                  <span>LOGOUT</span>
                  <div className="btn-glow"></div>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="navbar-tech-overlay">
          <div className="scan-line"></div>
          <div className="data-points">
            <div className="data-point"></div>
            <div className="data-point"></div>
            <div className="data-point"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
