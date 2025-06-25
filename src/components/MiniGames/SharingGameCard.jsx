import React, { useState, useEffect } from "react";
import { savePhoto } from "../../utils/photoStorage";
import MiniGameOverlay from "./MiniGameOverlay";
import "./MiniGames.css";
import "../../styles/enigmaCard.css";

const SharingGameCard = ({ onComplete, onClose }) => {
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes pour accomplir le gage
  const [isClosing, setIsClosing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [validationStep, setValidationStep] = useState("instructions"); // instructions, photo, completed
  const [photoTaken, setPhotoTaken] = useState(false);

  const challenge = {
    title: "Esprit de Partage",
    question: "Que serait un bon mousse sans l'esprit de partage ?",
    mission: "Allez chercher une boisson pour chaque membre d'une équipe adverse et apportez-leur",
    validation: "Prenez une photo avec l'équipe adverse en train de boire",
    baseScore: 200,
    timeBonus: 1 // 1 point par seconde restante
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
      message: "⏰ Temps écoulé ! Le gage n'a pas été accompli à temps.",
      points: 0
    });
    setIsComplete(true);
    setTimeout(() => {
      onComplete({
        gameType: 'sharing',
        success: false,
        score: 0,
        timeBonus: 0,
        skipped: true,
        message: "Gage passé"
      });
    }, 4000);
  };

  const handleStartMission = () => {
    setValidationStep("photo");
    setFeedback({
      type: "info",
      message: "🚀 Mission lancée ! Allez accomplir votre gage et revenez prendre une photo de validation."
    });
  };

  const handleTakePhoto = async () => {
    try {
      // Demander confirmation avant de valider
      const confirmed = window.confirm(
        "Avez-vous vraiment accompli votre gage ?\n\n" +
        "✅ Vous avez apporté des boissons à une équipe adverse\n" +
        "✅ Vous êtes avec eux pour la photo\n" +
        "✅ Tout le monde sourit\n\n" +
        "Cliquez OK pour confirmer et valider votre gage."
      );
      
      if (!confirmed) {
        return; // L'utilisateur a annulé
      }

      // Essayer d'utiliser l'appareil photo si disponible
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } // Caméra arrière préférée
          });
          
          // Créer un élément vidéo temporaire pour la prévisualisation
          const video = document.createElement('video');
          video.srcObject = stream;
          video.autoplay = true;
          video.style.position = 'fixed';
          video.style.top = '50%';
          video.style.left = '50%';
          video.style.transform = 'translate(-50%, -50%)';
          video.style.zIndex = '10000';
          video.style.maxWidth = '90vw';
          video.style.maxHeight = '90vh';
          video.style.border = '3px solid #e53e3e';
          video.style.borderRadius = '10px';
          
          document.body.appendChild(video);
          
          // Ajouter un bouton pour prendre la photo
           const captureBtn = document.createElement('button');
           captureBtn.textContent = '📸 Prendre la photo';
           captureBtn.style.position = 'fixed';
           captureBtn.style.bottom = '20px';
           captureBtn.style.left = '30%';
           captureBtn.style.transform = 'translateX(-50%)';
           captureBtn.style.zIndex = '10001';
           captureBtn.style.padding = '15px 30px';
           captureBtn.style.fontSize = '18px';
           captureBtn.style.backgroundColor = '#e53e3e';
           captureBtn.style.color = 'white';
           captureBtn.style.border = 'none';
           captureBtn.style.borderRadius = '25px';
           captureBtn.style.cursor = 'pointer';
           
           // Ajouter un bouton d'annulation
           const cancelBtn = document.createElement('button');
           cancelBtn.textContent = '❌ Annuler';
           cancelBtn.style.position = 'fixed';
           cancelBtn.style.bottom = '20px';
           cancelBtn.style.left = '70%';
           cancelBtn.style.transform = 'translateX(-50%)';
           cancelBtn.style.zIndex = '10001';
           cancelBtn.style.padding = '15px 30px';
           cancelBtn.style.fontSize = '18px';
           cancelBtn.style.backgroundColor = '#6b7280';
           cancelBtn.style.color = 'white';
           cancelBtn.style.border = 'none';
           cancelBtn.style.borderRadius = '25px';
           cancelBtn.style.cursor = 'pointer';
           
           document.body.appendChild(captureBtn);
           document.body.appendChild(cancelBtn);
           
           // Fonction de nettoyage
           const cleanup = () => {
             stream.getTracks().forEach(track => track.stop());
             document.body.removeChild(video);
             document.body.removeChild(captureBtn);
             document.body.removeChild(cancelBtn);
           };
          
          // Gérer la prise de photo
          captureBtn.onclick = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            // Sauvegarder la photo avec le système standard
            const photoData = canvas.toDataURL('image/jpeg');
            const photoInfo = {
              enigmaId: 'sharing_game',
              enigmaTitle: 'Mini-Jeu Partage',
              timestamp: new Date().toISOString(),
              filename: `sharing_${Date.now()}.jpg`,
              dataUrl: photoData,
              context: 'minigame'
            };
            
            try {
              const savedPhoto = savePhoto(photoInfo);
              console.log('Photo sauvegardée:', savedPhoto?.id);
            } catch (error) {
              console.warn('Impossible de sauvegarder la photo:', error);
            }
            
            // Nettoyer
            cleanup();
            
            // Valider le gage
            validateChallenge();
          };
          
          // Gérer l'annulation
           cancelBtn.onclick = () => {
             cleanup();
             setValidationStep('instructions');
           };
          
          return; // Sortir de la fonction, la validation se fera dans le callback
          
        } catch (cameraError) {
          console.log('Appareil photo non disponible:', cameraError);
          // Continuer avec la validation simple
        }
      }
      
      // Fallback : validation simple si pas d'appareil photo
      validateChallenge();
      
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      // En cas d'erreur, proposer quand même la validation
      validateChallenge();
    }
  };
  
  const validateChallenge = () => {
    setPhotoTaken(true);
    setValidationStep("completed");
    
    const timeBonus = Math.floor(timeLeft * challenge.timeBonus);
    const totalScore = challenge.baseScore + timeBonus;
    setScore(totalScore);
    
    setFeedback({
      type: "success",
      message: "🎉 Excellent ! Vous avez accompli votre gage avec brio ! L'esprit de partage à l'état pur !",
      points: totalScore
    });
    
    setIsComplete(true);
    setTimeout(() => {
      onComplete({
        gameType: 'sharing',
        success: true,
        score: totalScore,
        timeBonus: timeBonus,
        skipped: false,
        message: "Gage accompli avec succès !"
      });
    }, 4000);
  };

  const handleSkip = () => {
    setFeedback({
      type: "skipped",
      message: "⏭️ Gage passé. Un vrai mousse n'abandonne jamais l'esprit de partage !",
      points: 0
    });
    setIsComplete(true);
    setTimeout(() => {
      onComplete({
        gameType: 'sharing',
        success: false,
        score: 0,
        timeBonus: 0,
        skipped: false,
        message: "Temps écoulé"
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <MiniGameOverlay onClose={handleClose} isClosing={isClosing}>
      <div
        className={`enigma-card sharing-game-card ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
          <div className="enigma-header">
            <button className="close-btn" onClick={handleClose}>
              ✕
            </button>
            <div className="enigma-title">
              <h2>🤝 Mini-Jeu : {challenge.title}</h2>
              <p className="enigma-subtitle">
                ⚓ <strong>Gage de mousse :</strong> Montrez votre esprit de partage et gagnez jusqu'à <strong>4000+ points bonus</strong> ! 🏆
              </p>
            </div>
          </div>

          <div className="sharing-game-content">
            <div className="sharing-timer">
              <div className="timer-display">
                ⏱️ Temps restant : <strong>{formatTime(timeLeft)}</strong>
              </div>
              <div className="timer-bar">
                <div 
                  className="timer-fill" 
                  style={{ width: `${(timeLeft / 600) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="sharing-challenge">
              <div className="challenge-quote">
                <h3>💭 "{challenge.question}"</h3>
              </div>
              
              <div className="mission-description">
                <h4>🎯 Votre mission :</h4>
                <p className="mission-text">{challenge.mission}</p>
              </div>

              <div className="validation-info">
                <h4>📸 Validation :</h4>
                <p className="validation-text">{challenge.validation}</p>
              </div>
            </div>

            {validationStep === "instructions" && (
              <div className="mission-instructions">
                <div className="instructions-box">
                  <h4>📋 Instructions :</h4>
                  <ol>
                    <li>🔍 Repérez une équipe adverse</li>
                    <li>🥤 Allez chercher des boissons (eau, soda, etc.)</li>
                    <li>🤝 Apportez-leur avec le sourire</li>
                    <li>📸 Prenez une photo de validation</li>
                  </ol>
                  <p className="encouragement">
                    💪 <strong>Courage, mousse !</strong> L'esprit de partage est la clé d'un bon équipage !
                  </p>
                </div>
              </div>
            )}

            {validationStep === "photo" && (
              <div className="photo-validation">
                <div className="photo-instructions">
                  <h4>📸 Validation par photo</h4>
                  <p>Avez-vous accompli votre mission ? Prenez une photo avec l'équipe adverse !</p>
                  <div className="photo-tips">
                    <p><strong>💡 Conseils pour la photo :</strong></p>
                    <ul>
                      <li>✅ Vous et l'équipe adverse visibles</li>
                      <li>🥤 Les boissons en évidence</li>
                      <li>😊 Tout le monde souriant</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {feedback && (
              <div className={`feedback ${feedback.type}`}>
                <p>{feedback.message}</p>
                {feedback.points > 0 && (
                  <p className="points-earned">+{feedback.points} points gagnés !</p>
                )}
              </div>
            )}

            {isComplete && (
              <div className="game-success">
                <h3>🎉 Gage terminé !</h3>
                <p>Mission : <strong>{challenge.mission}</strong></p>
                {score > 0 && (
                  <p className="points-earned">+{score} points gagnés !</p>
                )}
                {score === 0 && (
                  <p>Aucun point gagné cette fois</p>
                )}
              </div>
            )}
          </div>

          {!isComplete && (
            <div className="enigma-actions">
              {validationStep === "instructions" && (
                <button
                  className="submit-btn"
                  onClick={handleStartMission}
                >
                  🚀 Commencer la mission
                </button>
              )}
              
              {validationStep === "photo" && (
                <button
                  className="submit-btn photo-btn"
                  onClick={handleTakePhoto}
                >
                  📸 Prendre la photo de validation
                </button>
              )}
              
              <div className="skip-section">
                <button className="skip-btn" onClick={handleSkip}>
                  ⏭️ Passer ce gage
                </button>
                <p className="skip-warning">
                  ⚠️ Attention : Passer ce gage vous fera perdre jusqu'à <strong>4000+ points bonus</strong> !
                </p>
              </div>
            </div>
          )}
        </div>
    </MiniGameOverlay>
  );
};

export default SharingGameCard;