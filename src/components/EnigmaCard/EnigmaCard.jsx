import React, { useState, useEffect, useRef } from "react";
import { GAME_RULES } from "../../utils/scoring";
import Camera from "../Camera/Camera";
import PhotoNotification from "../PhotoNotification/PhotoNotification";
import { savePhoto } from "../../utils/photoStorage";
import { useIsMobile } from "../../hooks/useIsMobile";
import "../../styles/enigmaCard.css";

const EnigmaCard = ({ enigma, onSolve, onClose, player, onTriggerVictory, onPhotoShared }) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  // AJOUT: Refs pour éviter les conflits de re-render
  const hasProcessedSuccess = useRef(false);
  const closeTimeoutRef = useRef(null);
  const photoTimeoutRef = useRef(null);
  const initialEnigmaId = useRef(enigma?.id);

  const isMobile = useIsMobile();

  // MODIFICATION: Reset seulement si l'énigme change vraiment
  useEffect(() => {
    if (enigma?.id && enigma.id !== initialEnigmaId.current) {
      console.log("🔄 Nouvelle énigme détectée:", enigma.id);
      initialEnigmaId.current = enigma.id;
      hasProcessedSuccess.current = false;

      // Clear timeouts
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (photoTimeoutRef.current) clearTimeout(photoTimeoutRef.current);

      // Reset states
      setSelectedAnswer("");
      setFeedback(null);
      setIsSubmitting(false);
      setIsSuccess(false);
      setShowCamera(false);
      setPhotoTaken(false);
      setNotification(null);
      setIsClosing(false);
    }
  }, [enigma?.id]);

  // AJOUT: Cleanup des timeouts
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (photoTimeoutRef.current) clearTimeout(photoTimeoutRef.current);
    };
  }, []);

  // AJOUT: Empêcher les re-renders de réinitialiser l'état de succès
  useEffect(() => {
    if (
      player?.completed?.includes(enigma?.id) &&
      !hasProcessedSuccess.current
    ) {
      console.log("🎉 Énigme déjà complétée détectée:", enigma.id);
      setIsSuccess(true);
      hasProcessedSuccess.current = true;

      setFeedback({
        type: "success",
        message: `🎉 Bravo ! Vous avez découvert ${enigma.title} !\n\n${enigma.funFact}`,
      });
    }
  }, [
    player?.completed,
    enigma?.id,
    enigma?.title,
    enigma?.funFact,
    enigma?.hasPhoto,
    isMobile,
    isClosing,
  ]);

  const enigmaAttempts = player?.enigmaAttempts || {};
  const currentAttempts = enigmaAttempts[enigma?.id] || 0;
  const remainingAttempts =
    GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA - currentAttempts;
  const canAttempt = remainingAttempts > 0;

  const totalAttempts = player?.totalAttempts || 0;
  const correctAnswers = player?.completed?.length || 0;
  const currentSuccessRate =
    totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 100;

  const handlePhotoCapture = (photoData) => {
    const savedPhoto = savePhoto({
      ...photoData,
      enigmaId: enigma.id,
      enigmaTitle: enigma.title,
    });

    if (savedPhoto) {
      setPhotoTaken(true);
      setShowCamera(false);
      setNotification({
        message: "📸 Photo sauvegardée avec succès !",
        type: "success",
      });
      
      // Ajouter la photo à la galerie partagée
      if (onPhotoShared) {
        onPhotoShared(savedPhoto);
      }

      // AJOUT: Vérifier si c'est la dernière énigme
      const isPendingVictory = player?.pendingVictory;

      if (isPendingVictory) {
        console.log(
          "🎉 Photo prise pour dernière énigme - déclenchement victoire"
        );
        setTimeout(() => {
          if (onTriggerVictory) {
            onTriggerVictory();
          }
        }, 2000);
      } else {
        // Fermer normalement après la photo
        setTimeout(() => {
          handleFinalClose();
        }, 2000);
      }
    } else {
      setNotification({
        message: "❌ Erreur lors de la sauvegarde de la photo",
        type: "error",
      });
    }
  };

  const handleFinalClose = () => {
    if (isClosing) return;

    console.log("🚪 Fermeture finale de l'énigme");
    setIsClosing(true);
    document.body.classList.remove("camera-open");

    // Clear timeouts
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (photoTimeoutRef.current) clearTimeout(photoTimeoutRef.current);

    // setTimeout(() => {
    //   onClose();
    // }, 100);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer.trim()) {
      setFeedback({
        type: "error",
        message: "Veuillez sélectionner une réponse !",
      });
      return;
    }

    if (!canAttempt) {
      setFeedback({
        type: "error",
        message: "Nombre maximum de tentatives atteint pour cette énigme !",
      });
      return;
    }

    if (!enigma?.id) {
      setFeedback({
        type: "error",
        message: "Erreur: Énigme non valide !",
      });
      return;
    }

    // Empêcher les soumissions multiples
    if (hasProcessedSuccess.current) {
      console.log("⚠️ Soumission ignorée - déjà traitée");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      console.log("📝 Appel onSolve avec:", enigma.id, selectedAnswer);
      const isCorrect = onSolve(enigma.id, selectedAnswer);

      if (isCorrect) {
        console.log("✅ Réponse correcte - traitement du succès");
        hasProcessedSuccess.current = true;
        setIsSuccess(true);
        setFeedback({
          type: "success",
          message: `🎉 Bravo ! Vous avez découvert ${enigma.title} !\n\n${enigma.funFact}`,
        });

        // // Logique photo/fermeture
        // if (enigma.hasPhoto && isMobile) {
        //   console.log("📸 Proposition photo dans 2 secondes");
        //   photoTimeoutRef.current = setTimeout(() => {
        //     if (!isClosing) {
        //       console.log("📸 Ouverture caméra");
        //       setShowCamera(true);
        //     }
        //   }, 2000);
        // } else {
        //   console.log("🚪 Fermeture automatique dans 4 secondes");
        //   closeTimeoutRef.current = setTimeout(() => {
        //     if (!isClosing) {
        //       handleFinalClose();
        //     }
        //   }, 4000);
        // }
      } else {
        const newRemainingAttempts = remainingAttempts - 1;

        if (newRemainingAttempts > 0) {
          setFeedback({
            type: "error",
            message: `❌ Réponse incorrecte !\n\nTentatives restantes : ${newRemainingAttempts}\nTaux de réussite actuel : ${Math.round(
              currentSuccessRate
            )}%`,
          });
          setSelectedAnswer("");
        } else {
          setFeedback({
            type: "error",
            message:
              "❌ Nombre maximum de tentatives atteint !\nVous devez passer à une autre énigme.",
          });
          closeTimeoutRef.current = setTimeout(() => {
            if (!isClosing) {
              handleFinalClose();
            }
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setFeedback({
        type: "error",
        message: `Erreur lors de la validation: ${error.message}`,
      });
    }

    setIsSubmitting(false);
  };

  const handleAnswerSelect = (answer) => {
    if (!isSuccess && canAttempt && !isClosing) {
      setSelectedAnswer(answer);
      setFeedback(null);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !showCamera && !isClosing) {
      handleFinalClose();
    }
  };

  const handleContinueWithoutPhoto = () => {
    console.log("⏭️ Continuer sans photo");
    setShowCamera(false);

    const isPendingVictory = player?.pendingVictory;

    if (isPendingVictory) {
      console.log(
        "🎉 Pas de photo pour dernière énigme - déclenchement victoire"
      );
      setTimeout(() => {
        if (onTriggerVictory) {
          onTriggerVictory();
        }
      }, 500);
    } else {
      setTimeout(() => {
        if (!isClosing) {
          handleFinalClose();
        }
      }, 500);
    }
  };

  const handleTakePhoto = () => {
    console.log("📸 Demande de prise de photo");
    if (photoTimeoutRef.current) clearTimeout(photoTimeoutRef.current);
    setShowCamera(true);
  };

  // Si la caméra est ouverte, ne pas rendre l'énigme card
  if (showCamera && isMobile) {
    return (
      <Camera
        onCapture={handlePhotoCapture}
        onClose={() => {
          console.log("📸 Fermeture caméra");
          setShowCamera(false);
        }}
        enigmaTitle={enigma.title}
      />
    );
  }

  // Empêcher le rendu si en cours de fermeture
  if (!enigma || isClosing) {
    return null;
  }

  // Debug logs
  console.log("🔍 EnigmaCard render:", {
    enigmaId: enigma.id,
    isSuccess,
    showCamera,
    photoTaken,
    hasProcessedSuccess: hasProcessedSuccess.current,
    isClosing,
  });

  return (
    <>
      <div className="enigma-overlay">
        <div className="enigma-card">
          <div className="enigma-header">
            <button
              className="enigma-close-btn"
              onClick={handleClose}
              disabled={isSubmitting || showCamera || isClosing}
            >
              ✕
            </button>
            <h2 className="enigma-title">{enigma.title}</h2>
            <p className="enigma-location">Destination mystérieuse</p>

            {/* Indicateurs de progression - Masquer après succès */}
            {!isSuccess && (
              <div className="enigma-progress">
                <div className="attempt-counter">
                  <span
                    className={`attempts ${!canAttempt ? "exhausted" : ""}`}
                  >
                    🎯 Tentatives : {currentAttempts}/
                    {GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA}
                  </span>
                </div>
                <div className="success-rate">
                  <span
                    className={`rate ${
                      currentSuccessRate < 50 ? "warning" : "good"
                    }`}
                  >
                    📊 Réussite : {Math.round(currentSuccessRate)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="enigma-content">
            {(enigma.image || enigma.successImage) && (
              <div className="enigma-image-container">
                <img
                  src={isSuccess && enigma.successImage ? enigma.successImage : enigma.image}
                  alt={enigma.title}
                  className={`enigma-image ${isSuccess ? 'success-image' : ''}`}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="enigma-details">
              {/* Question - Masquer après succès */}
              {!isSuccess && (
                <div className="enigma-question">
                  <h3>🤔 Question</h3>
                  <p>{enigma.question}</p>
                </div>
              )}

              {/* Réponses - Masquer après succès */}
              {!isSuccess && canAttempt && (
                <div className="enigma-answers">
                  <h4>Choisissez votre réponse :</h4>
                  <div className="answer-options">
                    {enigma.answers.map((answer, index) => (
                      <button
                        key={index}
                        className={`answer-option ${
                          selectedAnswer === answer ? "selected" : ""
                        }`}
                        onClick={() => handleAnswerSelect(answer)}
                        disabled={
                          isSubmitting || isSuccess || !canAttempt || isClosing
                        }
                      >
                        {answer}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tentatives épuisées */}
              {!canAttempt && !isSuccess && (
                <div className="attempts-exhausted">
                  <div className="exhausted-icon">🚫</div>
                  <h3>Tentatives épuisées</h3>
                  <p>
                    Vous avez utilisé toutes vos tentatives pour cette énigme.
                  </p>
                  <p>Passez à une autre énigme pour continuer votre quête !</p>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className={`enigma-feedback ${feedback.type}`}>
                  {feedback.message.split("\n").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              )}

              {/* Célébration de succès */}
              {isSuccess && !showCamera && (
                <div className="success-celebration">
                  <div className="celebration-icon">🏆</div>
                  <h3>Fragment de carte découvert !</h3>
                  {enigma.successImage && enigma.successImage !== enigma.image && (
                    <p className="image-reveal">✨ L'image révèle maintenant ses secrets ! ✨</p>
                  )}
                </div>
              )}

              {/* Section photo mobile */}
              {isSuccess && enigma.hasPhoto && isMobile && !showCamera && (
                <div className="photo-section">
                  <div className="photo-prompt">
                    <h4>📸 Moment Souvenir</h4>
                    <p>
                      {enigma.photoPrompt ||
                        "Immortalisez ce moment avec une photo de groupe !"}
                    </p>

                    <div className="photo-actions">
                      {!photoTaken ? (
                        <>
                          <button
                            onClick={handleTakePhoto}
                            className="photo-btn primary"
                            disabled={isClosing}
                          >
                            📸 Prendre une photo
                          </button>
                          <button
                            onClick={handleContinueWithoutPhoto}
                            className="photo-btn secondary"
                            disabled={isClosing}
                          >
                            Continuer sans photo
                          </button>
                        </>
                      ) : (
                        <div className="photo-taken">
                          <span className="photo-success">
                            ✅ Photo prise !
                          </span>
                          <p>Fermeture automatique...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section photo desktop */}
              {isSuccess && enigma.hasPhoto && !isMobile && (
                <div className="desktop-photo-section">
                  <div className="desktop-photo-prompt">
                    <h4>📱 Photos Souvenirs</h4>
                    <p>
                      Pour prendre des photos souvenirs, utilisez votre
                      téléphone portable !
                    </p>
                    <p className="desktop-photo-hint">
                      💡 Scannez le QR code de cette énigme avec votre téléphone
                      pour accéder à la fonctionnalité photo.
                    </p>
                    <button
                      onClick={handleContinueWithoutPhoto}
                      className="photo-btn primary desktop-continue"
                      disabled={isClosing}
                    >
                      Continuer l'aventure
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions - Masquer après succès */}
          {!isSuccess && canAttempt && (
            <div className="enigma-actions">
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={
                  !selectedAnswer || isSubmitting || !canAttempt || isClosing
                }
              >
                {isSubmitting ? "⏳ Validation..." : "🔍 Valider"}
              </button>

              <div className="action-warning">
                {remainingAttempts <= 2 && (
                  <small className="warning-text">
                    ⚠️ Attention : {remainingAttempts} tentative(s) restante(s)
                  </small>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <PhotoNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default EnigmaCard;
