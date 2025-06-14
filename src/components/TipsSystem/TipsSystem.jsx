import React, { useState, useEffect } from "react";
import "./TipsSystem.css";

const TIPS = [
  {
    id: "welcome",
    title: "Bienvenue à bord, Matelot !",
    content:
      "Scannez les QR codes pour découvrir les destinations du Capitaine Alison. Chaque énigme révèle un fragment de carte au trésor !",
    icon: "🏴‍☠️",
    trigger: "gameStart",
  },
  {
    id: "first_scan",
    title: "Scanner comme un Pro",
    content:
      "Tenez votre téléphone stable et assurez-vous que le QR code est bien éclairé. La caméra se focalisera automatiquement !",
    icon: "📱",
    trigger: "firstScan",
  },
  {
    id: "photo_tip",
    title: "Souvenirs de Voyage",
    content:
      "Prenez des photos créatives ! Elles seront sauvegardées dans votre galerie de voyage. Pensez aux selfies de groupe !",
    icon: "📸",
    trigger: "photoPrompt",
  },
  {
    id: "strategy",
    title: "Stratégie de Navigation",
    content:
      "Vous avez 3 tentatives par énigme. Réfléchissez bien avant de répondre pour maintenir un bon taux de réussite !",
    icon: "🧠",
    trigger: "wrongAnswer",
  },
  {
    id: "teamwork",
    title: "Travail d'Équipage",
    content:
      "Collaborez avec vos compagnons ! Plusieurs têtes valent mieux qu'une pour résoudre les énigmes du Capitaine.",
    icon: "👥",
    trigger: "multipleWrong",
  },
  {
    id: "exploration",
    title: "Esprit d'Exploration",
    content:
      "Chaque destination a son histoire unique. Prenez le temps de lire les anecdotes culturelles !",
    icon: "🗺️",
    trigger: "success",
  },
  {
    id: "final_push",
    title: "Dernière Ligne Droite",
    content:
      "Plus que quelques fragments à collecter ! Le trésor du Capitaine Alison vous attend au bout de cette aventure !",
    icon: "🏆",
    trigger: "nearEnd",
  },
];

const TipsSystem = ({ player, gameState, onClose }) => {
  const [currentTip, setCurrentTip] = useState(null);
  const [shownTips, setShownTips] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Charger les conseils déjà montrés
    const saved = JSON.parse(localStorage.getItem("shownTips") || "[]");
    setShownTips(saved);
  }, []);

  useEffect(() => {
    checkForTips();
  }, [player, gameState]);

  const checkForTips = () => {
    if (!player) return;

    const completed = player.completed?.length || 0;
    const totalAttempts = player.totalAttempts || 0;
    const wrongAnswers = player.wrongAnswers || 0;

    // Logique pour déclencher les conseils
    let tipToShow = null;

    // Conseil de bienvenue
    if (
      gameState === "playing" &&
      completed === 0 &&
      !shownTips.includes("welcome")
    ) {
      tipToShow = TIPS.find((tip) => tip.id === "welcome");
    }

    // Premier scan
    else if (completed === 1 && !shownTips.includes("first_scan")) {
      tipToShow = TIPS.find((tip) => tip.id === "first_scan");
    }

    // Stratégie après première erreur
    else if (wrongAnswers >= 1 && !shownTips.includes("strategy")) {
      tipToShow = TIPS.find((tip) => tip.id === "strategy");
    }

    // Travail d'équipe après plusieurs erreurs
    else if (wrongAnswers >= 3 && !shownTips.includes("teamwork")) {
      tipToShow = TIPS.find((tip) => tip.id === "teamwork");
    }

    // Exploration après succès
    else if (completed >= 2 && !shownTips.includes("exploration")) {
      tipToShow = TIPS.find((tip) => tip.id === "exploration");
    }

    // Dernière ligne droite
    else if (completed >= 3 && !shownTips.includes("final_push")) {
      tipToShow = TIPS.find((tip) => tip.id === "final_push");
    }

    if (tipToShow && !currentTip) {
      showTip(tipToShow);
    }
  };

  const showTip = (tip) => {
    setCurrentTip(tip);
    setIsVisible(true);

    // Marquer comme montré
    const newShownTips = [...shownTips, tip.id];
    setShownTips(newShownTips);
    localStorage.setItem("shownTips", JSON.stringify(newShownTips));
  };

  const closeTip = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentTip(null);
      if (onClose) onClose();
    }, 300);
  };

  const showRandomTip = () => {
    const availableTips = TIPS.filter((tip) => !shownTips.includes(tip.id));
    if (availableTips.length > 0) {
      const randomTip =
        availableTips[Math.floor(Math.random() * availableTips.length)];
      showTip(randomTip);
    }
  };

  if (!currentTip) {
    // Bouton flottant pour conseils à la demande
    return (
      <button
        className="tips-trigger-btn"
        onClick={showRandomTip}
        title="Conseil du Capitaine"
      >
        💡
      </button>
    );
  }

  return (
    <div className={`tips-overlay ${isVisible ? "visible" : ""}`}>
      <div className="tips-modal">
        <div className="tips-header">
          <div className="tips-icon">{currentTip.icon}</div>
          <h3>{currentTip.title}</h3>
          <button className="tips-close-btn" onClick={closeTip}>
            ✕
          </button>
        </div>

        <div className="tips-content">
          <p>{currentTip.content}</p>

          <div className="tips-actions">
            <button className="tips-btn primary" onClick={closeTip}>
              Compris, Capitaine ! ⚓
            </button>
          </div>
        </div>

        <div className="tips-footer">
          <span className="tips-signature">
            — Conseils du Capitaine Alison —
          </span>
        </div>
      </div>
    </div>
  );
};

export default TipsSystem;
