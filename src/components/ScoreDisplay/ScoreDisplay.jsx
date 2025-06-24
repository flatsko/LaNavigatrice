import React from "react";
import {
  calculateTotalScore,
  getScoreRank,
  formatScore,
} from "../../utils/pointsSystem";
import { ACHIEVEMENTS } from "../../data/achievements";
import "./ScoreDisplay.css";

const ScoreDisplay = ({ player, minigameResults = [], isVictory = true }) => {
  const scoreData = calculateTotalScore(player, minigameResults);
  const rank = getScoreRank(scoreData.total);

  const { breakdown } = scoreData;

  return (
    <div className="score-display">
      <div className="score-header">
        <div className="rank-badge" style={{ backgroundColor: rank.color }}>
          <span className="rank-icon">{rank.icon}</span>
          <span className="rank-name">{rank.name}</span>
        </div>
        <div className="total-score">
          <span className="score-label">Score Total</span>
          <span className="score-value">{formatScore(scoreData.total)}</span>
        </div>
      </div>

      <div className="score-breakdown">
        <h3>📊 Détail des Points</h3>

        {/* Points des énigmes */}
        <div className="score-category">
          <div className="category-header">
            <span className="category-icon">🧩</span>
            <span className="category-title">Énigmes Résolues</span>
            <span className="category-points">
              {formatScore(breakdown.enigmas.total)}
            </span>
          </div>
          {breakdown.enigmas.details.length > 0 && (
            <div className="category-details">
              {breakdown.enigmas.details.map((detail, index) => (
                <div key={index} className="detail-item">
                  <span className="detail-text">
                    Énigme {detail.enigmaId} ({detail.attempts} tentative
                    {detail.attempts > 1 ? "s" : ""})
                    {detail.perfect && (
                      <span className="perfect-badge">⭐ Parfait</span>
                    )}
                  </span>
                  <span className="detail-points">+{detail.points}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Points des mini-jeux */}
        {breakdown.minigames.total > 0 && (
          <div className="score-category">
            <div className="category-header">
              <span className="category-icon">🎮</span>
              <span className="category-title">Mini-Jeux</span>
              <span className="category-points">
                {formatScore(breakdown.minigames.total)}
              </span>
            </div>
            <div className="category-details">
              {breakdown.minigames.details.map((detail, index) => {
                // Fonction pour obtenir le nom et l'icône du mini-jeu
                const getMinigameDisplay = (type) => {
                  switch (type) {
                    case "morse":
                      return "📡 Morse";
                    case "tentacle":
                      return "🐙 Tentacule";
                    case "sharing":
                      return "🤝 Partage";
                    default:
                      return `🎮 ${type}`;
                  }
                };
                
                return (
                  <div key={index} className="detail-item">
                    <span className="detail-text">
                      {getMinigameDisplay(detail.type)}
                      {detail.skipped
                        ? " (Ignoré)"
                        : detail.success
                        ? " (Réussi)"
                        : " (Échoué)"}
                    </span>
                    <span className="detail-points">+{detail.points}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Points des trophées */}
        {breakdown.trophies.total > 0 && (
          <div className="score-category">
            <div className="category-header">
              <span className="category-icon">🏆</span>
              <span className="category-title">Trophées Débloqués</span>
              <span className="category-points">
                {formatScore(breakdown.trophies.total)}
              </span>
            </div>
            <div className="category-details">
              {breakdown.trophies.details.map((detail, index) => {
                const achievement = ACHIEVEMENTS.find(a => a.id === detail.id);
                return (
                  <div key={index} className="detail-item">
                    <span className="detail-text">
                      {achievement?.icon || "🏆"} {achievement?.title || detail.id}
                      <span className={`rarity-badge rarity-${detail.rarity}`}>
                        {detail.rarity.charAt(0).toUpperCase() +
                          detail.rarity.slice(1)}
                      </span>
                    </span>
                    <span className="detail-points">+{detail.points}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bonus de temps */}
        {breakdown.timeBonus.total > 0 && (
          <div className="score-category">
            <div className="category-header">
              <span className="category-icon">⏱️</span>
              <span className="category-title">Bonus de Rapidité</span>
              <span className="category-points">
                {formatScore(breakdown.timeBonus.total)}
              </span>
            </div>
            <div className="category-details">
              <div className="detail-item">
                <span className="detail-text">
                  Terminé en {breakdown.timeBonus.details.totalMinutes} min
                  (objectif: {breakdown.timeBonus.details.targetMinutes} min)
                </span>
                <span className="detail-points">
                  +{breakdown.timeBonus.total}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Message d'encouragement */}
        <div className="score-message">
          {isVictory ? (
            scoreData.total >= 2000 ? (
              <p>
                🎉 Performance exceptionnelle ! Vous êtes un véritable maître de
                la navigation !
              </p>
            ) : scoreData.total >= 1000 ? (
              <p>
                👏 Excellent travail ! Vous avez fait preuve d'un grand talent
                de navigateur !
              </p>
            ) : (
              <p>🌟 Bravo ! Vous avez mené cette aventure avec succès !</p>
            )
          ) : (
            <p>
              💪 Ne vous découragez pas ! Chaque aventure est une occasion
              d'apprendre et de progresser !
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
