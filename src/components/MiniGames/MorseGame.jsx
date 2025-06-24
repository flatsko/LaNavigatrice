import React, { useState, useEffect } from "react";
import "./MiniGames.css";

const MorseGame = ({ onComplete, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [morseCode, setMorseCode] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState(false);

  const messages = ["VIVE DUDU", "CAPITAINE DUDU", "CATAMARAN", "LA ROCHELLE"];

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
    const input = e.target.value.toUpperCase();
    setUserInput(input);

    // Vérifier si la réponse est correcte
    if (input === currentMessage) {
      setIsComplete(true);
      const timeBonus = timeLeft * 10;
      const finalScore = 1000 + timeBonus;
      setScore(finalScore);

      setTimeout(() => {
        onComplete({
          success: true,
          score: finalScore,
          timeBonus: timeBonus,
          message: currentMessage,
        });
      }, 1500);
    }
  };

  const handleGameEnd = () => {
    onComplete({
      success: false,
      score: 0,
      timeBonus: 0,
      message: currentMessage,
    });
  };

  const handleSkip = () => {
    onComplete({
      success: false,
      score: 0,
      timeBonus: 0,
      skipped: true,
      message: currentMessage,
    });
  };

  const playMorseAudio = () => {
    // Simulation audio morse (à implémenter avec Web Audio API si souhaité)
    console.log("Playing morse:", morseCode);
  };

  return (
    <div className="minigame-overlay">
      <div className="minigame-container morse-game">
        <div className="minigame-header">
          <h2>📡 Décodage Morse</h2>
          <div className="game-info">
            <span className="timer">⏱️ {timeLeft}s</span>
            <button className="skip-btn" onClick={handleSkip}>
              ⏭️ Passer
            </button>
          </div>
        </div>

        <div className="morse-content">
          <div className="morse-display">
            <h3>Message à décoder :</h3>
            <div className="morse-code">{morseCode}</div>
            <button className="play-morse-btn" onClick={playMorseAudio}>
              🔊 Rejouer le signal
            </button>
          </div>

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

          <div className="morse-help">
            <button className="hint-btn" onClick={() => setShowHint(!showHint)}>
              💡 {showHint ? "Masquer" : "Afficher"} l'aide
            </button>

            {showHint && (
              <div className="morse-alphabet">
                <h4>Alphabet Morse :</h4>
                <div className="alphabet-grid">
                  {Object.entries(morseAlphabet)
                    .slice(0, 26)
                    .map(([letter, code]) => (
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
        </div>

        {isComplete && (
          <div className="game-success">
            <h3>🎉 Bravo !</h3>
            <p>
              Message décodé : <strong>{currentMessage}</strong>
            </p>
            <p>
              Score : <strong>{score} points</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MorseGame;
