import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './MiniGameAlert.css';

const MiniGameAlert = ({ onComplete, gameType }) => {
  const [countdown, setCountdown] = useState(3);
  const [isVisible, setIsVisible] = useState(true);

  const gameMessages = {
    morse: {
      title: "🔤 Mini-Jeu Morse",
      description: "Préparez-vous à décoder un message en morse !"
    },
    tentacle: {
      title: "🐙 Mini-Jeu Tentacule",
      description: "Un défi mathématique vous attend !"
    },
    sharing: {
      title: "🤝 Mini-Jeu Partage",
      description: "Montrez votre esprit de partage !"
    }
  };

  const currentGame = gameMessages[gameType] || {
    title: "🎮 Mini-Jeu",
    description: "Un défi vous attend !"
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false);
          setTimeout(() => onComplete(), 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  const alertContent = (
    <div className={`minigame-alert-overlay ${!isVisible ? 'fade-out' : ''}`}>
      <div className="minigame-alert-card">
        <div className="minigame-alert-icon">
          ⚡
        </div>
        
        <h2 className="minigame-alert-title">
          {currentGame.title}
        </h2>
        
        <p className="minigame-alert-description">
          {currentGame.description}
        </p>
        
        <div className="minigame-alert-countdown">
          <div className="countdown-circle">
            <span className="countdown-number">{countdown}</span>
          </div>
        </div>
        
        <p className="minigame-alert-subtitle">
          Le mini-jeu commence dans...
        </p>
      </div>
    </div>
  );

  return createPortal(alertContent, document.body);
};

export default MiniGameAlert;