import React, { useState, useEffect } from "react";
import "./MiniGames.css";
import "../../styles/enigmaCard.css";

const MorseGameCard = ({ onComplete, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [morseCode, setMorseCode] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showHint, setShowHint] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const messages = [
    "ROCHELLE",
    "QUARANTE",
    "MULHOUSE",
    "CATAMARAN",
    "VIVE DUDU",
  ];

  const morseAlphabet = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    " ": "/",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    "'": ".----.",
  };

  useEffect(() => {
    // Sélectionner un message aléatoire
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);

    // Convertir en morse
    const morse = randomMessage
      .toUpperCase()
      .split("")
      .map((char) => morseAlphabet[char] || "")
      .join(" ");
    setMorseCode(morse);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameEnd();
    }
  }, [timeLeft, isComplete]);

  const handleInputChange = (e) => {
    if (!isComplete) {
      setUserInput(e.target.value.toUpperCase());
    }
  };

  const handleSubmit = () => {
    const isCorrect = userInput.trim() === currentMessage;

    if (isCorrect) {
      const timeBonus = Math.max(0, timeLeft * 1); // Bonus aligné avec le nouveau système
      const finalScore = 200 + timeBonus; // Score de base aligné
      setScore(finalScore);
      setFeedback({
        type: "success",
        message: "🎉 Fantastique ! Vous avez gagné de nombreux points bonus !",
        score: finalScore,
      });
      setIsComplete(true);

      setTimeout(() => {
        onComplete({
          gameType: "morse",
          success: true,
          score: finalScore,
          timeBonus: timeBonus,
          skipped: false,
          message: `Message décodé: ${currentMessage}`,
        });
      }, 4000);
    } else {
      setFeedback({
        type: "error",
        message: "❌ Ce n'est pas la bonne réponse. Réessayez !",
      });
    }
  };

  const handleGameEnd = () => {
    if (!isComplete) {
      setFeedback({
        type: "warning",
        message: "⏰ Temps écoulé ! Le mini-jeu se termine.",
      });
      setIsComplete(true);

      setTimeout(() => {
        onComplete({
          gameType: "morse",
          success: false,
          score: 0,
          timeBonus: 0,
          skipped: true,
          message: "Temps écoulé",
        });
      }, 4000);
    }
  };

  const handleSkip = () => {
    setIsClosing(true);
    setTimeout(() => {
      onComplete({
        gameType: "morse",
        success: false,
        score: 0,
        timeBonus: 0,
        skipped: true,
        message: "Mini-jeu passé",
      });
    }, 300);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <>
      <div className="enigma-overlay" onClick={handleClose}>
        <div
          className={`enigma-card morse-game-card ${
            isClosing ? "closing" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="enigma-header">
            <div className="enigma-title">
              <h2>📡 Mini-Jeu : Décodage Morse</h2>
              <p className="enigma-subtitle">
                🎯 <strong>Défi spécial :</strong> Décodez le message morse et
                gagnez jusqu'à <strong>2000+ points bonus</strong> ! 💰
              </p>
            </div>
            <button className="close-btn" onClick={handleClose}>
              ✕
            </button>
          </div>

          <div className="enigma-content">
            <div className="morse-game-content">
              <div className="morse-timer">
                <div className="timer-display">
                  ⏱️ Temps restant :{" "}
                  <strong>
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </strong>
                </div>
                <div className="timer-bar">
                  <div
                    className="timer-fill"
                    style={{ width: `${(timeLeft / 300) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="morse-code-display">
                <h3>Code Morse à déchiffrer :</h3>
                <div className="morse-code">{morseCode}</div>
              </div>

              {!isComplete && (
                <div className="morse-input">
                  <label htmlFor="morse-answer">Votre réponse :</label>
                  <input
                    id="morse-answer"
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Tapez votre réponse..."
                    disabled={isComplete}
                    autoFocus
                  />
                </div>
              )}

              <div className="morse-help">
                <button
                  className="hint-btn"
                  onClick={() => setShowHint(!showHint)}
                >
                  💡 {showHint ? "Masquer" : "Afficher"} l'aide
                </button>

                {showHint && (
                  <div className="morse-alphabet">
                    <h4>Alphabet Morse :</h4>
                    <div className="alphabet-grid">
                      {Object.entries(morseAlphabet).map(([letter, code]) => (
                        <div key={letter} className="morse-letter">
                          <span className="letter">{letter}</span>
                          <span className="code">{code}</span>
                        </div>
                      ))}
                    </div>
                    <p>
                      <strong>/</strong> = espace entre les mots
                    </p>
                  </div>
                )}
              </div>

              {feedback && (
                <div className={`feedback ${feedback.type}`}>
                  <p>{feedback.message}</p>
                  {feedback.score > 0 && (
                    <p className="points-earned">
                      +{feedback.score} points gagnés !
                    </p>
                  )}
                </div>
              )}

              {isComplete && (
                <div className="game-success">
                  <h3>🎉 Mini-jeu terminé !</h3>
                  <p>
                    Message : <strong>{currentMessage}</strong>
                  </p>
                  {score > 0 && (
                    <p className="points-earned">+{score} points gagnés !</p>
                  )}
                  {score === 0 && <p>Aucun point gagné cette fois</p>}
                </div>
              )}
            </div>
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
      </div>
    </>
  );
};

export default MorseGameCard;
