import React from 'react';
import { Link } from 'react-router-dom';
import { Vacation } from '../../types';

interface VacationCardProps {
  vacation: Vacation;
  onLikeToggle: (vacationId: number, isLiked: boolean) => void;
  showLikeButton?: boolean;
  showAdminActions?: boolean;
  onEdit?: (vacation: Vacation) => void;
  onDelete?: (vacationId: number) => void;
}

const VacationCard: React.FC<VacationCardProps> = ({
  vacation,
  onLikeToggle,
  showLikeButton = false,
  showAdminActions = false,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleLikeClick = () => {
    onLikeToggle(vacation.vacation_id, vacation.is_liked);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this vacation?')) {
      onDelete?.(vacation.vacation_id);
    }
  };

  return (
    <div className="tech-vacation-card">
      <div className="card-background">
        <div className="card-grid"></div>
        <div className="card-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.3}s`,
              '--duration': `${4 + (i % 2)}s`
            } as React.CSSProperties}></div>
          ))}
        </div>
      </div>
      
      <div className="card-image-container">
        {vacation.image_filename ? (
          <img
            src={`http://localhost:3001/uploads/${vacation.image_filename}`}
            alt={vacation.destination}
            className="card-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="card-placeholder">
            <div className="placeholder-icon">✈️</div>
            <div className="placeholder-glow"></div>
          </div>
        )}
        <div className="image-overlay">
          <div className="image-scan-line"></div>
          <div className="image-data-points">
            <div className="data-point"></div>
            <div className="data-point"></div>
            <div className="data-point"></div>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">
            <span className="title-text">{vacation.destination}</span>
            <div className="title-glow"></div>
          </h3>
          <div className="card-status">
            <div className="status-dot"></div>
            <span>ACTIVE</span>
          </div>
        </div>
        
        <p className="card-description">{vacation.description}</p>
        
        <div className="card-details">
          <div className="detail-item">
            <div className="detail-icon">📅</div>
            <div className="detail-content">
              <div className="detail-label">START DATE</div>
              <div className="detail-value">{formatDate(vacation.start_date)}</div>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">🏁</div>
            <div className="detail-content">
              <div className="detail-label">END DATE</div>
              <div className="detail-value">{formatDate(vacation.end_date)}</div>
            </div>
          </div>
        </div>
        
        <div className="card-price-section">
          <div className="price-container">
            <div className="price-label">PRICE</div>
            <div className="price-value">{formatPrice(vacation.price)}</div>
            <div className="price-glow"></div>
          </div>
        </div>
        
        <div className="card-actions">
          {showLikeButton && (
            <div className="like-section">
              <button
                className={`tech-like-button ${vacation.is_liked ? 'liked' : ''}`}
                onClick={handleLikeClick}
                title={vacation.is_liked ? 'Unlike' : 'Like'}
              >
                <span className="like-icon">{vacation.is_liked ? '❤️' : '🤍'}</span>
                <div className="like-glow"></div>
                <div className="like-particles">
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
              </button>
              <div className="likes-info">
                <div className="likes-count">{vacation.likes_count}</div>
                <div className="likes-label">LIKES</div>
              </div>
            </div>
          )}
          
          {!showLikeButton && (
            <div className="likes-display">
              <div className="likes-icon">💖</div>
              <div className="likes-info">
                <div className="likes-count">{vacation.likes_count}</div>
                <div className="likes-label">LIKES</div>
              </div>
            </div>
          )}
        </div>
        
        {showAdminActions && (
          <div className="admin-actions">
            <button
              className="tech-btn admin-btn edit"
              onClick={() => onEdit?.(vacation)}
            >
              <span className="btn-icon">✏️</span>
              <span>EDIT</span>
              <div className="btn-glow"></div>
            </button>
            <button
              className="tech-btn admin-btn delete"
              onClick={handleDelete}
            >
              <span className="btn-icon">🗑️</span>
              <span>DELETE</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        )}
      </div>
      
      <div className="card-tech-overlay">
        <div className="card-scan-lines">
          <div className="scan-line"></div>
          <div className="scan-line"></div>
        </div>
        <div className="card-data-streams">
          <div className="data-stream"></div>
          <div className="data-stream"></div>
        </div>
      </div>
    </div>
  );
};

export default VacationCard;
