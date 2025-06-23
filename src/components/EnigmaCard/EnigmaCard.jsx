import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';


import EnigmaHeader from './components/EnigmaHeader';
import EnigmaContent from './components/EnigmaContent';
import EnigmaImage from './components/EnigmaImage';
import EnigmaQuestion from './components/EnigmaQuestion';
import AnswerOptions from './components/AnswerOptions';
import EnigmaFeedback from './components/EnigmaFeedback';
import SubmitButton from './components/SubmitButton';
import PhotoSection from './components/PhotoSection';
import Camera from '../Camera/Camera';
import PhotoNotification from '../PhotoNotification/PhotoNotification';

import { GAME_RULES } from '../../utils/scoring';
import { savePhoto } from '../../utils/photoStorage';
import { useIsMobile } from '../../hooks/useIsMobile';

import '../../styles/enigmaCard.css';

const initialState = {
  selectedAnswer: '',
  feedback: null,
  isSubmitting: false,
  isSuccess: false,
  isFailure: false,
  showCamera: false,
  isClosing: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_ANSWER':
      return { ...state, selectedAnswer: action.payload, feedback: null };
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, feedback: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, isSuccess: true, feedback: action.payload };
    case 'SUBMIT_FAILURE':
      return { ...state, isSubmitting: false, isFailure: true, feedback: action.payload };
    case 'SHOW_CAMERA':
      return { ...state, showCamera: true };
    case 'HIDE_CAMERA':
      return { ...state, showCamera: false };
    case 'START_CLOSING':
      return { ...state, isClosing: true };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

const EnigmaCard = ({ enigma, onSolve, onClose, player, onTriggerVictory, onPhotoShared }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { selectedAnswer, feedback, isSubmitting, isSuccess, isFailure, showCamera, isClosing } = state;

  const [photoTaken, setPhotoTaken] = useState(false);
  const [notification, setNotification] = useState(null);
  const hasProcessedSuccess = useRef(false);
  const isMobile = useIsMobile();

  const currentAttempts = player?.enigmaAttempts?.[enigma?.id] || 0;
  const canAttempt = (GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA - currentAttempts) > 0;

  useEffect(() => {
    dispatch({ type: 'RESET' });
    setPhotoTaken(false);
    setNotification(null);
    hasProcessedSuccess.current = false;
    if (player?.completed?.includes(enigma?.id)) {
      hasProcessedSuccess.current = true;
      dispatch({ type: 'SUBMIT_SUCCESS', payload: { type: 'success', message: `🎉 Bravo ! Vous avez découvert ${enigma.title} !\n\n${enigma.funFact}` } });
    }
  }, [enigma, player]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    dispatch({ type: 'START_CLOSING' });
    setTimeout(onClose, 500);
  }, [isClosing, onClose]);

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer.trim() || !canAttempt || hasProcessedSuccess.current) return;

    dispatch({ type: 'SUBMIT_START' });

    const isCorrect = onSolve(enigma.id, selectedAnswer);

    if (isCorrect) {
      hasProcessedSuccess.current = true;
      dispatch({ type: 'SUBMIT_SUCCESS', payload: { type: 'success', message: `🎉 Bravo ! Vous avez découvert ${enigma.title} !\n\n${enigma.funFact}` } });
    } else {
      dispatch({ type: 'SUBMIT_FAILURE', payload: { type: 'error', message: '❌ Réponse incorrecte !\nVous devez passer à une autre énigme.' } });
    }
  }, [selectedAnswer, canAttempt, onSolve, enigma, isClosing]);

  const handlePhotoCapture = (photoData) => {
    const savedPhoto = savePhoto({ ...photoData, enigmaId: enigma.id, enigmaTitle: enigma.title, context: isSuccess ? 'success' : 'failure' });
    if (savedPhoto) {
      setPhotoTaken(true);
      dispatch({ type: 'HIDE_CAMERA' });
      setNotification({ message: '📸 Photo sauvegardée avec succès !', type: 'success' });
      if (onPhotoShared) onPhotoShared(savedPhoto);
      if (player?.pendingVictory) {
        setTimeout(() => onTriggerVictory?.(), 2000);
      } else {
        setTimeout(handleClose, 2000);
      }
    } else {
      setNotification({ message: '❌ Erreur lors de la sauvegarde de la photo', type: 'error' });
    }
  };

  const handleContinueWithoutPhoto = () => {
    dispatch({ type: 'HIDE_CAMERA' });
    if (player?.pendingVictory) {
      setTimeout(() => onTriggerVictory?.(), 500);
    } else {
      setTimeout(handleClose, 500);
    }
  };

  if (!enigma || isClosing) return null;

  if (showCamera && isMobile) {
    return <Camera onCapture={handlePhotoCapture} onClose={() => dispatch({ type: 'HIDE_CAMERA' })} enigmaTitle={enigma.title} />;
  }

  return (
    <div className="enigma-overlay" onClick={handleClose}>
        <div className="enigma-card" onClick={(e) => e.stopPropagation()}>
            <EnigmaHeader 
                enigma={enigma} 
                onClose={handleClose} 
                attempts={currentAttempts} 
                successRate={player?.totalAttempts > 0 ? Math.round((player?.completed?.length / player?.totalAttempts) * 100) : 100} 
            />
            <EnigmaContent>
                <EnigmaImage image={isSuccess && enigma.successImage ? enigma.successImage : enigma.image} alt={enigma.title} />
                
                {!isSuccess && <EnigmaQuestion question={{ title: '🤔 Question', text: enigma.question }} />}

                {!canAttempt && !isSuccess && (
                    <div className="attempts-exhausted">
                        <div className="exhausted-icon">🚫</div>
                        <h3>Tentatives épuisées</h3>
                        <p>Vous avez utilisé toutes vos tentatives pour cette énigme.</p>
                    </div>
                )}

                <EnigmaFeedback feedback={feedback} />

                {(isSuccess || isFailure) && enigma.hasPhoto && (
                    <PhotoSection 
                        isMobile={isMobile} 
                        isSuccess={isSuccess}
                        photoTaken={photoTaken}
                        onTakePhoto={() => dispatch({ type: 'SHOW_CAMERA' })}
                        onContinue={handleContinueWithoutPhoto}
                        photoPrompt={enigma.photoPrompt}
                    />
                )}

                {!isSuccess && canAttempt && (
                    <>
                        <AnswerOptions
                            options={enigma.answers.map(a => ({ id: a, text: a }))}
                            selectedAnswer={selectedAnswer}
                            onSelect={(answer) => dispatch({ type: 'SELECT_ANSWER', payload: answer })}
                            disabled={isSubmitting || isSuccess || !canAttempt}
                        />
                        <SubmitButton onClick={handleSubmit} disabled={!selectedAnswer || isSubmitting || !canAttempt} isSuccess={isSuccess} />
                    </>
                )}

            </EnigmaContent>
            {notification && <PhotoNotification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        </div>
    </div>
  );
};



export default EnigmaCard;
