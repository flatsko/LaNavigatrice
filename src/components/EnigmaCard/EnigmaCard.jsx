import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from "react";

import EnigmaHeader from "./components/EnigmaHeader";
import EnigmaContent from "./components/EnigmaContent";
import EnigmaImage from "./components/EnigmaImage";
import EnigmaQuestion from "./components/EnigmaQuestion";
import AnswerOptions from "./components/AnswerOptions";
import EnigmaFeedback from "./components/EnigmaFeedback";
import SubmitButton from "./components/SubmitButton";
import PhotoSection from "./components/PhotoSection";
import Camera from "../Camera/Camera";
import PhotoNotification from "../PhotoNotification/PhotoNotification";

import { GAME_RULES } from "../../utils/scoring";
import { savePhoto } from "../../utils/photoStorage";
import { useIsMobile } from "../../hooks/useIsMobile";

import "../../styles/enigmaCard.css";

const initialState = {
  selectedAnswer: "",
  feedback: null,
  isSubmitting: false,
  isSuccess: false,
  isFailure: false,
  showCamera: false,
  isClosing: false,
  showHint: false,
  hintUsed: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_ANSWER":
      return {
        ...state,
        selectedAnswer: action.payload,
        feedback: null,
        isFailure: false,
        isSuccess: false,
      };
    case "SET_FEEDBACK":
      return { ...state, feedback: action.payload };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, feedback: null };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        isSuccess: true,
        feedback: action.payload,
      };
    case "SUBMIT_FAILURE":
      return {
        ...state,
        isSubmitting: false,
        isFailure: true,
        feedback: action.payload,
      };
    case "SHOW_CAMERA":
      return { ...state, showCamera: true };
    case "HIDE_CAMERA":
      return { ...state, showCamera: false };
    case "START_CLOSING":
      return { ...state, isClosing: true };
    case "SHOW_HINT":
      return { ...state, showHint: true, hintUsed: true };
    case "HIDE_HINT":
      return { ...state, showHint: false };
    case "RESET":
      return initialState;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

const EnigmaCard = ({
  enigma,
  onSolve,
  onClose,
  player,
  onTriggerVictory,
  onPhotoShared,
  onTriggerMinigame,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    selectedAnswer,
    feedback,
    isSubmitting,
    isSuccess,
    isFailure,
    showCamera,
    isClosing,
    showHint,
    hintUsed,
  } = state;

  const [photoTaken, setPhotoTaken] = useState(false);
  const [notification, setNotification] = useState(null);
  const hasProcessedSuccess = useRef(false);
  const isMobile = useIsMobile();

  const currentAttempts = player?.enigmaAttempts?.[enigma?.id] || 0;
  const canAttempt = GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA - currentAttempts > 0;

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPhotoTaken(false);
    setNotification(null);
    hasProcessedSuccess.current = false;
  }, [enigma?.id]); // Ne se déclenche que quand l'énigme change

  // Effet séparé pour vérifier si l'énigme est déjà complétée
  useEffect(() => {
    if (player?.completed?.includes(enigma?.id)) {
      hasProcessedSuccess.current = true;
      dispatch({
        type: "SUBMIT_SUCCESS",
        payload: {
          type: "success",
          message: `🎉 Bravo ! Vous avez découvert ${enigma.title} !`,
          funFact: enigma.funFact,
        },
      });
    }
  }, [player?.completed, enigma?.id, enigma?.title, enigma?.funFact]);

  // Détecter automatiquement quand les tentatives sont épuisées
  useEffect(() => {
    if (!canAttempt && currentAttempts > 0 && !isSuccess && !isFailure) {
      dispatch({
        type: "SUBMIT_FAILURE",
        payload: {
          type: "error",
          message: `❌ Tentatives épuisées !\nVous devez passer à une autre énigme.`,
          funFact: enigma.funFact,
        },
      });
    }
  }, [canAttempt, currentAttempts, isSuccess, isFailure]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    dispatch({ type: "START_CLOSING" });
    setTimeout(onClose, 500);
  }, [isClosing, onClose]);

  const handleHintClick = useCallback(() => {
    if (hintUsed || !enigma.indice) return;
    
    // Appliquer la pénalité pour l'indice
    if (onSolve) {
      onSolve(enigma.id, null, { hintUsed: true });
    }
    
    dispatch({ type: "SHOW_HINT" });
  }, [hintUsed, enigma.indice, enigma.id, onSolve]);

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer.trim() || hasProcessedSuccess.current) return;

    if (!canAttempt) {
      dispatch({
        type: "SUBMIT_FAILURE",
        payload: {
          type: "error",
          message: `❌ Tentatives épuisées !\nVous devez passer à une autre énigme.`,
          funFact: enigma.funFact,
        },
      });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    const isCorrect = onSolve(enigma.id, selectedAnswer, { hintUsed });

    if (isCorrect) {
      hasProcessedSuccess.current = true;
      dispatch({
        type: "SUBMIT_SUCCESS",
        payload: {
          type: "success",
          message: `🎉 Bravo ! Vous avez découvert ${enigma.title} !\n\n${enigma.funFact}`,
        },
      });
    } else {
      dispatch({
        type: "SUBMIT_FAILURE",
        payload: {
          type: "error",
          message: `❌ Réponse incorrecte !\nVous devez passer à une autre énigme.`,
          funFact: enigma.funFact,
        },
      });
    }
  }, [selectedAnswer, canAttempt, onSolve, enigma, isClosing, hintUsed]);

  const handlePhotoCapture = (photoData) => {
    const savedPhoto = savePhoto({
      ...photoData,
      enigmaId: enigma.id,
      enigmaTitle: enigma.title,
      context: isSuccess ? "success" : "failure",
    });
    if (savedPhoto) {
      setPhotoTaken(true);
      dispatch({ type: "HIDE_CAMERA" });
      setNotification({
        message: "📸 Photo sauvegardée avec succès !",
        type: "success",
      });
      if (onPhotoShared) onPhotoShared(savedPhoto);

      // Déclencher un mini-jeu aléatoirement avant la fermeture
      const minigameTriggered = onTriggerMinigame ? onTriggerMinigame() : false;

      if (player?.pendingVictory) {
        setTimeout(() => onTriggerVictory?.(), minigameTriggered ? 3000 : 2000);
      } else {
        setTimeout(handleClose, minigameTriggered ? 3000 : 2000);
      }
    } else {
      setNotification({
        message: "❌ Erreur lors de la sauvegarde de la photo",
        type: "error",
      });
    }
  };

  // Fonction pour générer un feedback par défaut
  const getDefaultFeedback = () => {
    if (isSuccess) {
      return {
        type: 'success',
        message: `🎉 Bravo ! Vous avez découvert ${enigma.title} !`,
        funFact: enigma.funFact
      };
    }
    if (isFailure) {
      return {
        type: 'error',
        message: '❌ Énigme non résolue',
        funFact: enigma.funFact
      };
    }
    return {
      type: 'info',
      message: '🤔 Réfléchissez bien avant de répondre...',
      funFact: null
    };
  };

  const handleContinueWithoutPhoto = () => {
    dispatch({ type: "HIDE_CAMERA" });

    // Déclencher un mini-jeu aléatoirement avant la fermeture
    const minigameTriggered = onTriggerMinigame ? onTriggerMinigame() : false;

    if (player?.pendingVictory) {
      setTimeout(() => onTriggerVictory?.(), minigameTriggered ? 3000 : 2000);
    } else {
      setTimeout(handleClose, minigameTriggered ? 3000 : 2000);
    }
  };

  if (!enigma || isClosing) return null;

  if (showCamera && isMobile) {
    return (
      <Camera
        onCapture={handlePhotoCapture}
        onClose={() => dispatch({ type: "HIDE_CAMERA" })}
        enigmaTitle={enigma.title}
      />
    );
  }

  return (
    <div className="enigma-overlay" onClick={handleClose}>
      <div className="enigma-card" onClick={(e) => e.stopPropagation()}>
        <EnigmaHeader
          enigma={enigma}
          onClose={handleClose}
          attempts={currentAttempts}
          successRate={
            player?.totalAttempts > 0
              ? Math.round(
                  (player?.completed?.length / player?.totalAttempts) * 100
                )
              : 100
          }
        />
        <EnigmaContent>
          <EnigmaImage
            image={enigma.image}
            alt={enigma.title}
            isSuccess={isSuccess}
          />

          {!isSuccess && !isFailure && !isSubmitting && (
            <EnigmaQuestion
              question={{ title: "🤔 Question", text: enigma.question }}
            />
          )}

          <EnigmaFeedback feedback={feedback || getDefaultFeedback()} />

          {(isSuccess || isFailure) && (
            <PhotoSection
              isMobile={isMobile}
              isSuccess={isSuccess}
              isFailure={isFailure}
              photoTaken={photoTaken}
              onTakePhoto={() => dispatch({ type: "SHOW_CAMERA" })}
              onContinue={handleContinueWithoutPhoto}
              photoPrompt={enigma.photoPrompt}
            />
          )}
          {/* {!canAttempt && !isSuccess && (
            <div className="attempts-exhausted">
              <div className="exhausted-icon">🚫</div>
              <h3>Tentatives épuisées</h3>
              <p>Vous avez utilisé toutes vos tentatives pour cette énigme.</p>
            </div>
          )} */}
          {!isSuccess && !isFailure && canAttempt && (
            <>
              {/* Système d'indices */}
              {enigma.indice && (
                <div className="hint-section">
                  {!showHint && !hintUsed && (
                    <button 
                      className="hint-button"
                      onClick={handleHintClick}
                      disabled={isSubmitting}
                    >
                      💡 Utiliser un indice (-30 points)
                    </button>
                  )}
                  {showHint && (
                    <div className="hint-display">
                      <div className="hint-icon">💡</div>
                      <div className="hint-content">
                        <h4>Indice :</h4>
                        <p>{enigma.indice}</p>
                        <small className="hint-penalty">⚠️ 30 points déduits</small>
                      </div>
                      <button 
                        className="hint-close"
                        onClick={() => dispatch({ type: "HIDE_HINT" })}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {hintUsed && !showHint && (
                    <div className="hint-used">
                      <span className="hint-used-icon">💡</span>
                      <span className="hint-used-text">Indice utilisé (-30 points)</span>
                      <button 
                        className="hint-show-again"
                        onClick={() => dispatch({ type: "SHOW_HINT" })}
                      >
                        Revoir l'indice
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <AnswerOptions
                options={enigma.answers.map((a) => ({ id: a, text: a }))}
                selectedAnswer={selectedAnswer}
                onSelect={(answer) =>
                  dispatch({ type: "SELECT_ANSWER", payload: answer })
                }
                disabled={isSubmitting || isSuccess || !canAttempt}
              />
              <SubmitButton
                onClick={handleSubmit}
                disabled={!selectedAnswer || isSubmitting || !canAttempt}
                isSuccess={isSuccess}
                isFailure={isFailure}
              />
            </>
          )}
        </EnigmaContent>
        {notification && (
          <PhotoNotification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EnigmaCard;
