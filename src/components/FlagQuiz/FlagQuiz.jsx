import React, { useState, useEffect, useRef } from "react";
import "./FlagQuiz.css";
import SoundManager from "../SoundManager/SoundManager";

const FlagQuiz = ({
  enigmas,
  onComplete,
  onClose,
  isMandatory = false,
  requiredScore = 80,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30); // 30 secondes par question
  const [timerActive, setTimerActive] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // États pour les événements sonores
  const [soundEvents, setSoundEvents] = useState({
    onSuccess: 0,
    onError: 0,
    onScan: 0,
  });

  const timerRef = useRef(null);

  // Générer les questions du quiz basées sur les énigmes
  useEffect(() => {
    const generateQuestions = () => {
      const flagQuestions = enigmas.map((enigma) => {
        // Créer des options de réponse avec le bon pays et 3 distracteurs
        const correctCountry = enigma.title.split(" ")[0]; // Extraire le nom du pays
        const allCountries = enigmas.map((e) => e.title.split(" ")[0]);

        // Créer des distracteurs (autres pays du jeu)
        const distractors = allCountries
          .filter((country) => country !== correctCountry)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options = [correctCountry, ...distractors].sort(
          () => Math.random() - 0.5
        );

        return {
          id: enigma.id,
          flag: enigma.flag,
          question: `A pays correspond à ce drapeau ?`,
          options: options,
          correctAnswer: correctCountry,
          funFact: `Vous avez visité ${correctCountry} lors de votre aventure !`,
        };
      });

      // Mélanger les questions
      return flagQuestions.sort(() => Math.random() - 0.5);
    };

    setQuestions(generateQuestions());
  }, [enigmas]);

  // Gestion du timer
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !showResult) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      // Temps écoulé, passer à la question suivante
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, timerActive, showResult]);

  // Démarrer le timer quand une nouvelle question commence
  useEffect(() => {
    if (questions.length > 0 && !quizCompleted && quizStarted) {
      setTimeLeft(10);
      setTimerActive(true);
    }
  }, [currentQuestionIndex, questions.length, quizCompleted, quizStarted]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setShowResult(true);
    // Déclencher le son d'erreur pour temps écoulé
    setSoundEvents((prev) => ({ ...prev, onError: prev.onError + 1 }));

    // Passer à la question suivante après 2 secondes
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
      setTimeLeft(30);
      setTimerActive(true);

      // Nettoyer les classes CSS des boutons précédents
      setTimeout(() => {
        const buttons = document.querySelectorAll(".answer-btn");
        buttons.forEach((btn) => {
          btn.classList.remove("correct", "incorrect");
        });
      }, 100);
    } else {
      setQuizCompleted(true);
      setTimerActive(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    if (showResult) return; // Empêcher les clics multiples

    setSelectedAnswer(answer);
    setShowResult(true);
    setTimerActive(false); // Arrêter le timer

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      // Déclencher le son de succès
      setSoundEvents((prev) => ({ ...prev, onSuccess: prev.onSuccess + 1 }));
    } else {
      // Déclencher le son d'erreur
      setSoundEvents((prev) => ({ ...prev, onError: prev.onError + 1 }));
    }

    // Passer à la question suivante après 2.5 secondes
    setTimeout(() => {
      nextQuestion();
    }, 2500);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) {
      return "🏆 Parfait ! Vous êtes un vrai expert en géographie !";
    } else if (percentage >= 80) {
      return "🌟 Excellent ! Vous avez une très bonne mémoire des pays visités !";
    } else if (percentage >= 60) {
      return "⚓ Bien joué ! Vous vous souvenez de la plupart de vos destinations !";
    } else {
      return "🧭 Pas mal ! Il est temps de réviser votre géographie maritime !";
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(10);
    setTimerActive(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setQuizStarted(false);
    setTimeLeft(30);
    setTimerActive(false);
    // Remélanger les questions
    setQuestions((prev) => [...prev].sort(() => Math.random() - 0.5));
    // Réinitialiser les événements sonores
    setSoundEvents({ onSuccess: 0, onError: 0, onScan: 0 });
  };

  if (questions.length === 0) {
    return (
      <div className="flag-quiz-overlay">
        <div className="flag-quiz-container">
          <div className="quiz-loading">
            <h2>🏴‍☠️ Préparation du Quiz des Drapeaux...</h2>
            <div className="loading-spinner">⚓</div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= requiredScore;

    return (
      <div className="flag-quiz-overlay">
        <div className="flag-quiz-container">
          <div className="quiz-completed">
            <h2>
              {isMandatory
                ? passed
                  ? "🏆 Quiz Validé !"
                  : "❌ Quiz Échoué"
                : "🏆 Quiz Terminé !"}
            </h2>
            <div className="final-score">
              <div className="score-display">
                <span className="score-number">{score}</span>
                <span className="score-total">/ {questions.length}</span>
                <div className="score-percentage">{percentage.toFixed(1)}%</div>
              </div>
              {isMandatory && (
                <div
                  className={`mandatory-result ${passed ? "passed" : "failed"}`}
                >
                  {passed ? (
                    <p>
                      ✅ Félicitations ! Vous avez atteint le score requis de{" "}
                      {requiredScore}% pour valider votre aventure !
                    </p>
                  ) : (
                    <p>
                      ❌ Score insuffisant. Il vous faut au minimum{" "}
                      {requiredScore}% pour valider l'aventure. Vous pouvez
                      réessayer !
                    </p>
                  )}
                </div>
              )}
              {!isMandatory && (
                <p className="score-message">{getScoreMessage()}</p>
              )}
            </div>

            <div className="quiz-summary">
              <h3>🗺️ Récapitulatif de votre voyage :</h3>
              <div className="countries-visited">
                {enigmas.map((enigma) => (
                  <div key={enigma.id} className="country-item">
                    <span className="country-flag">{enigma.flag}</span>
                    <span className="country-name">
                      {enigma.title.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="quiz-actions">
              {isMandatory ? (
                // Mode obligatoire
                <>
                  {passed ? (
                    <button
                      className="quiz-btn primary"
                      onClick={() => onComplete(score, questions.length)}
                    >
                      🎉 Valider l'Aventure
                    </button>
                  ) : (
                    <>
                      <button
                        className="quiz-btn primary"
                        onClick={restartQuiz}
                      >
                        🔄 Réessayer le Quiz
                      </button>
                      <button className="quiz-btn secondary" onClick={onClose}>
                        ⏸️ Reprendre Plus Tard
                      </button>
                    </>
                  )}
                </>
              ) : (
                // Mode optionnel
                <>
                  <button className="quiz-btn primary" onClick={restartQuiz}>
                    🔄 Refaire le Quiz
                  </button>
                  <button
                    className="quiz-btn secondary"
                    onClick={() => onComplete(score, questions.length)}
                  >
                    ✅ Continuer
                  </button>
                  <button className="quiz-btn close" onClick={onClose}>
                    ❌ Fermer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flag-quiz-overlay">
      <div className="flag-quiz-container">
        <div className="quiz-header">
          <h2>
            🏴‍☠️ Avant de célebrer votre victroire, voyons si vous êtes dignes de
            faire parti de l'équipage
          </h2>
          {quizStarted && (
            <div className="quiz-progress">
              <span className="question-counter">
                Question {currentQuestionIndex + 1} / {questions.length}
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="current-score">Score: {score}</span>
              <div className="timer-display">
                <span
                  className={`timer ${timeLeft <= 10 ? "timer-warning" : ""}`}
                >
                  ⏱️ {timeLeft}s
                </span>
              </div>
            </div>
          )}
          <button className="quiz-close-btn" onClick={onClose}>
            ❌
          </button>
        </div>

        <div className="quiz-content">
          {!quizStarted ? (
            <div className="quiz-start-section">
              <div className="start-instructions">
                <p>
                  🎯 Vous allez être testé sur les pays que vous avez visités
                  lors de votre aventure.
                </p>
                <p>⏱️ Vous aurez 10 secondes par question.</p>
                <p>🏆 Montrez que vous êtes un vrai navigateur !</p>
              </div>
              <button className="start-quiz-btn" onClick={startQuiz}>
                🚀 Commencer le Quiz
              </button>
            </div>
          ) : (
            <>
              <div className="question-section">
                <div className="flag-display">
                  <span className="flag-emoji">{currentQuestion.flag}</span>
                </div>
                <h3 className="question-text">{currentQuestion.question}</h3>
              </div>

              <div className="answers-section">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "answer-btn";

                  if (showResult && selectedAnswer) {
                    if (option === currentQuestion.correctAnswer) {
                      buttonClass += " correct";
                    } else if (
                      option === selectedAnswer &&
                      option !== currentQuestion.correctAnswer
                    ) {
                      buttonClass += " incorrect";
                    }
                  }

                  return (
                    <button
                      key={index}
                      className={buttonClass}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showResult}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className="result-section">
                  <div
                    className={`result-message ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "correct"
                        : "incorrect"
                    }`}
                  >
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <>
                        <span className="result-icon">✅</span>
                        <span>Correct !</span>
                      </>
                    ) : selectedAnswer ? (
                      <>
                        <span className="result-icon">❌</span>
                        <span>
                          La bonne réponse était :{" "}
                          {currentQuestion.correctAnswer}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="result-icon">⏰</span>
                        <span>
                          Temps écoulé ! La bonne réponse était :{" "}
                          {currentQuestion.correctAnswer}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="fun-fact">{currentQuestion.funFact}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Gestionnaire de sons */}
      <SoundManager
        gameState="playing"
        onSuccess={soundEvents.onSuccess}
        onError={soundEvents.onError}
        onScan={soundEvents.onScan}
      />
    </div>
  );
};

export default FlagQuiz;
