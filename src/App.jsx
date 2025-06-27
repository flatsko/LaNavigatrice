import React, { useState, useEffect } from "react";
import { getPlayerData, savePlayerData, getLeaderboard } from "./utils/storage";
import { calculateSuccessRate, isGameValid, GAME_RULES } from "./utils/scoring"; // CORRECTION: Ajouter GAME_RULES
import QRGenerator from "./components/QRGenerator/QRGenerator";
import QRVariations from "./components/QRGenerator/QRVariations";
import SharedPhotoGallery from "./components/SharedPhotoGallery/SharedPhotoGallery";
import PrintableGamePresentation from "./components/PrintableGamePresentation/PrintableGamePresentation";
// Composants
import WelcomePage from "./components/WelcomePage/WelcomePage";
import Header from "./components/Header/Header";
import WorldMap from "./components/WorldMap/WorldMap";
import QRScanner from "./components/QRScanner/QRScanner";
import EnigmaCard from "./components/EnigmaCard/EnigmaCard";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import VictoryPage from "./components/VictoryPage/VictoryPage";
import FailurePage from "./components/FailurePage/FailurePage"; // CORRECTION: Ajouter FailurePage

import AchievementSystem from "./components/AchievementSystem/AchievementSystem";
import {
  AchievementNotificationProvider,
  useAchievementNotifications,
} from "./components/AchievementSystem";
import TestNotifications from "./components/AchievementSystem/TestNotifications";
import ParticleEffect from "./components/ParticleEffect/ParticleEffect";
import TipsSystem from "./components/TipsSystem/TipsSystem";
import SoundManager from "./components/SoundManager/SoundManager";
import FlagQuiz from "./components/FlagQuiz/FlagQuiz";
import MiniGameCard from "./components/MiniGames/MiniGameCard";

// Styles - globals.css est importé via index.css

// Data
import { ENIGMAS } from "./data/enigmas"; // A MODIFIER EN PROD
import { ENIGMAS_ALSACE_CHARENTE } from "./data/enigmasAlsaceCharente";
import { getCurrentTheme, applyThemeVariables, THEMES } from "./data/themes";

// Utils

function App() {
  // Hook pour les achievements
  const { checkAchievements } = useAchievementNotifications();

  // États principaux
  const [gameState, setGameState] = useState("welcome");
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showEnigma, setShowEnigma] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentEnigma, setCurrentEnigma] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);

  // État pour le timing des énigmes
  const [enigmaStartTime, setEnigmaStartTime] = useState(null);

  // État pour le quiz obligatoire
  const [showMandatoryQuiz, setShowMandatoryQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Nouveaux états pour le système anti-triche
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureReason, setFailureReason] = useState("");

  // États pour les nouvelles fonctionnalités
  const [showAchievements, setShowAchievements] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particleType, setParticleType] = useState("success");
  const [showSharedGallery, setShowSharedGallery] = useState(false);
  const [showPrintablePresentation, setShowPrintablePresentation] =
    useState(false);

  // États pour le système de thèmes
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [currentEnigmas, setCurrentEnigmas] = useState(ENIGMAS);

  // État pour les photos partagées
  const [allPhotos, setAllPhotos] = useState([]);

  // États pour les mini-jeux
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMiniGameType, setCurrentMiniGameType] = useState(null);
  const [pendingMiniGame, setPendingMiniGame] = useState(null);
  const [minigameResults, setMinigameResults] = useState([]);
  const [pendingVictory, setPendingVictory] = useState(false);
  const [triggeredMinigames, setTriggeredMinigames] = useState([]);

  // Charger toutes les photos partagées
  useEffect(() => {
    loadAllSharedPhotos();
  }, []);

  // Fonction pour charger toutes les photos de tous les joueurs
  const loadAllSharedPhotos = () => {
    try {
      const allStoredPhotos = [];

      // Parcourir toutes les clés du localStorage pour trouver les photos
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("photos_")) {
          const playerName = key.replace("photos_", "");
          const playerPhotos = JSON.parse(localStorage.getItem(key) || "[]");

          // Ajouter le nom du joueur à chaque photo et un ID unique
          const photosWithPlayer = playerPhotos.map((photo, index) => ({
            ...photo,
            playerName,
            id: `${playerName}_${photo.enigmaId}_${photo.timestamp}`,
            uniqueIndex: `${playerName}_${index}`,
          }));

          allStoredPhotos.push(...photosWithPlayer);
        }
      }

      // Trier par timestamp (plus récent en premier)
      allStoredPhotos.sort((a, b) => b.timestamp - a.timestamp);
      setAllPhotos(allStoredPhotos);
    } catch (error) {
      console.error("Erreur lors du chargement des photos partagées:", error);
    }
  };

  // Fonction pour ajouter une photo à la galerie partagée
  const addPhotoToSharedGallery = (photo) => {
    const photoWithPlayer = {
      ...photo,
      playerName: currentPlayer?.name || "Anonyme",
      id: `${currentPlayer?.name || "anonyme"}_${photo.enigmaId}_${
        photo.timestamp
      }`,
      timestamp: photo.timestamp || Date.now(),
    };

    // Ajout à la galerie partagée (état local)
    setAllPhotos((prev) => [photoWithPlayer, ...prev]);

    // Sauvegarde dans le localStorage spécifique au joueur
    if (currentPlayer?.name) {
      const playerPhotosKey = `photos_${currentPlayer.name}`;
      const existingPhotos = JSON.parse(
        localStorage.getItem(playerPhotosKey) || "[]"
      );
      const updatedPhotos = [...existingPhotos, photoWithPlayer];
      localStorage.setItem(playerPhotosKey, JSON.stringify(updatedPhotos));

      // Vérifier les achievements après l'ajout d'une photo
      checkAchievements(currentPlayer, minigameResults);
    }

    // Note: Les mini-jeux sont maintenant déclenchés lors de la fermeture d'EnigmaCard
    // via la fonction triggerMinigameOnEnigmaClose()
  };

  // Fonction pour déclencher les mini-jeux lors de la fermeture d'EnigmaCard
  const triggerMinigameOnEnigmaClose = () => {
    // Vérifier si on peut déclencher un mini-jeu
    const availableMinigames = ["morse", "tentacle", "sharing"];
    const untriggeredMinigames = availableMinigames.filter(
      (game) => !triggeredMinigames.includes(game)
    );

    if (untriggeredMinigames.length === 0) {
      console.log("🎮 Tous les mini-jeux ont déjà été déclenchés");
      return false;
    }

    // Calculer les énigmes restantes et traitées (complétées + échouées)
    const completedEnigmas = (currentPlayer?.completed || []).length;
    const failedEnigmas = (currentPlayer?.failed || []).length;
    const processedEnigmas = completedEnigmas + failedEnigmas;
    const totalEnigmas = currentEnigmas.length;
    const remainingEnigmas = totalEnigmas - processedEnigmas;

    // Ne pas déclencher de mini-jeu sur la dernière énigme (réservée au quiz des drapeaux)
    if (remainingEnigmas <= 1) {
      console.log(
        "🎮 Dernière énigme atteinte, pas de mini-jeu (quiz des drapeaux prévu)"
      );
      return false;
    }

    const minigamesTriggered = triggeredMinigames.length;
    let shouldTriggerMinigame = false;

    // Logique de déclenchement garantissant que les 3 mini-jeux soient lancés avant la fin
    if (remainingEnigmas <= untriggeredMinigames.length + 1) {
      // Forcer le déclenchement si on risque de manquer des mini-jeux
      shouldTriggerMinigame = true;
      console.log(
        `🎮 Déclenchement forcé: ${
          untriggeredMinigames.length
        } mini-jeux restants pour ${
          remainingEnigmas - 1
        } énigmes disponibles (${processedEnigmas} énigmes traitées)`
      );
    } else {
      // Probabilité aléatoire normale (40% de chance)
      shouldTriggerMinigame = Math.random() < 0.4;
    }

    if (shouldTriggerMinigame && !showMiniGame) {
      const randomMinigame =
        untriggeredMinigames[
          Math.floor(Math.random() * untriggeredMinigames.length)
        ];
      console.log(
        `🎮 Déclenchement du mini-jeu: ${randomMinigame} (${
          remainingEnigmas - 1
        } énigmes restantes, ${processedEnigmas} traitées)`
      );

      // Marquer le mini-jeu comme déclenché
      setTriggeredMinigames((prev) => [...prev, randomMinigame]);

      // Démarrer le mini-jeu avec un délai pour permettre la fermeture de l'énigme
      setTimeout(() => {
        startMiniGame(randomMinigame);
      }, 500);

      return true;
    }

    return false;
  };

  // Fonction pour gérer la completion du quiz obligatoire
  const MIN_QUIZ_SUCCESS_RATE = 80; // 80%

  const handleQuizCompletion = (score, totalQuestions) => {
    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= MIN_QUIZ_SUCCESS_RATE;

    console.log(
      `Quiz terminé: ${score}/${totalQuestions} (${percentage.toFixed(1)}%)`
    );

    // Sauvegarder le résultat du quiz
    const quizData = {
      score,
      totalQuestions,
      percentage,
      passed,
      timestamp: new Date().toISOString(),
      playerName: currentPlayer?.name,
    };

    localStorage.setItem(
      `quiz_${currentPlayer?.name}`,
      JSON.stringify(quizData)
    );

    setQuizScore(percentage);
    setShowMandatoryQuiz(false);

    if (passed) {
      console.log("✅ Quiz réussi! Accès à la victoire");
      setQuizCompleted(true);
      setGameState("victory");
      // La vérification des achievements est maintenant gérée par le Provider
    } else {
      console.log("❌ Quiz échoué, score insuffisant");
      // Rester en mode jeu, le joueur peut réessayer
      alert(
        `Quiz échoué! Vous avez obtenu ${percentage.toFixed(
          1
        )}% mais il faut au minimum 80% pour valider l'aventure. Vous pouvez réessayer.`
      );
    }
  };

  // Fonction pour fermer le quiz sans le compléter
  const handleQuizClose = () => {
    // Vérifier si une énigme doit être marquée comme échouée
    if (currentEnigma && currentPlayer) {
      const enigmaAttempts = currentPlayer?.enigmaAttempts || {};
      const currentAttempts = enigmaAttempts[currentEnigma.id] || 0;
      const completed = currentPlayer?.completed || [];
      const failed = currentPlayer?.failed || [];

      // Si toutes les tentatives sont épuisées et l'énigme n'est ni complétée ni échouée
      if (
        currentAttempts >= GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA &&
        !completed.includes(currentEnigma.id) &&
        !failed.includes(currentEnigma.id)
      ) {
        const updatedPlayer = {
          ...currentPlayer,
          failed: [...failed, currentEnigma.id],
          lastUpdate: new Date().toISOString(),
        };

        console.log(
          "🔒 Énigme marquée comme échouée lors de la fermeture du quiz:",
          currentEnigma.id
        );
        setCurrentPlayer(updatedPlayer);
        savePlayerData(updatedPlayer);
        updateLeaderboard();
      }
    }

    setShowMandatoryQuiz(false);
    // Le joueur reste en mode jeu et peut relancer le quiz plus tard
  };
  // Fonction pour redémarrer le jeu
  const restartGame = () => {
    // Nettoyer les données du quiz avant de réinitialiser le joueur
    if (currentPlayer?.name) {
      localStorage.removeItem(`quiz_${currentPlayer.name}`);
    }

    setCurrentPlayer(null);
    setCurrentEnigma(null);
    setShowEnigma(false);
    setShowQRScanner(false);
    setShowLeaderboard(false);
    setShowAchievements(false);
    setShowParticles(false);
    setGameState("welcome");
    // Réinitialiser les mini-jeux
    setTriggeredMinigames([]);
    setMinigameResults([]);
    setShowMiniGame(false);
    setCurrentMiniGameType(null);
    setPendingVictory(false);
    // Réinitialiser les données du quiz
    setQuizScore(0);
    setQuizCompleted(false);
    setShowMandatoryQuiz(false);
    // Note: On ne supprime pas les données du localStorage pour garder l'historique
  };

  // Ajoutons une fonction pour vraiment nettoyer les données
  const clearAllData = () => {
    localStorage.clear();
    setCurrentPlayer(null);
    setCurrentEnigma(null);
    setShowEnigma(false);
    setShowQRScanner(false);
    setShowLeaderboard(false);
    setGameState("welcome");
    updateLeaderboard();
    setFailureReason("");
    // Réinitialiser les mini-jeux
    setTriggeredMinigames([]);
    setMinigameResults([]);
    setShowMiniGame(false);
    setCurrentMiniGameType(null);
    setPendingMiniGame(null);
    setPendingVictory(false);
  };

  // Fonction de debug pour voir les données
  const debugPlayerData = () => {
    const savedPlayer = getPlayerData();
    console.log("Données joueur actuelles:", savedPlayer);
    console.log("localStorage keys:", Object.keys(localStorage));
    console.log("currentPlayer state:", currentPlayer);
    alert(
      `Joueur: ${savedPlayer?.name || "Aucun"}\nComplétées: ${
        savedPlayer?.completed?.join(", ") || "Aucune"
      }`
    );
  };

  // Fonction pour gérer le changement de thème
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);

    // Changer les énigmes selon le thème
    if (newTheme.id === "dune_page_a_lautre") {
      setCurrentEnigmas(ENIGMAS_ALSACE_CHARENTE);
    } else {
      setCurrentEnigmas(ENIGMAS);
    }

    // Redémarrer le jeu pour appliquer le nouveau thème
    restartGame();
  };

  // Charger les données du joueur au démarrage
  useEffect(() => {
    // Appliquer le thème au chargement
    applyThemeVariables(currentTheme);

    // Définir les énigmas selon le thème
    if (currentTheme.id === "dune_page_a_lautre") {
      setCurrentEnigmas(ENIGMAS_ALSACE_CHARENTE);
    } else {
      setCurrentEnigmas(ENIGMAS);
    }

    const savedPlayer = getPlayerData();

    if (savedPlayer) {
      console.log("Données joueur chargées:", savedPlayer);

      // Migration des données si nécessaire (pour compatibilité avec anciennes versions)
      const migratedPlayer = {
        ...savedPlayer,
        completed: savedPlayer.completed || [],
        failed: savedPlayer.failed || [], // S'assurer que failed existe
        totalAttempts: savedPlayer.totalAttempts || 0,
        wrongAnswers: savedPlayer.wrongAnswers || 0,
        enigmaAttempts: savedPlayer.enigmaAttempts || {},
        attemptHistory: savedPlayer.attemptHistory || [],
      };

      setCurrentPlayer(migratedPlayer);

      // Charger les résultats des mini-jeux sauvegardés
      try {
        const savedMinigameResults = localStorage.getItem(
          `minigameResults_${migratedPlayer.name}`
        );
        if (savedMinigameResults) {
          const parsedResults = JSON.parse(savedMinigameResults);
          setMinigameResults(parsedResults);
          console.log("Résultats mini-jeux chargés:", parsedResults);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des résultats mini-jeux:",
          error
        );
      }

      // Calculer l'état du jeu basé sur la progression
      const completed = migratedPlayer.completed || [];
      const failed = migratedPlayer.failed || [];
      const totalProcessed = completed.length + failed.length;

      // Déterminer l'état du jeu
      const enigmasToUse =
        currentTheme.id === "dune_page_a_lautre"
          ? ENIGMAS_ALSACE_CHARENTE
          : ENIGMAS;

      console.log("État du jeu:", {
        completed: completed.length,
        failed: failed.length,
        totalProcessed,
        totalEnigmas: enigmasToUse.length,
        theme: currentTheme.id,
      });

      if (totalProcessed === enigmasToUse.length) {
        // Toutes les énigmes ont été traitées
        console.log(
          "🏁 Toutes les énigmes traitées, vérification des conditions..."
        );

        const validation = isGameValid(migratedPlayer, enigmasToUse.length);
        console.log("Validation:", validation);

        if (validation.isValid) {
          console.log(
            "🎉 Conditions de base remplies, lancement du quiz obligatoire"
          );
          // Vérifier si le quiz a déjà été complété avec succès
          const quizData = localStorage.getItem(`quiz_${migratedPlayer.name}`);
          if (quizData) {
            const parsedQuizData = JSON.parse(quizData);
            if (parsedQuizData.passed) {
              console.log("✅ Quiz déjà réussi, accès à la victoire");
              setQuizCompleted(true);
              setQuizScore(parsedQuizData.score);
              setGameState("victory");
            } else {
              console.log("🔄 Quiz à refaire (score insuffisant)");
              setShowMandatoryQuiz(true);
              setGameState("playing");
            }
          } else {
            console.log("📝 Premier passage du quiz obligatoire");
            setShowMandatoryQuiz(true);
            setGameState("playing");
          }
        } else {
          console.log("❌ Conditions de victoire non remplies");
          setFailureReason(validation.reason);
          setGameState("failure");
        }
      } else if (savedPlayer) {
        // Jeu en cours
        console.log("🎮 Jeu en cours");
        setGameState("playing");
      } else {
        // Aucune énigme tentée, retour à l'accueil
        console.log("🏠 Aucune progression, retour à l'accueil");
        setGameState("welcome");
      }

      // Sauvegarder les données migrées si nécessaire
      if (JSON.stringify(savedPlayer) !== JSON.stringify(migratedPlayer)) {
        console.log("Migration des données effectuée");
        savePlayerData(migratedPlayer);
      }
    } else {
      console.log("Aucune donnée joueur trouvée");
      setGameState("welcome");
    }

    updateLeaderboard();
  }, []);

  // Mettre à jour le classement
  const updateLeaderboard = () => {
    const ranking = getLeaderboard();
    setLeaderboardData(ranking);
  };

  // Démarrer le jeu avec un nouveau joueur
  // Démarrer le jeu avec un nouveau joueur
  const startGame = (playerInfo) => {
    const newPlayer = {
      ...playerInfo,
      completed: [],
      failed: [],
      currentFragment: 0,
      startTime: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      // CORRECTION: Initialiser tous les champs nécessaires
      totalAttempts: 0,
      wrongAnswers: 0,
      enigmaAttempts: {}, // Objet vide mais défini
      attemptHistory: [], // Tableau vide mais défini
    };

    console.log("Nouveau joueur créé:", newPlayer);

    setCurrentPlayer(newPlayer);
    savePlayerData(newPlayer);
    setGameState("playing");
    updateLeaderboard();
  };

  // Reset du localStorage
  const resetStorage = () => {
    if (
      window.confirm(
        "⚠️ Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible."
      )
    ) {
      localStorage.clear();
      setCurrentPlayer(null);
      setGameState("welcome");
      setShowQRScanner(false);
      setShowEnigma(false);
      setShowLeaderboard(false);
      setShowMandatoryQuiz(false);
      setQuizCompleted(false);
      setQuizScore(null);
      setLeaderboardData([]);
      // Réinitialiser les mini-jeux
      setMinigameResults([]);
      setTriggeredMinigames([]);
      setShowMiniGame(false);
      setCurrentMiniGameType(null);
      setPendingMiniGame(null);
      setPendingVictory(false);

      alert("✅ Toutes les données ont été effacées.");
    }
  };

  // Scanner QR Code
  // Scanner QR Code
  const handleQRScan = (scannedData) => {
    // ALERTE DE DEBUG

    try {
      if (!scannedData || typeof scannedData !== "string") {
        alert("❌ Données QR invalides");
        return;
      }

      let searchValue = scannedData.trim();

      // Recherche par qrCode d'abord, puis par id en fallback
      let enigma = currentEnigmas.find(
        (e) => e.qrCode.toLowerCase() === searchValue.toLowerCase()
      );

      // Fallback: recherche par id si pas trouvé par qrCode
      if (!enigma) {
        enigma = currentEnigmas.find(
          (e) => e.id.toLowerCase() === searchValue.toLowerCase()
        );
      }

      if (!enigma) {
        // Afficher les codes QR et IDs disponibles pour aider au debug
        const availableCodes = currentEnigmas
          .map((e) => `${e.qrCode} (${e.id})`)
          .join("\n");
        alert(`❌ Énigme non trouvée pour "${searchValue}"`);
        return;
      }

      // Vérifier si déjà complétée
      const completedEnigmas = currentPlayer?.completed || [];

      if (completedEnigmas.includes(enigma.id)) {
        alert(`✅ Fragment déjà trouvé: ${enigma.title}`);
        return;
      }

      // Afficher l'énigme et démarrer le chrono
      setCurrentEnigma(enigma);
      setEnigmaStartTime(Date.now());
      setShowEnigma(true);
      setShowQRScanner(false);
    } catch (error) {
      alert(`❌ Erreur: ${error.message}`);
    }
  };

  // Fonction améliorée pour résoudre une énigme
  // Dans votre fonction solveEnigma, ajoutez une vérification pour éviter les mises à jour multiples

  const solveEnigma = (enigmaId, playerAnswer) => {
    const enigma = currentEnigmas.find((e) => e.id === enigmaId);
    if (!enigma) {
      console.error("Énigme non trouvée:", enigmaId);
      return false;
    }

    // AJOUT: Vérifier si l'énigme est déjà complétée
    const completed = currentPlayer?.completed || [];
    if (completed.includes(enigmaId)) {
      console.log("⚠️ Énigme déjà complétée:", enigmaId);
      return true; // Retourner true pour éviter les erreurs
    }

    // Vérifier et initialiser enigmaAttempts si nécessaire
    const enigmaAttempts = currentPlayer?.enigmaAttempts || {};
    const currentAttempts = enigmaAttempts[enigmaId] || 0;

    if (currentAttempts >= GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA) {
      alert(
        `❌ Nombre maximum de tentatives atteint pour cette énigme (${GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA})`
      );
      return false;
    }

    // Normaliser les réponses
    const normalizeString = (str) => {
      if (!str || typeof str !== "string") return "";
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "")
        .trim();
    };

    const normalizedPlayerAnswer = normalizeString(playerAnswer);
    const normalizedCorrectAnswer = normalizeString(enigma.correctAnswer);
    const isCorrect = normalizedPlayerAnswer === normalizedCorrectAnswer;

    // Calculer les nouvelles valeurs
    const currentTotalAttempts = currentPlayer?.totalAttempts || 0;
    const currentWrongAnswers = currentPlayer?.wrongAnswers || 0;

    const newTotalAttempts = currentTotalAttempts + 1;
    const newWrongAnswers = isCorrect
      ? currentWrongAnswers
      : currentWrongAnswers + 1;
    const newAttemptCount = currentAttempts + 1;

    // Créer l'entrée d'historique
    const attemptEntry = {
      enigmaId,
      playerAnswer,
      correctAnswer: enigma.correctAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
      attemptNumber: newAttemptCount,
    };

    // Mettre à jour le joueur
    const updatedPlayer = {
      ...currentPlayer,
      totalAttempts: newTotalAttempts,
      wrongAnswers: newWrongAnswers,
      enigmaAttempts: {
        ...(currentPlayer?.enigmaAttempts || {}),
        [enigmaId]: newAttemptCount,
      },
      attemptHistory: [...(currentPlayer?.attemptHistory || []), attemptEntry],
      lastUpdate: new Date().toISOString(),
    };

    const failed = currentPlayer?.failed || [];

    if (isCorrect) {
      // Enregistrer le temps de résolution si disponible
      if (enigmaStartTime && currentPlayer?.name) {
        const endTime = Date.now();
        const duration = (endTime - enigmaStartTime) / 1000; // en secondes
        const solveTimesKey = `enigmaSolveTimes_${currentPlayer.name}`;
        const solveTimes = JSON.parse(
          localStorage.getItem(solveTimesKey) || "{}"
        );
        solveTimes[enigmaId] = duration;
        localStorage.setItem(solveTimesKey, JSON.stringify(solveTimes));
        setEnigmaStartTime(null);
        console.log(`⏱️ Temps de résolution pour ${enigmaId}: ${duration}s`);
      }

      // Bonne réponse : ajouter à completed si pas déjà présent
      if (!completed.includes(enigmaId)) {
        updatedPlayer.completed = [...completed, enigmaId];
        updatedPlayer.currentFragment = updatedPlayer.completed.length;
      }

      console.log("✅ Énigme résolue:", enigmaId);

      // Déclencher les effets de succès
      setParticleType("success");
      setShowParticles(true);
    } else {
      // Mauvaise réponse
      console.log(
        "❌ Mauvaise réponse pour:",
        enigmaId,
        "Tentative:",
        newAttemptCount
      );

      // Si c'était la dernière tentative, marquer comme échouée
      if (newAttemptCount >= GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA) {
        if (!failed.includes(enigmaId) && !completed.includes(enigmaId)) {
          updatedPlayer.failed = [...failed, enigmaId];
          console.log("🔒 Énigme verrouillée après échec:", enigmaId);
        }
      }
    }

    // Calculer le total des énigmes "traitées" (réussies + échouées)
    const totalCompleted = (updatedPlayer.completed || []).length;
    const totalFailed = (updatedPlayer.failed || []).length;
    const totalProcessed = totalCompleted + totalFailed;

    console.log("État des énigmes:", {
      completed: totalCompleted,
      failed: totalFailed,
      totalProcessed,
      totalEnigmas: ENIGMAS.length,
    });

    // MODIFICATION: Ne pas passer en victoire/échec immédiatement si c'est la dernière énigme avec photo
    const isLastEnigma = totalProcessed === ENIGMAS.length;
    const lastEnigmaHasPhoto = enigma.hasPhoto;

    if (isLastEnigma) {
      console.log(
        "🏁 Dernière énigme traitée !",
        isCorrect ? "✅ Réussie" : "❌ Échouée"
      );

      if (lastEnigmaHasPhoto) {
        console.log(
          "📸 Dernière énigme avec photo - attendre la photo avant fin de jeu"
        );
        // Ne pas changer gameState maintenant, on le fera après la photo
        updatedPlayer.pendingVictory = true; // Flag pour indiquer fin de jeu en attente
      } else {
        console.log("🎉 Fin de jeu immédiate - pas de photo");
        const validation = isGameValid(updatedPlayer, currentEnigmas.length);
        if (validation.isValid) {
          // Vérifier si le quiz obligatoire doit être fait
          if (!quizCompleted) {
            console.log("Quiz obligatoire requis avant la victoire");
            setShowMandatoryQuiz(true);
            return isCorrect;
          }
          setGameState("victory");
        } else {
          setFailureReason(validation.reason);
          setGameState("failure");
        }
      }
    } else if (totalProcessed === currentEnigmas.length) {
      // Cas normal (pas la dernière énigme)
      const validation = isGameValid(updatedPlayer);
      if (validation.isValid) {
        // Vérifier si le quiz obligatoire doit être fait
        if (!quizCompleted) {
          console.log("Quiz obligatoire requis avant la victoire");
          setShowMandatoryQuiz(true);
          return isCorrect;
        }
        setGameState("victory");
      } else {
        setFailureReason(validation.reason);
        setGameState("failure");
      }
    }

    // Les mini-jeux sont maintenant déclenchés après la prise de photo
    // via la fonction triggerMinigameAfterPhoto()

    // Sauvegarder et mettre à jour
    setCurrentPlayer(updatedPlayer);
    savePlayerData(updatedPlayer);
    updateLeaderboard();

    return isCorrect;
  };

  // Fonction pour gérer la fin de l'animation d'alerte
  // Fonction unifiée pour démarrer un mini-jeu
  const startMiniGame = (gameType) => {
    setCurrentMiniGameType(gameType);
    setShowMiniGame(true);
    setPendingMiniGame(null);
  };

  const handleMiniGameComplete = (result) => {
    console.log("Résultat du mini-jeu reçu:", result);

    setMinigameResults((prevResults) => {
      // Vérifier si un résultat pour ce type de jeu existe déjà
      const existingResultIndex = prevResults.findIndex(
        (r) => r.gameType === result.gameType
      );

      let newResults;
      if (existingResultIndex !== -1) {
        // Remplacer le résultat existant
        newResults = [...prevResults];
        newResults[existingResultIndex] = result;
        console.log(`Résultat pour ${result.gameType} mis à jour.`);
      } else {
        // Ajouter le nouveau résultat
        newResults = [...prevResults, result];
        console.log(`Nouveau résultat pour ${result.gameType} ajouté.`);
      }

      // Sauvegarder dans le localStorage
      if (currentPlayer) {
        localStorage.setItem(
          `minigameResults_${currentPlayer.name}`,
          JSON.stringify(newResults)
        );
      }
      return newResults;
    });

    setShowMiniGame(false);
    setCurrentMiniGameType(null);

    // Si une victoire était en attente, on la déclenche maintenant
    if (pendingVictory) {
      console.log("Déclenchement de la victoire après le mini-jeu.");
      setGameState("victory");
      setPendingVictory(false);
    }
  };

  // Fonction unifiée de fermeture des mini-jeux
  const handleMiniGameClose = () => {
    setShowMiniGame(false);
    setCurrentMiniGameType(null);
  };

  // Gestion des erreurs globales
  useEffect(() => {
    const handleError = (event) => {
      console.error("Erreur globale:", event.error);
      console.error("Stack trace:", event.error.stack);
      console.error("Fichier:", event.filename);
      console.error("Ligne:", event.lineno);

      // Afficher une alerte pour déboguer
      alert(
        `Erreur détectée: ${event.error.message}\nVoir la console pour plus de détails`
      );
    };

    const handleUnhandledRejection = (event) => {
      console.error("Promise rejetée:", event.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);
  // Gestion de la navigation mobile (retour)
  useEffect(() => {
    const handlePopState = () => {
      if (showEnigma) {
        setShowEnigma(false);
        setCurrentEnigma(null);
      } else if (showQRScanner) {
        setShowQRScanner(false);
      } else if (showLeaderboard) {
        setShowLeaderboard(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showEnigma, showQRScanner, showLeaderboard]);

  // Rendu conditionnel selon l'état du jeu

  if (gameState === "welcome") {
    return (
      <div className="app">
        <WelcomePage onStartGame={startGame} />
      </div>
    );
  }
  if (gameState === "failure") {
    return (
      <div className="app">
        <FailurePage
          player={currentPlayer}
          reason={failureReason}
          onRestart={clearAllData}
          onViewStats={() => setShowLeaderboard(true)}
          onPhotoShared={addPhotoToSharedGallery}
          minigameResults={minigameResults}
        />

        {showLeaderboard && (
          <Leaderboard
            players={leaderboardData}
            currentPlayer={currentPlayer}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </div>
    );
  }
  if (gameState === "victory") {
    return (
      <div className="app">
        <VictoryPage
          player={currentPlayer}
          onRestart={clearAllData}
          onViewLeaderboard={() => setShowLeaderboard(true)}
          quizScore={quizScore}
          quizCompleted={quizCompleted}
          minigameResults={minigameResults}
        />

        {showLeaderboard && (
          <Leaderboard
            players={leaderboardData}
            currentPlayer={currentPlayer}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </div>
    );
  }
  // Nouvelle fonction pour déclencher la fin de jeu après photo
  const triggerVictoryAfterPhoto = () => {
    console.log("🎉 Déclenchement fin de jeu après photo");

    const validation = isGameValid(currentPlayer, currentEnigmas.length);
    if (validation.isValid) {
      // Vérifier si le quiz obligatoire doit être fait
      if (!quizCompleted) {
        console.log("Quiz obligatoire requis avant la victoire");
        setShowMandatoryQuiz(true);
        return;
      }
      setGameState("victory");
    } else {
      setFailureReason(validation.reason);
      setGameState("failure");
    }

    // Nettoyer le flag
    const updatedPlayer = { ...currentPlayer };
    delete updatedPlayer.pendingVictory;
    setCurrentPlayer(updatedPlayer);
    savePlayerData(updatedPlayer);
  };
  // État de jeu principal
  return (
    <AchievementNotificationProvider
      player={currentPlayer}
      minigameResults={minigameResults}
    >
      <div className="app">
        {/* Header avec informations du joueur */}
        <Header
          player={currentPlayer}
          onScanQR={() => setShowQRScanner(true)}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowAchievements={() => setShowAchievements(true)}
          onShowSharedGallery={() => setShowSharedGallery(true)}
          onShowPrintablePresentation={() => {
            console.log("Fonction onShowPrintablePresentation appelée!");
            setShowPrintablePresentation(true);
            console.log("showPrintablePresentation défini à true");
          }}
          onShowMandatoryQuiz={() => setShowMandatoryQuiz(true)}
          onResetStorage={resetStorage}
          showQuizButton={
            currentPlayer &&
            (currentPlayer.completed?.length || 0) +
              (currentPlayer.failed?.length || 0) ===
              currentEnigmas.length &&
            !quizCompleted
          }
          totalEnigmas={currentEnigmas.length}
        />
        {/* {<QRVariations></QRVariations>} */}

        {/* Carte du monde interactive */}
        <WorldMap
          completedEnigmas={currentPlayer?.completed || []}
          failedEnigmas={currentPlayer?.failed || []}
          enigmas={currentEnigmas}
          onResetStorage={resetStorage}
          onLocationClick={(enigmaId) => {
            const enigma = currentEnigmas.find((e) => e.id === enigmaId);
            const completed = currentPlayer?.completed || [];
            const failed = currentPlayer?.failed || [];
          }}
        />
        {/* Scanner QR */}
        {showQRScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowQRScanner(false)}
          />
        )}
        {/* Carte d'énigme */}
        {/* Carte d'énigme */}
        {showEnigma && currentEnigma && (
          <EnigmaCard
            enigma={currentEnigma}
            player={currentPlayer} // CORRECTION: Passer le player
            onSolve={solveEnigma}
            onClose={() => {
              // Vérifier si l'énigme doit être marquée comme échouée avant de fermer
              if (currentEnigma && currentPlayer) {
                const enigmaAttempts = currentPlayer?.enigmaAttempts || {};
                const currentAttempts = enigmaAttempts[currentEnigma.id] || 0;
                const completed = currentPlayer?.completed || [];
                const failed = currentPlayer?.failed || [];

                // Si toutes les tentatives sont épuisées et l'énigme n'est ni complétée ni échouée
                if (
                  currentAttempts >= GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA &&
                  !completed.includes(currentEnigma.id) &&
                  !failed.includes(currentEnigma.id)
                ) {
                  const updatedPlayer = {
                    ...currentPlayer,
                    failed: [...failed, currentEnigma.id],
                    lastUpdate: new Date().toISOString(),
                  };

                  console.log(
                    "🔒 Énigme marquée comme échouée lors de la fermeture:",
                    currentEnigma.id
                  );
                  setCurrentPlayer(updatedPlayer);
                  savePlayerData(updatedPlayer);
                  updateLeaderboard();
                }
              }

              setShowEnigma(false);
              setCurrentEnigma(null);
              setEnigmaStartTime(null); // Reset timer when closing enigma
            }}
            onTriggerVictory={triggerVictoryAfterPhoto} // NOUVEAU
            onPhotoShared={addPhotoToSharedGallery}
            onTriggerMinigame={triggerMinigameOnEnigmaClose}
          />
        )}

        {/* Classement */}
        {showLeaderboard && (
          <Leaderboard
            players={leaderboardData}
            currentPlayer={currentPlayer}
            onClose={() => setShowLeaderboard(false)}
          />
        )}

        {/* Système d'achievements */}
        {showAchievements && (
          <AchievementSystem
            player={currentPlayer}
            onClose={() => setShowAchievements(false)}
          />
        )}

        {/* Galerie photo partagée */}
        {showSharedGallery && (
          <SharedPhotoGallery
            photos={allPhotos}
            currentPlayer={currentPlayer}
            onClose={() => setShowSharedGallery(false)}
          />
        )}

        {/* Page d'impression de présentation */}
        {showPrintablePresentation && (
          <PrintableGamePresentation
            onClose={() => {
              console.log("Fermeture de PrintableGamePresentation");
              setShowPrintablePresentation(false);
            }}
          />
        )}

        {/* Quiz obligatoire */}
        {showMandatoryQuiz && (
          <FlagQuiz
            enigmas={currentEnigmas}
            onComplete={handleQuizCompletion}
            onClose={handleQuizClose}
            isMandatory={true}
            requiredScore={80}
          />
        )}
        {console.log(
          "showPrintablePresentation état:",
          showPrintablePresentation
        )}

        {/* Mini-jeu unifié */}
        {showMiniGame && currentMiniGameType && (
          <MiniGameCard
            gameType={currentMiniGameType}
            onComplete={handleMiniGameComplete}
            onClose={handleMiniGameClose}
            player={currentPlayer}
          />
        )}

        {/* Effets de particules */}
        {showParticles && (
          <ParticleEffect
            type={particleType}
            duration={3000}
            onComplete={() => setShowParticles(false)}
          />
        )}

        {/* <TipsSystem
        player={currentPlayer}
        gameState={gameState}
        onClose={() => {}}
      /> */}

        {/* Gestionnaire de sons */}
        <SoundManager
          gameState={gameState}
          onSuccess={showParticles && particleType === "success"}
          onError={showParticles && particleType === "error"}
          onScan={showQRScanner}
        />
        <button className="reset-btn" onClick={resetStorage}>
          🗑️ Supprimer la partie
        </button>
        {/* Indicateur de connexion (optionnel) */}
        <NetworkStatus />

        {/* Composant de test pour les notifications d'achievements */}
        {/* <TestNotifications /> */}
      </div>
    </AchievementNotificationProvider>
  );
}

// Composant simple pour indiquer l'état de la connexion
const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="network-status offline">
      📱 Mode hors ligne - Vos données seront synchronisées à la reconnexion
    </div>
  );
};

export default App;
