import React, { useState, useEffect } from "react";
import MiniGameOverlay from "./MiniGameOverlay";
import "./MiniGames.css";
import "../../styles/enigmaCard.css";

const TentacleGameCard = ({ onComplete, onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (plus difficile)
  const [showHint, setShowHint] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const challenge = {
    question: "Combien de tentacules au total ?",
    visual: "🐙 🐙 🐙 🐙 + 🦑 🦑 🦑 + 🐙 🦑",
    math: "4 poulpes + 3 calmars + 1 poulpe + 1 calmar",
    explanation: "Poulpe = 8 tentacules, Calmar = 10 tentacules",
    answer: "58",
    reward: "+80 points + Tentacule magique 🐙",
  };

  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isComplete) {
      handleTimeUp();
    }
  }, [timeLeft, isComplete]);

  const handleTimeUp = () => {
    setFeedback({
      type: "timeout",
      message: "⏰ Temps écoulé ! La réponse était 44 tentacules.",
      points: 0,
    });
    setIsComplete(true);
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleSubmit = () => {
    if (!userInput.trim() || isComplete) return;

    const userAnswer = userInput.trim();
    const isCorrect = userAnswer === challenge.answer;

    if (isCorrect) {
      // Calcul du score avec bonus de temps
      const baseScore = 800; // Score plus élevé pour la difficulté accrue
      const timeBonus = Math.floor(timeLeft * 2);
      const totalScore = baseScore + timeBonus;
      setScore(totalScore);

      setFeedback({
        type: "success",
        message: `🎉 Excellent ! Vous avez trouvé la bonne réponse : ${challenge.answer} tentacules !`,
        points: totalScore,
      });
    } else {
      setFeedback({
        type: "error",
        message: `❌ Incorrect ! La bonne réponse était ${challenge.answer} tentacules.`,
        points: 0,
      });
    }

    setIsComplete(true);
    setTimeout(() => {
      onComplete(isCorrect ? score : 0);
    }, 4000);
  };

  const handleSkip = () => {
    setFeedback({
      type: "skipped",
      message:
        "⏭️ Mini-jeu passé. Vous avez manqué l'occasion de gagner des points bonus !",
      points: 0,
    });
    setIsComplete(true);
    setTimeout(() => {
      onComplete(0);
    }, 4000);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <MiniGameOverlay onClose={handleClose} isClosing={isClosing}>
      <div
        className={`enigma-card tentacle-game-card ${
          isClosing ? "closing" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
          <div className="enigma-header">
            <button className="close-btn" onClick={handleClose}>
              ✕
            </button>
            <div className="enigma-title">
              <h2>🐙 Mini-Jeu : Calcul de Tentacules (Difficile)</h2>
              <p className="enigma-subtitle">
                🧮 <strong>Défi mathématique avancé :</strong> Comptez les
                tentacules et gagnez jusqu'à <strong>2000+ points bonus</strong>{" "}
                ! 🏆
              </p>
            </div>
          </div>

          <div className="tentacle-game-content">
            <div className="tentacle-timer">
              <div className="timer-display">
                ⏱️ Temps restant : <strong>{formatTime(timeLeft)}</strong>
              </div>
              <div className="timer-bar">
                <div
                  className="timer-fill"
                  style={{ width: `${(timeLeft / 120) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="tentacle-challenge">
              <h3>{challenge.question}</h3>
              <div className="visual-display">
                <div className="sea-creatures">{challenge.visual}</div>
              </div>
              <div className="math-explanation">
                <p>
                  <strong>Calcul :</strong> {challenge.math}
                </p>
                <p>
                  <em>{challenge.explanation}</em>
                </p>
              </div>
            </div>

            {!isComplete && (
              <div className="tentacle-input">
                <label htmlFor="tentacle-answer">Votre réponse :</label>
                <input
                  id="tentacle-answer"
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Nombre de tentacules..."
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
              </div>
            )}

            {feedback && (
              <div className={`feedback ${feedback.type}`}>
                <p>{feedback.message}</p>
                {feedback.points > 0 && (
                  <p className="points-earned">
                    +{feedback.points} points gagnés !
                  </p>
                )}
              </div>
            )}

            {!isComplete && (
              <div className="tentacle-help">
                <button
                  className="hint-btn"
                  onClick={() => setShowHint(!showHint)}
                >
                  💡 {showHint ? "Masquer" : "Afficher"} l'aide
                </button>

                {showHint && (
                  <div className="hint-content">
                    <h4>🔍 Indices :</h4>
                    <ul>
                      <li>
                        🐙 Un poulpe a <strong>8 tentacules</strong>
                      </li>
                      <li>
                        🦑 Un calmar a <strong>10 tentacules</strong>
                      </li>
                      <li>📊 Comptez le nombre de chaque créature</li>
                      <li>🧮 Multipliez et additionnez !</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isComplete && (
            <div className="enigma-actions">
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!userInput.trim() || isComplete}
              >
                🔍 Valider
              </button>

              <div className="skip-section">
                <button
                  className="skip-btn warning"
                  onClick={handleSkip}
                  disabled={isComplete}
                >
                  ⏭️ Passer le mini-jeu
                </button>
                <p className="skip-warning">
                  ⚠️ Attention : Passer ce mini-jeu vous fera perdre jusqu'à{" "}
                  <strong>2000+ points bonus</strong> !
                </p>
              </div>
            </div>
          )}
        </div>
    </MiniGameOverlay>
  );
};

export default TentacleGameCard;
