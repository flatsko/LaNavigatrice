import React, { useState, useEffect } from "react";
import { getAllPlayersData } from "../../utils/storage";

const Leaderboard = ({ onClose }) => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const players = getAllPlayersData();
    const sorted = players
      .sort((a, b) => {
        if (b.completed.length !== a.completed.length) {
          return b.completed.length - a.completed.length;
        }
        return new Date(a.lastUpdate) - new Date(b.lastUpdate);
      })
      .slice(0, 10); // Top 10

    setRankings(sorted);
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "⚓";
    }
  };

  const getRankTitle = (rank) => {
    switch (rank) {
      case 1:
        return "Capitaine Suprême";
      case 2:
        return "Premier Officier";
      case 3:
        return "Navigateur Expert";
      default:
        return "Matelot Aventurier";
    }
  };

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h3>🏆 Classement des Explorateurs</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="leaderboard-content">
          {rankings.length === 0 ? (
            <div className="no-players">
              <div className="compass-empty">🧭</div>
              <p>Aucun explorateur pour le moment...</p>
            </div>
          ) : (
            <div className="rankings">
              {rankings.map((player, index) => (
                <div
                  key={player.name}
                  className={`rank-item rank-${index + 1}`}
                >
                  <div className="rank-position">
                    <span className="rank-icon">{getRankIcon(index + 1)}</span>
                    <span className="rank-number">#{index + 1}</span>
                  </div>

                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    <div className="player-title">
                      {getRankTitle(index + 1)}
                    </div>
                  </div>

                  <div className="player-progress">
                    <div className="fragments-count">
                      {Array.from({ length: 7 }, (_, i) => (
                        <span
                          key={i}
                          className={
                            i < player.completed.length ? "filled" : "empty"
                          }
                        >
                          {i < player.completed.length ? "⭐" : "⚪"}
                        </span>
                      ))}
                    </div>
                    <div className="progress-text">
                      {player.completed.length}/7 fragments
                    </div>
                  </div>

                  {player.completed.length === 7 && (
                    <div className="completion-badge">🎉 Trésor trouvé !</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="leaderboard-footer">
            <p className="update-info">Classement mis à jour en temps réel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
