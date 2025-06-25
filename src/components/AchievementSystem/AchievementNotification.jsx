import React, { useState, useEffect } from 'react';
import './AchievementNotification.css';

const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  console.log('🎨 AchievementNotification rendu avec:', { achievement: achievement?.id, onClose: !!onClose });

  useEffect(() => {
    if (achievement) {
      console.log('🎯 Notification montée:', achievement.id);
      // Petit délai pour l'animation d'entrée
      const timer = setTimeout(() => {
        console.log('👁️ Définition isVisible = true pour:', achievement.id);
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  useEffect(() => {
    if (isVisible) {
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(autoCloseTimer);
    }
  }, [isVisible]);

  const handleClose = () => {
    console.log('❌ Fermeture notification demandée');
    setIsLeaving(true);
    
    // Attendre la fin de l'animation avant de fermer
    setTimeout(() => {
      setIsVisible(false);
      setIsLeaving(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  if (!achievement) {
    console.log('⚠️ Pas d\'achievement à afficher');
    return null;
  }

  const rarityClass = `notification-${achievement.rarity || 'common'}`;
  const visibilityClass = isVisible ? 'visible' : 'hidden';
  const leavingClass = isLeaving ? 'leaving' : '';

  console.log('🎨 Rendu notification:', {
    id: achievement.id,
    isVisible,
    isLeaving,
    classes: `achievement-notification-overlay ${visibilityClass} ${leavingClass}`
  });

  return (
    <div 
      className={`achievement-notification-overlay ${visibilityClass} ${leavingClass}`}
    >
      <div className={`achievement-notification ${rarityClass}`}>
        {/* Header */}
        <div className="notification-header">
          <span className="notification-title">🏆 Trophé Débloqué!</span>
          <button 
            className="notification-close" 
            onClick={handleClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Contenu */}
        <div className="notification-content">
          <div className="notification-icon">
            {achievement.icon || '🏆'}
          </div>
          <div className="notification-info">
            <h3 className="notification-achievement-title">
              {achievement.title || achievement.name}
            </h3>
            <p className="notification-description">
              {achievement.description}
            </p>
            <span className={`notification-rarity ${achievement.rarity || 'common'}`}>
              {achievement.rarity || 'Common'}
            </span>
          </div>
        </div>

        {/* Effets visuels pour les achievements légendaires */}
        {achievement.rarity === 'legendary' && (
          <div className="notification-effects">
            <span className="sparkle sparkle-1">✨</span>
            <span className="sparkle sparkle-2">⭐</span>
            <span className="sparkle sparkle-3">💫</span>
            <span className="sparkle sparkle-4">🌟</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementNotification;