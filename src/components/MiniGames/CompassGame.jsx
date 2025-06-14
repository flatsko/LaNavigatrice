import React, { useState, useEffect } from "react";
import "./MiniGames.css";

const CompassGame = ({ onComplete, onClose }) => {
  const [targetDirection, setTargetDirection] = useState(0);
  const [currentDirection, setCurrentDirection] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    // Générer une direction cible aléatoire
    setTargetDirection(Math.floor(Math.random() * 360));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameEnd();
    }
  }, [timeLeft, isComplete]);

  const handleDirectionChange = (newDirection) => {
    setCurrentDirection(newDirection);

    // Calculer la différence
    const difference = Math.abs(targetDirection - newDirection);
    const adjustedDiff = Math.min(difference, 360 - difference);

    // Si très proche (±10 degrés), c'est gagné !
    if (adjustedDiff <= 10) {
      setIsComplete(true);
      const bonus = Math.max(0, 30 - timeLeft) * 10; // Bonus de vitesse
      setScore(1000 - adjustedDiff * 10 + bonus);
      setTimeout(() => {
        onComplete({
          success: true,
          score: score,
          timeBonus: bonus,
        });
      }, 1500);
    }
  };

  const handleGameEnd = () => {
    onComplete({
      success: false,
      score: 0,
      timeBonus: 0,
    });
  };

  const getDirectionName = (degrees) => {
    const directions = [
      "Nord",
      "Nord-Est",
      "Est",
      "Sud-Est",
      "Sud",
      "Sud-Ouest",
      "Ouest",
      "Nord-Ouest",
    ];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getDifferenceColor = () => {
    const difference = Math.abs(targetDirection - currentDirection);
    const adjustedDiff = Math.min(difference, 360 - difference);

    if (adjustedDiff <= 10) return "#4CAF50"; // Vert
    if (adjustedDiff <= 30) return "#FF9800"; // Orange
    return "#F44336"; // Rouge
  };

  return (
    <div className="mini-game-overlay">
      <div className="mini-game-modal compass-game">
        <div className="mini-game-header">
          <h3>🧭 Défi du Navigateur</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mini-game-content">
          <div className="game-info">
            <div className="target-info">
              <h4>Direction cible :</h4>
              <div className="target-direction">
                {targetDirection}° ({getDirectionName(targetDirection)})
              </div>
            </div>

            <div className="game-stats">
              <div className="time-left">⏱️ {timeLeft}s</div>
              <div className="current-score">🏆 {score} pts</div>
            </div>
          </div>

          <div className="compass-container">
            <div className="compass-face">
              {/* Boussole visuelle */}
              <div className="compass-ring">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <div
                    key={angle}
                    className="compass-mark"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-120px)`,
                    }}
                  >
                    <span style={{ transform: `rotate(${-angle}deg)` }}>
                      {getDirectionName(angle).charAt(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Aiguille cible */}
              <div
                className="compass-needle target-needle"
                style={{
                  transform: `rotate(${targetDirection}deg)`,
                  opacity: 0.7,
                }}
              />

              {/* Aiguille du joueur */}
              <div
                className="compass-needle player-needle"
                style={{
                  transform: `rotate(${currentDirection}deg)`,
                  backgroundColor: getDifferenceColor(),
                }}
              />

              <div className="compass-center" />
            </div>
          </div>

          <div className="compass-controls">
            <div className="direction-slider">
              <input
                type="range"
                min="0"
                max="360"
                value={currentDirection}
                onChange={(e) =>
                  handleDirectionChange(parseInt(e.target.value))
                }
                className="compass-slider"
                disabled={isComplete}
              />
              <div className="slider-labels">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
                <span>360°</span>
              </div>
            </div>

            <div className="current-direction">
              Direction actuelle : <strong>{currentDirection}°</strong>
              <br />
              <span style={{ color: getDifferenceColor() }}>
                {getDirectionName(currentDirection)}
              </span>
            </div>
          </div>

          {isComplete && (
            <div className="success-message">
              <div className="success-icon">🎯</div>
              <h4>Navigation parfaite !</h4>
              <p>Vous avez trouvé la bonne direction !</p>
              <div className="final-score">Score : {score} points</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompassGame;
