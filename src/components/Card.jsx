import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ creator }) => {
  const { id, name, url, description, image, imageURL } = creator;
  const profileImage = image || imageURL; // Handle both possible field names

  return (
    <article className="creator-card" data-theme="light">
      {/* Hero image section with overlay */}
      <div className="card-image-container">
        {profileImage ? (
          <div className="card-image">
            <img src={profileImage} alt={`${name}'s profile`} loading="lazy" />
            <div className="image-overlay">
              <div className="overlay-content">
                <Link to={`/${id}`} className="view-overlay-btn" role="button">
                  👁️ View Profile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-image-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">🎭</div>
              <span>Creator Avatar</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="card-content">
        {/* Creator name with enhanced typography */}
        <header className="card-header">
          <h3 className="creator-name">{name}</h3>
          <div className="creator-badge">✨ Creator</div>
        </header>
        
        {/* Enhanced description with truncation */}
        <p className="creator-description">
          {description.length > 120 ? `${description.substring(0, 120)}...` : description}
        </p>
        
        {/* Channel info with better visual design */}
        <div className="creator-url-card">
          <span className="url-icon">🌐</span>
          <div className="url-info">
            <small className="url-label">Channel</small>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="url-link"
              title={url}
            >
              {url.includes('youtube') ? '📺 YouTube' :
               url.includes('twitch') ? '🟣 Twitch' :
               url.includes('tiktok') ? '🎵 TikTok' :
               url.includes('instagram') ? '📷 Instagram' :
               '🔗 Visit Channel'}
            </a>
          </div>
        </div>
        
        {/* Enhanced action buttons */}
        <footer className="card-actions">
          <div className="primary-actions">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="visit-btn"
              role="button"
            >
              🚀 Visit
            </a>
            
            <Link to={`/${id}`} className="view-btn" role="button">
              👀 Details
            </Link>
          </div>
          
          <div className="secondary-actions">
            <Link to={`/edit/${id}`} className="edit-btn" role="button" data-tooltip="Edit Creator">
              ✏️
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default Card;
