import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MiniGameAlert from './MiniGameAlert';
import SharingGameCard from './SharingGameCard';
import MorseGameCard from './MorseGameCard';
import TentacleGameCard from './TentacleGameCard';
import './MiniGames.css';
import '../../styles/enigmaCard.css';

const MiniGameCard = ({ gameType, onComplete, onClose, player }) => {
  const [showAlert, setShowAlert] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Configuration des mini-jeux
  const gameConfig = {
    sharing: {
      title: "🤝 Mini-Jeu Partage",
      description: "Montrez votre esprit de partage !",
      component: SharingGameCard
    },
    morse: {
      title: "🔤 Mini-Jeu Morse",
      description: "Préparez-vous à décoder un message en morse !",
      component: MorseGameCard
    },
    tentacle: {
      title: "🐙 Mini-Jeu Tentacule",
      description: "Un défi mathématique vous attend !",
      component: TentacleGameCard
    }
  };

  const currentGame = gameConfig[gameType];

  // Gestion de la fermeture avec animation
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [isClosing, onClose]);

  // Gestion de la fin de l'alerte
  const handleAlertComplete = useCallback(() => {
    setShowAlert(false);
    setGameStarted(true);
  }, []);

  // Gestion de la completion du mini-jeu
  const handleGameComplete = useCallback((result) => {
    // Traitement du résultat selon le type de mini-jeu
    const processedResult = {
      gameType,
      success: result?.success || result > 0,
      score: typeof result === 'number' ? result : (result?.score || 0),
      timeBonus: result?.timeBonus || 0,
      message: result?.message || '',
      skipped: result?.skipped || false
    };

    // Appeler la fonction de completion avec le résultat traité
    onComplete(processedResult);
    
    // Fermer automatiquement après un délai
    setTimeout(() => {
      handleClose();
    }, 1000);
  }, [gameType, onComplete, handleClose]);

  // Gestion des touches d'échappement
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  // Vérification de la validité du type de jeu
  if (!currentGame) {
    console.error(`Type de mini-jeu non reconnu: ${gameType}`);
    return null;
  }

  // Fonction de rendu avec portail
  const renderContent = () => {
    // Affichage de l'alerte de démarrage
    if (showAlert) {
      return (
        <MiniGameAlert
          gameType={gameType}
          onComplete={handleAlertComplete}
        />
      );
    }

    // Affichage du mini-jeu
    if (gameStarted && !isClosing) {
      const GameComponent = currentGame.component;
      
      return (
        <GameComponent
          onComplete={handleGameComplete}
          onClose={handleClose}
          player={player}
          gameType={gameType}
        />
      );
    }

    // État de fermeture
    return null;
  };

  const content = renderContent();
  
  // Utiliser un portail pour rendre dans le body
  return content ? createPortal(content, document.body) : null;
};

export default MiniGameCard;