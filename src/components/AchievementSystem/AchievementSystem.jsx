import React, { useState, useEffect } from 'react';
import "./AchievementSystem.css";
import AchievementNotification from './AchievementNotification';
import { ACHIEVEMENTS } from '../../data/achievements';

const AchievementSystem = ({ player, onClose }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationQueue, setNotificationQueue] = useState([]);

  useEffect(() => {
    const savedAchievements = JSON.parse(
      localStorage.getItem("playerAchievements") || "[]"
    );
    const currentUnlocked = ACHIEVEMENTS.filter((achievement) =>
      achievement.condition(player)
    );

    const newlyUnlocked = currentUnlocked.filter(
      (achievement) => !savedAchievements.includes(achievement.id)
    );

    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
      const updatedAchievements = [
        ...savedAchievements,
        ...newlyUnlocked.map((a) => a.id),
      ];
      localStorage.setItem(
        "playerAchievements",
        JSON.stringify(updatedAchievements)
      );
      
      // Ajouter les nouveaux achievements à la queue de notifications
      setNotificationQueue(prev => [...prev, ...newlyUnlocked]);
    }

    setUnlockedAchievements(currentUnlocked);
  }, [player]);

  // Gérer la queue des notifications
  useEffect(() => {
    if (notificationQueue.length > 0 && !currentNotification) {
      const nextNotification = notificationQueue[0];
      setCurrentNotification(nextNotification);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [notificationQueue, currentNotification]);

  const handleNotificationClose = () => {
    setCurrentNotification(null);
  };

  const getRarityClass = (rarity) => {
    return `achievement-${rarity}`;
  };

  const getProgressPercentage = () => {
    return Math.round(
      (unlockedAchievements.length / ACHIEVEMENTS.length) * 100
    );
  };

  return (
    <>
      {/* Notification popup pour les nouveaux achievements */}
      <AchievementNotification 
        achievement={currentNotification}
        onClose={handleNotificationClose}
      />
      
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
              const isNew = newAchievements.some(
                (a) => a.id === achievement.id
              );

              return (
                <div
                  key={achievement.id}
                  className={`achievement-card ${getRarityClass(
                    achievement.rarity
                  )} ${isUnlocked ? "unlocked" : "locked"} ${
                    isNew ? "new-achievement" : ""
                  }`}
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
                  {isNew && <div className="new-badge">NOUVEAU!</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AchievementSystem;
