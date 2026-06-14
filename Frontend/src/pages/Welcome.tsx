import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <div className="welcome-page">
      <div className="tech-hero-section">
        <div className="hero-background">
          <div className="hero-grid"></div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                '--delay': `${i * 0.1}s`,
                '--duration': `${3 + (i % 3)}s`
              } as React.CSSProperties}></div>
            ))}
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🚀</span>
            <span>NEXT-GEN TRAVEL PLATFORM</span>
            <div className="badge-glow"></div>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">
              <span className="glitch-text" data-text="YOUR DREAM">YOUR DREAM</span>
            </span>
            <span className="title-line">
              <span className="glitch-text" data-text="VACATIONS">VACATIONS</span>
            </span>
            <span className="title-line">
              <span className="glitch-text" data-text="AWAIT!">AWAIT!</span>
            </span>
          </h1>
          
          <p className="hero-subtitle">
            <span className="subtitle-highlight">✨ DISCOVER</span> incredible destinations, 
            <span className="subtitle-highlight"> 🚀 PLAN</span> epic adventures, and 
            <span className="subtitle-highlight"> 💫 CREATE</span> memories that last forever! 
            <br />
            Join thousands of travelers who've found their perfect getaway with us!
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">14+</div>
              <div className="stat-label">DESTINATIONS</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">TRAVELERS</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">SUPPORT</div>
            </div>
          </div>
          
          <div className="hero-buttons">
            <Link to="/login" className="tech-btn hero-btn primary">
              <span className="btn-icon">🚀</span>
              <span>START EXPLORING</span>
              <div className="btn-glow"></div>
              <div className="btn-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
              </div>
            </Link>
            <Link to="/register" className="tech-btn hero-btn secondary">
              <span className="btn-icon">💫</span>
              <span>JOIN ADVENTURE</span>
              <div className="btn-glow"></div>
              <div className="btn-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="hero-tech-overlay">
          <div className="scan-lines">
            <div className="scan-line"></div>
            <div className="scan-line"></div>
            <div className="scan-line"></div>
          </div>
          <div className="data-streams">
            <div className="data-stream"></div>
            <div className="data-stream"></div>
            <div className="data-stream"></div>
          </div>
        </div>
      </div>

      <div className="tech-features-section">
        <div className="features-header">
          <h2 className="features-title">
            <span className="glitch-text" data-text="🔥 WHY WE'RE ABSOLUTELY AMAZING! 🔥">🔥 WHY WE'RE ABSOLUTELY AMAZING! 🔥</span>
          </h2>
          <div className="features-subtitle">
            <span className="pulse-dot"></span>
            <span>ADVANCED FEATURES • NEXT-GEN TECHNOLOGY • UNMATCHED EXPERIENCE</span>
            <span className="pulse-dot"></span>
          </div>
        </div>
        
        <div className="tech-features-grid">
          {[
            {
              icon: '🌍',
              title: 'Epic Destinations',
              description: 'Explore 14+ mind-blowing vacation spots from around the globe!',
              color: '#3B82F6',
              glow: '#60A5FA',
              delay: '0s'
            },
            {
              icon: '💖',
              title: 'Save Your Faves',
              description: 'Heart your favorite destinations and build your dream travel list!',
              color: '#EC4899',
              glow: '#F472B6',
              delay: '0.2s'
            },
            {
              icon: '🎯',
              title: 'Smart Filters',
              description: 'Find exactly what you\'re looking for with our super cool filtering system!',
              color: '#10B981',
              glow: '#34D399',
              delay: '0.4s'
            },
            {
              icon: '👑',
              title: 'Admin Powers',
              description: 'Manage everything like a boss with our powerful admin dashboard!',
              color: '#F59E0B',
              glow: '#FBBF24',
              delay: '0.6s'
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="tech-feature-card"
              style={{
                '--feature-color': feature.color,
                '--feature-glow': feature.glow,
                '--delay': feature.delay
              } as React.CSSProperties}
            >
              <div className="feature-icon-container">
                <div className="feature-icon">{feature.icon}</div>
                <div className="icon-glow"></div>
                <div className="icon-particles">
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
              </div>
              
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              
              <div className="feature-tech-overlay">
                <div className="feature-scan-line"></div>
                <div className="feature-data-points">
                  <div className="data-point"></div>
                  <div className="data-point"></div>
                  <div className="data-point"></div>
                </div>
              </div>
              
              <div className="feature-status">
                <div className="status-indicator">
                  <div className="status-dot"></div>
                  <span>ACTIVE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="trending-destinations">
        <div className="trending-header">
          <h2 className="trending-title">
            <span className="glitch-text" data-text="🌍 TRENDING NOW 🌍">🌍 TRENDING NOW 🌍</span>
          </h2>
          <div className="tech-subtitle">
            <span className="pulse-dot"></span>
            <span>LIVE DATA • REAL-TIME TRENDS • GLOBAL INSIGHTS</span>
            <span className="pulse-dot"></span>
          </div>
        </div>
        
        <div className="countries-matrix">
          {[
            { 
              country: 'France', 
              flag: '🇫🇷', 
              city: 'Paris', 
              icon: '🗼',
              trend: '+127%',
              color: '#1E3A8A',
              glow: '#3B82F6'
            },
            { 
              country: 'Japan', 
              flag: '🇯🇵', 
              city: 'Tokyo', 
              icon: '🏯',
              trend: '+89%',
              color: '#7C2D12',
              glow: '#DC2626'
            },
            { 
              country: 'USA', 
              flag: '🇺🇸', 
              city: 'New York', 
              icon: '🗽',
              trend: '+156%',
              color: '#1F2937',
              glow: '#6B7280'
            },
            { 
              country: 'Italy', 
              flag: '🇮🇹', 
              city: 'Rome', 
              icon: '🏛️',
              trend: '+94%',
              color: '#7C2D12',
              glow: '#DC2626'
            },
            { 
              country: 'Spain', 
              flag: '🇪🇸', 
              city: 'Barcelona', 
              icon: '🏰',
              trend: '+78%',
              color: '#7C2D12',
              glow: '#DC2626'
            },
            { 
              country: 'Australia', 
              flag: '🇦🇺', 
              city: 'Sydney', 
              icon: '🏗️',
              trend: '+112%',
              color: '#1E3A8A',
              glow: '#3B82F6'
            },
            { 
              country: 'Thailand', 
              flag: '🇹🇭', 
              city: 'Bangkok', 
              icon: '🏮',
              trend: '+203%',
              color: '#7C2D12',
              glow: '#DC2626'
            },
            { 
              country: 'Brazil', 
              flag: '🇧🇷', 
              city: 'Rio', 
              icon: '🏖️',
              trend: '+145%',
              color: '#7C2D12',
              glow: '#DC2626'
            }
          ].map((dest, index) => (
            <div 
              key={index} 
              className="country-tile"
              style={{
                '--country-color': dest.color,
                '--country-glow': dest.glow,
                '--delay': `${index * 0.1}s`
              } as React.CSSProperties}
            >
              <div className="country-flag-container">
                <div className="country-flag">{dest.flag}</div>
                <div className="flag-glow"></div>
              </div>
              
              <div className="country-info">
                <div className="country-name">{dest.country}</div>
                <div className="city-name">{dest.city}</div>
                <div className="city-icon">{dest.icon}</div>
              </div>
              
              <div className="trend-indicator">
                <div className="trend-value">{dest.trend}</div>
                <div className="trend-label">TREND</div>
                <div className="trend-line"></div>
              </div>
              
              <div className="tech-overlay">
                <div className="scan-line"></div>
                <div className="data-points">
                  <div className="data-point"></div>
                  <div className="data-point"></div>
                  <div className="data-point"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="tech-footer">
          <div className="live-indicator">
            <div className="live-dot"></div>
            <span>LIVE TRENDING DATA</span>
          </div>
          <div className="update-time">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="tech-cta-section">
        <div className="cta-background">
          <div className="cta-grid"></div>
          <div className="cta-particles">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="particle" style={{
                '--delay': `${i * 0.2}s`,
                '--duration': `${4 + (i % 2)}s`
              } as React.CSSProperties}></div>
            ))}
          </div>
        </div>
        
        <div className="cta-content">
          <div className="cta-badge">
            <span className="badge-icon">🎉</span>
            <span>READY TO LAUNCH?</span>
            <div className="badge-glow"></div>
          </div>
          
          <h2 className="cta-title">
            <span className="title-line">
              <span className="glitch-text" data-text="READY TO START">READY TO START</span>
            </span>
            <span className="title-line">
              <span className="glitch-text" data-text="YOUR EPIC JOURNEY?">YOUR EPIC JOURNEY?</span>
            </span>
          </h2>
          
          <p className="cta-subtitle">
            Join thousands of awesome travelers who've already found their perfect adventure! 
            <br />
            <span className="subtitle-highlight">🌟 Your next great escape is just one click away! 🌟</span>
          </p>
          
          <div className="cta-stats">
            <div className="cta-stat">
              <div className="stat-icon">👥</div>
              <div className="stat-text">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Happy Travelers</div>
              </div>
            </div>
            <div className="cta-stat">
              <div className="stat-icon">⭐</div>
              <div className="stat-text">
                <div className="stat-number">4.9/5</div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
            <div className="cta-stat">
              <div className="stat-icon">🌍</div>
              <div className="stat-text">
                <div className="stat-number">14+</div>
                <div className="stat-label">Destinations</div>
              </div>
            </div>
          </div>
          
          <div className="cta-buttons">
            <Link to="/register" className="tech-btn cta-btn primary">
              <span className="btn-icon">🚀</span>
              <span>LET'S GO EXPLORE!</span>
              <div className="btn-glow"></div>
              <div className="btn-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
              </div>
            </Link>
            <Link to="/login" className="tech-btn cta-btn secondary">
              <span className="btn-icon">🔑</span>
              <span>ALREADY A MEMBER?</span>
              <div className="btn-glow"></div>
            </Link>
          </div>
        </div>
        
        <div className="cta-tech-overlay">
          <div className="cta-scan-lines">
            <div className="scan-line"></div>
            <div className="scan-line"></div>
            <div className="scan-line"></div>
            <div className="scan-line"></div>
          </div>
          <div className="cta-data-streams">
            <div className="data-stream"></div>
            <div className="data-stream"></div>
            <div className="data-stream"></div>
            <div className="data-stream"></div>
            <div className="data-stream"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
