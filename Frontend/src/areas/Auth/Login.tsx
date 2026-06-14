import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api, authAPI } from '../../services/api';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      navigate('/vacations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tech-form-container">
      <div className="form-background">
        <div className="form-grid"></div>
        <div className="form-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.2}s`,
              '--duration': `${3 + (i % 3)}s`
            } as React.CSSProperties}></div>
          ))}
        </div>
      </div>
      
      <div className="form-content">
        <div className="form-header">
          <div className="form-icon">
            <span className="icon">🔐</span>
            <div className="icon-glow"></div>
          </div>
          <h2 className="form-title">
            <span className="glitch-text" data-text="LOGIN">LOGIN</span>
          </h2>
          <p className="form-subtitle">Access your account securely</p>
        </div>
        
        {error && (
          <div className="tech-alert error">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <div className="alert-title">ERROR</div>
              <div className="alert-message">{error}</div>
            </div>
            <div className="alert-glow"></div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="tech-form">
          <div className="tech-form-group">
            <div className="input-container">
              <div className="input-icon">📧</div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="tech-input"
                placeholder=" "
              />
              <label htmlFor="email" className="tech-label">EMAIL ADDRESS</label>
              <div className="input-glow"></div>
            </div>
          </div>
          
          <div className="tech-form-group">
            <div className="input-container">
              <div className="input-icon">🔑</div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="tech-input"
                placeholder=" "
              />
              <label htmlFor="password" className="tech-label">PASSWORD</label>
              <div className="input-glow"></div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="tech-btn form-btn primary" 
            disabled={loading}
          >
            <span className="btn-icon">{loading ? '⏳' : '🚀'}</span>
            <span>{loading ? 'AUTHENTICATING...' : 'LOGIN'}</span>
            <div className="btn-glow"></div>
            <div className="btn-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </button>
        </form>
        
        <div className="form-footer">
          <div className="footer-text">
            <span>Don't have an account?</span>
            <Link to="/register" className="footer-link">
              <span className="link-icon">💫</span>
              <span>REGISTER HERE</span>
              <div className="link-glow"></div>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="form-tech-overlay">
        <div className="form-scan-lines">
          <div className="scan-line"></div>
          <div className="scan-line"></div>
          <div className="scan-line"></div>
        </div>
        <div className="form-data-streams">
          <div className="data-stream"></div>
          <div className="data-stream"></div>
          <div className="data-stream"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
