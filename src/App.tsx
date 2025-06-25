import React, { useState, useEffect } from "react";
import { getPlayerData, savePlayerData, getLeaderboard } from "./utils/storage";

// Composants
import WelcomePage from "./components/WelcomePage/WelcomePage";
import Header from "./components/Header/Header";
import WorldMap from "./components/WorldMap/WorldMap";
import QRScanner from "./components/QRScanner/QRScanner";
import EnigmaCard from "./components/EnigmaCard/EnigmaCard";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import VictoryPage from "./components/VictoryPage/VictoryPage";

// Styles
import "./styles/globals.css";

// Data
import { ENIGMAS } from "./data/enigmas";

function App() {
  // États principaux
  const [gameState, setGameState] = useState("welcome"); // 'welcome', 'playing', 'victory'
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showEnigma, setShowEnigma] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentEnigma, setCurrentEnigma] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showMandatoryQuiz, setShowMandatoryQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // Charger les données du joueur au démarrage
  useEffect(() => {
    const savedPlayer = getPlayerData();
    if (savedPlayer) {
      setCurrentPlayer(savedPlayer);
      // Vérifier si le joueur a terminé
      if (savedPlayer.completed.length === ENIGMAS.length) {
        setGameState("victory");
      } else {
        setGameState("playing");
      }
    }
    updateLeaderboard();
  }, []);

  // Mettre à jour le classement
  const updateLeaderboard = () => {
    const ranking = getLeaderboard();
    setLeaderboardData(ranking);
  };

  // Démarrer le jeu avec un nouveau joueur
  const startGame = (playerInfo) => {
    const newPlayer = {
      ...playerInfo,
      completed: [],
      currentFragment: 0,
      startTime: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
    };

    setCurrentPlayer(newPlayer);
    savePlayerData(newPlayer);
    setGameState("playing");
    updateLeaderboard();
  };

  // Scanner QR Code
  const handleQRScan = (scannedData) => {
    try {
      console.log("Données scannées:", scannedData);

      // Le QR code peut contenir soit l'ID de l'énigme, soit un objet JSON
      let searchValue;

      if (scannedData.startsWith("{")) {
        const qrData = JSON.parse(scannedData);
        searchValue = qrData.enigmaId || qrData.id || qrData.qrCode;
      } else {
        searchValue = scannedData.trim();
      }

      console.log("Valeur recherchée:", searchValue);

      // Recherche par ID d'énigme OU par code QR
      let enigma = ENIGMAS.find(
        (e) =>
          e.id === searchValue ||
          e.qrCode === searchValue ||
          e.id.toLowerCase() === searchValue.toLowerCase() ||
          e.qrCode.toLowerCase() === searchValue.toLowerCase()
      );

      // Si toujours pas trouvé, essayer une correspondance partielle
      if (!enigma) {
        enigma = ENIGMAS.find((e) => {
          const searchLower = searchValue.toLowerCase();
          return (
            e.id.toLowerCase().includes(searchLower) ||
            e.qrCode.toLowerCase().includes(searchLower) ||
            e.title.toLowerCase().includes(searchLower) ||
            searchLower.includes(e.id.toLowerCase())
          );
        });
      }

      if (!enigma) {
        // Afficher les codes QR et IDs disponibles pour aider au debug
        const availableCodes = ENIGMAS.map((e) => `${e.qrCode} (${e.id})`).join(
          "\n"
        );
        alert(
          `❌ Énigme non trouvée pour "${searchValue}"\n\nCodes QR disponibles:\n${availableCodes}`
        );
        return;
      }

      console.log("Énigme trouvée:", enigma);

      // Vérifier si déjà complétée

      if (currentPlayer.completed.includes(enigma.id)) {
        alert(
          `✅ Vous avez déjà trouvé ce fragment de carte !\n\n${enigma.title} - ${enigma.funFact}`
        );
        return;
      }

      // Afficher l'énigme
      setCurrentEnigma(enigma);
      setShowEnigma(true);
      setShowQRScanner(false);
    } catch (error) {
      console.error("Erreur lors du scan QR:", error);
      alert(`❌ Erreur lors de la lecture du QR Code: ${error.message}`);
    }
  };
  const solveEnigma = (enigmaId, playerAnswer) => {
    const enigma = ENIGMAS.find((e) => e.id === enigmaId);

    if (!enigma) {
      console.error("Énigme non trouvée:", enigmaId);
      return false;
    }

    // Vérification de sécurité
    if (!playerAnswer || typeof playerAnswer !== "string") {
      console.error("Réponse du joueur invalide:", playerAnswer);
      return false;
    }

    if (!enigma.correctAnswer || typeof enigma.correctAnswer !== "string") {
      console.error("Réponse correcte invalide:", enigma.correctAnswer);
      return false;
    }

    // Vérifier la réponse (insensible à la casse et aux accents)
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

    // Vérifier si la réponse est correcte
    const isCorrect = normalizedPlayerAnswer === normalizedCorrectAnswer;

    if (isCorrect) {
      // Mettre à jour le joueur
      const updatedPlayer = {
        ...currentPlayer,
        completed: [...currentPlayer.completed, enigmaId],
        currentFragment: currentPlayer.completed.length + 1,
        lastUpdate: new Date().toISOString(),
      };

      setCurrentPlayer(updatedPlayer);
      savePlayerData(updatedPlayer);
      updateLeaderboard();

      // Vérifier la victoire
      if (updatedPlayer.completed.length === ENIGMAS.length) {
        setGameState("victory");
      }

      // NE PAS fermer l'énigme ici - laisser le composant EnigmaCard gérer l'affichage
      // setShowEnigma(false);
      // setCurrentEnigma(null);

      return true;
    }

    return false;
  };

  // Fonction pour redémarrer le jeu
  const restartGame = () => {
    setCurrentPlayer(null);
    setCurrentEnigma(null);
    setShowEnigma(false);
    setShowQRScanner(false);
    setShowLeaderboard(false);
    setGameState("welcome");
    // Note: On ne supprime pas les données du localStorage pour garder l'historique
  };

  // Reset du localStorage
  const resetStorage = () => {
    if (window.confirm("⚠️ Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.")) {
      localStorage.removeItem('playerAchievements'); // Supprimer les succès
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
      alert("✅ Toutes les données ont été effacées.");
    }
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

  if (gameState === "victory") {
    return (
      <div className="app">
        <VictoryPage
          player={currentPlayer}
          onRestart={restartGame}
          onViewLeaderboard={() => setShowLeaderboard(true)}
          quizScore={quizScore}
          quizCompleted={quizCompleted}
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

  // État de jeu principal
  return (
    <div className="app">
      {/* Header avec informations du joueur */}
      <Header
        player={currentPlayer}
        onScanQR={() => setShowQRScanner(true)}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        onResetStorage={resetStorage}
        totalEnigmas={ENIGMAS.length}
      />

      {/* Carte du monde interactive */}
      {/* Carte du monde interactive */}
      <WorldMap
        completedEnigmas={currentPlayer?.completed || []}
        onLocationClick={(enigmaId) => {
          const enigma = ENIGMAS.find((e) => e.id === enigmaId);
          if (enigma && currentPlayer?.completed?.includes(enigmaId)) {
            alert(
              `✅ ${enigma.location} - Fragment déjà découvert !\n\n"${enigma.culturalFact}"`
            );
          } else {
            alert(
              "🔒 Scannez le QR Code correspondant pour débloquer cette destination !"
            );
          }
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
      {showEnigma && currentEnigma && (
        <EnigmaCard
          enigma={currentEnigma}
          onSolve={solveEnigma}
          onClose={() => {
            setShowEnigma(false);
            setCurrentEnigma(null);
          }}
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

      {/* Indicateur de connexion (optionnel) */}
      <NetworkStatus />
    </div>
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
