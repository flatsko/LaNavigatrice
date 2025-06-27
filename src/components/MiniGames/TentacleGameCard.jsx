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
    question:
      "Alison a trouvé lors d'une de ses éxpédition le coffre légendaire du Capitaine Kraken, mais il est protégé par une serrure à code. Sur le couvercle, une inscription mystérieuse..",
    visual:
      "🐙 + 🐙 + 🦑 = 26\n 🐙 + 🦑 + 🦑 = 28\n 🐠 + 🐠 + 🐠 = 18\n 🦑 + 🐙 + 🐠 = ?  ",
    math: "",
    explanation: "",
    answer: "24",
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
      message: "⏰ Temps écoulé ! La réponse était 58 tentacules.",
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

    // Calcul du bonus de temps et score de base (définis ici pour être accessibles partout)
    const baseScore = 200; // Score aligné avec le nouveau système
    const timeBonus = isCorrect ? Math.floor(timeLeft * 1) : 0;

    if (isCorrect) {
      // Calcul du score avec bonus de temps
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
      onComplete({
        gameType: "tentacle",
        success: isCorrect,
        score: isCorrect ? baseScore + timeBonus : 0,
        timeBonus: timeBonus,
        skipped: false,
        message: isCorrect ? "Tentacule identifiée !" : "Mauvaise réponse",
      });
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
      onComplete({
        gameType: "tentacle",
        success: false,
        score: 0,
        timeBonus: 0,
        skipped: true,
        message: "Mini-jeu passé",
      });
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
            <h2>🐙 Mini-Jeu </h2>
            <p className="enigma-subtitle">
              <strong>Défi :</strong> gagnez jusqu'à{" "}
              <strong>320+ points bonus</strong> ! 🏆
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
              <div className="sea-creatures">
                {challenge.visual.split("\n").map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
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

          {/* {!isComplete && (
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
          )} */}
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
                <strong>320+ points bonus</strong> !
              </p>
            </div>
          </div>
        )}
      </div>
    </MiniGameOverlay>
  );
};

export default TentacleGameCard;
