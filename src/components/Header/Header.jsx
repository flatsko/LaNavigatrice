import React from "react";
import "../../styles/header.css";

const Header = ({
  player,
  onScanQR,
  onShowLeaderboard,
  onShowAchievements,
  onShowSharedGallery,
  totalEnigmas,
}) => {
  if (!player) return null;

  const completed = player.completed?.length || 0;
  const failed = player.failed?.length || 0;
  const totalProcessed = completed + failed;
  const progressPercentage = Math.round((totalProcessed / totalEnigmas) * 100);
  const successRate =
    player.totalAttempts > 0
      ? Math.round(
          ((player.totalAttempts - player.wrongAnswers) /
            player.totalAttempts) *
            100
        )
      : 100;

  // Créer les fragments visuels
  const fragments = Array.from({ length: totalEnigmas }, (_, i) => {
    if (i < completed) {
      return (
        <div key={i} className="fragment completed" title="Destination visitée">
          ✓
        </div>
      );
    } else if (i < totalProcessed) {
      return (
        <div key={i} className="fragment failed" title="Destination manquée">
          ✗
        </div>
      );
    } else {
      return (
        <div key={i} className="fragment pending" title="À découvrir">
          ○
        </div>
      );
    }
  });

  return (
    <header className="header">
      <div className="header-container">
        {/* Section principale */}
        <div className="header-main">
          <div className="player-section">
            <div className="player-avatar">🧭</div>
            <div className="player-info">
              <h1 className="player-name">{player.name}</h1>
              <div className="player-stats">
                <span className="stat completed">{completed} ✓</span>
                <span className="stat failed">{failed} ✗</span>
                <span className="stat pending">{totalEnigmas - totalProcessed} ○</span>
                <span className="stat success-rate">{successRate}% 🎯</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="btn btn-primary" onClick={onScanQR}>
              <span className="btn-icon">📱</span>
              <span className="btn-text">Scanner</span>
            </button>
            <button className="btn btn-secondary" onClick={onShowAchievements}>
              <span className="btn-icon">🏆</span>
              <span className="btn-text">Exploits</span>
            </button>
            <button className="btn btn-secondary" onClick={onShowSharedGallery}>
              <span className="btn-icon">📸</span>
              <span className="btn-text">Galerie</span>
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-label">Progression</span>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="fragments-container">
            {fragments}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
