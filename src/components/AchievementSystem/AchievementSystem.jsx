import React, { useState, useEffect } from "react";
import "./AchievementSystem.css";
import { ACHIEVEMENTS } from '../../data/achievements';

const AchievementSystem = ({ player, onClose }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  const updateUnlockedAchievements = () => {
    const savedAchievements = JSON.parse(
      localStorage.getItem("playerAchievements") || "[]"
    );
    
    // Récupérer uniquement les achievements déjà débloqués depuis le localStorage
    const currentUnlocked = ACHIEVEMENTS.filter((achievement) =>
      savedAchievements.includes(achievement.id)
    );

    setUnlockedAchievements(currentUnlocked);
  };

  useEffect(() => {
    updateUnlockedAchievements();
  }, [player]);

  // Écouter les changements du localStorage pour mettre à jour l'affichage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'playerAchievements') {
        updateUnlockedAchievements();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Également écouter les changements internes (même onglet)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'playerAchievements') {
        updateUnlockedAchievements();
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);



  const getRarityClass = (rarity) => {
    return `achievement-${rarity}`;
  };

  const getProgressPercentage = () => {
    return Math.round(
      (unlockedAchievements.length / ACHIEVEMENTS.length) * 100
    );
  };

  return (
    <div className="achievement-overlay">
      <div className="achievement-modal">
        <div className="achievement-header">
          <h3>🏆 Exploits du Capitaine</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="achievement-content">
          <div className="achievement-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {unlockedAchievements.length}/{ACHIEVEMENTS.length} Exploits
              débloqués
            </span>
          </div>

          <div className="achievements-grid">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.some(
                (a) => a.id === achievement.id
              );
              const isNew = false; // Les nouveaux achievements sont gérés par useAchievementNotifications

              return (
                <div
                  key={achievement.id}
                  className={`achievement-card ${getRarityClass(
                    achievement.rarity
                  )} ${isUnlocked ? "unlocked" : "locked"}`}
                >
                  <div className="achievement-icon">
                    {isUnlocked ? achievement.icon : "🔒"}
                  </div>
                  <div className="achievement-info">
                    <h4 className="achievement-title">
                      {isUnlocked ? achievement.title : "???"}
                    </h4>
                    <p className="achievement-description">
                      {isUnlocked
                        ? achievement.description
                        : "Exploit mystérieux à découvrir..."}
                    </p>
                    <span
                      className={`achievement-rarity ${achievement.rarity}`}
                    >
                      {achievement.rarity.toUpperCase()}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;
