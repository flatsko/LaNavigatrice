import React from "react";
import "../../styles/header.css";

const Header = ({
  player,
  onScanQR,
  onShowLeaderboard,
  onShowAchievements,
  onShowSharedGallery,
  onShowPrintablePresentation,
  onShowMandatoryQuiz,
  showQuizButton = false,
  totalEnigmas,
  onResetStorage,
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

  return (
    <header className="game-header">
      <div className="header-content">
        {/* Section principale */}
        <div className="player-info">
          <div className="compass-decoration">🧭</div>
          <div className="player-details">
            <h1 className="player-name">{player.name}</h1>
            {/* <div className="simple-stats">
              <div className="stat-group success">
                <span className="stat-number">{completed}</span>
                <span className="stat-label">Réussies</span>
              </div>
              <div className="stat-group failed">
                <span className="stat-number">{failed}</span>
                <span className="stat-label">Échouées</span>
              </div>
              <div className="stat-group remaining">
                <span className="stat-number">
                  {totalEnigmas - totalProcessed}
                </span>
                <span className="stat-label">Restantes</span>
              </div>
            </div> */}
          </div>
        </div>

        <div className="header-actions">
          <button className="scan-btn" onClick={onScanQR}>
            📱 Scanner
          </button>
          <button className="achievements-btn" onClick={onShowAchievements}>
            🏆 Exploits
          </button>
          {showQuizButton && (
            <button
              className="quiz-btn mandatory"
              onClick={onShowMandatoryQuiz}
            >
              🏴‍☠️ Quiz Final
            </button>
          )}
          {/* <button className="reset-btn" onClick={onResetStorage}>
            🗑️ Reset
          </button> */}
        </div>

        {/* Barre de progression simplifiée */}
        <div className="simple-progress">
          <div className="progress-info">
            <span className="progress-text">Progression du voyage</span>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
