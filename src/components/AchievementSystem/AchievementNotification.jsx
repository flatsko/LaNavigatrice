import React, { useState, useEffect } from 'react';
import './AchievementNotification.css';

const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // Auto-fermeture après 5 secondes
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsLeaving(false);
      onClose();
    }, 300);
  };

  const getRarityClass = (rarity) => {
    return `notification-${rarity}`;
  };

  const getRarityLabel = (rarity) => {
    const labels = {
      common: 'COMMUN',
      rare: 'RARE',
      epic: 'ÉPIQUE',
      legendary: 'LÉGENDAIRE'
    };
    return labels[rarity] || rarity.toUpperCase();
  };

  if (!achievement || !isVisible) return null;

  return (
    <div className={`achievement-notification-overlay ${isLeaving ? 'leaving' : ''}`}>
      <div className={`achievement-notification ${getRarityClass(achievement.rarity)} ${isLeaving ? 'slide-out' : 'slide-in'}`}>
        <div className="notification-header">
          <div className="notification-title">🏆 EXPLOIT DÉBLOQUÉ!</div>
          <button className="notification-close" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <div className="notification-content">
          <div className="notification-icon">
            {achievement.icon}
          </div>
          
          <div className="notification-info">
            <h3 className="notification-achievement-title">
              {achievement.title}
            </h3>
            <p className="notification-description">
              {achievement.description}
            </p>
            <span className={`notification-rarity ${achievement.rarity}`}>
              {getRarityLabel(achievement.rarity)}
            </span>
          </div>
        </div>
        
        <div className="notification-effects">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">⭐</div>
          <div className="sparkle sparkle-3">💫</div>
          <div className="sparkle sparkle-4">✨</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;