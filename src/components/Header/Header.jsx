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
        <div key={i} className="fragment missing" title="À découvrir">
          ○
        </div>
      );
    }
  });

  return (
    <header className="game-header">
      <div className="header-content">
        {/* Section principale */}
        <div className="player-info">
          <div className="compass-decoration">🧭</div>
          <div className="player-details">
            <h1 className="player-name">{player.name}</h1>
            <div className="player-stats">
              <span className="stat completed">{completed} ✓</span>
              <span className="stat failed">{failed} ✗</span>
              <span className="stat pending">
                {totalEnigmas - totalProcessed} ○
              </span>
              <span className="stat success-rate">{successRate}% 🎯</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="scan-btn" onClick={onScanQR}>
            📱 Scanner
          </button>
          <button className="achievements-btn" onClick={onShowAchievements}>
            🏆 Exploits
          </button>
        </div>

        {/* Barre de progression */}
        <div className="progress-bar">
          <div className="progress-label">
            Progression
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="fragments">{fragments}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
