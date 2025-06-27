// Système de points pour La Navigatrice

import { ACHIEVEMENTS } from "../data/achievements.js";

// Configuration des points - SYSTÈME ÉQUILIBRÉ
const POINTS_CONFIG = {
  // === ÉNIGMES === (Base du jeu)
  ENIGMA_SOLVED: 200, // Points de base par énigme résolue
  ENIGMA_PERFECT: 0, // Bonus pour résoudre en 1 tentative
  ATTEMPT_PENALTY: 25, // Malus par tentative supplémentaire
  HINT_PENALTY: 30, // Pénalité pour utiliser un indice

  // === MINI-JEUX === (Activités bonus)
  MINIGAME_BASE: {
    morse: 400, // Mini-jeu difficile
    tentacle: 500, // Mini-jeu très difficile
    sharing: 300, // Mini-jeu social
    compass: 350, // Mini-jeu navigation
  },
  MINIGAME_TIME_MULTIPLIER: 2, // Multiplicateur pour bonus temps

  // === TROPHÉES/ACHIEVEMENTS === (Objectifs à long terme)
  TROPHY_MOUSSE: 75, // Trophées faciles (ex-common)
  TROPHY_MATELOT: 150, // Trophées moyens (ex-rare)
  TROPHY_CAPITAINE: 300, // Trophées difficiles (ex-epic)
  TROPHY_AMIRAL: 500, // Trophées très difficiles (ex-legendary)
  TROPHY_LEGENDE: 750, // Trophées exceptionnels (ex-mythic)

  // === BONUS TEMPS === (Récompense la rapidité)
  TIME_BONUS_PER_MINUTE: 50, // Points par minute économisée (augmenté de 15 à 20)
  TIME_TARGET_MINUTES: 40, // Temps cible pour terminer le jeu
  TIME_BONUS_MAX: 1000, // Bonus maximum possible (augmenté de 600 à 800)

  // === QUIZ FINAL === (Validation des connaissances)
  QUIZ_PERFECT_BONUS: 200, // Bonus pour 100% au quiz
  QUIZ_GOOD_BONUS: 100, // Bonus pour 80-99% au quiz
  QUIZ_PASS_BONUS: 50, // Bonus pour 60-79% au quiz
};

// Fonction pour calculer les points des énigmes
export const calculateEnigmaPoints = (player) => {
  if (!player?.completed || !player?.enigmaAttempts) {
    return { total: 0, details: [] };
  }

  let totalPoints = 0;
  const details = [];

  player.completed.forEach((enigmaId) => {
    const attempts = player.enigmaAttempts[enigmaId] || 1;
    let enigmaPoints = POINTS_CONFIG.ENIGMA_SOLVED;

    // Bonus pour résolution parfaite
    if (attempts === 1) {
      enigmaPoints += POINTS_CONFIG.ENIGMA_PERFECT;
    }

    // Malus pour tentatives supplémentaires
    if (attempts > 1) {
      enigmaPoints -= (attempts - 1) * POINTS_CONFIG.ATTEMPT_PENALTY;
    }

    // Minimum 10 points par énigme
    enigmaPoints = Math.max(10, enigmaPoints);

    totalPoints += enigmaPoints;
    details.push({
      enigmaId,
      attempts,
      points: enigmaPoints,
      perfect: attempts === 1,
    });
  });

  return { total: totalPoints, details };
};

// Fonction pour calculer les points des mini-jeux
export const calculateMinigamePoints = (minigameResults = []) => {
  let totalPoints = 0;
  const details = [];

  minigameResults.forEach((result) => {
    if (result.skipped) {
      // Aucun point pour les mini-jeux passés
      details.push({
        type: result.gameType || result.type || "unknown",
        success: false,
        points: 0,
        skipped: true,
        reason: "Mini-jeu passé",
      });
      return;
    }

    const gameType = result.gameType || result.type || "unknown";

    // Utiliser le score déjà calculé par le mini-jeu pour éviter le double comptage
    let gamePoints = 0;
    if (result.success && result.score !== undefined) {
      gamePoints = result.score; // Utiliser le score calculé par le mini-jeu
    } else if (result.success) {
      // Fallback vers l'ancien système si pas de score fourni
      const basePoints = POINTS_CONFIG.MINIGAME_BASE[gameType] || 300;
      gamePoints = basePoints;

      if (result.timeBonus) {
        const timeBonusPoints = Math.floor(
          result.timeBonus * POINTS_CONFIG.MINIGAME_TIME_MULTIPLIER
        );
        gamePoints += timeBonusPoints;
      }
    }

    totalPoints += gamePoints;
    details.push({
      type: gameType,
      success: result.success,
      points: gamePoints,
      skipped: false,
      originalScore: result.score || 0,
      timeBonus: result.timeBonus || 0,
    });
  });

  return { total: totalPoints, details };
};

// Fonction pour calculer les points des trophées
export const calculateTrophyPoints = (player, minigameResults = []) => {
  // Récupérer les trophées débloqués depuis localStorage
  const savedAchievements = JSON.parse(
    localStorage.getItem("playerAchievements") || "[]"
  );

  let totalPoints = 0;
  const details = [];

  savedAchievements.forEach((achievementId) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (achievement) {
      const points =
        POINTS_CONFIG[`TROPHY_${achievement.rarity.toUpperCase()}`] || 0;
      totalPoints += points;
      details.push({
        id: achievementId,
        rarity: achievement.rarity,
        points,
      });
    }
  });

  return { total: totalPoints, details };
};

// Fonction pour calculer le bonus de temps
export const calculateTimeBonus = (player) => {
  if (!player?.startTime || !player?.lastUpdate) {
    return {
      total: 0,
      details: {
        totalMinutes: 0,
        targetMinutes: POINTS_CONFIG.TIME_TARGET_MINUTES,
        minutesSaved: 0,
        bonusRate: POINTS_CONFIG.TIME_BONUS_PER_MINUTE,
        maxBonus: POINTS_CONFIG.TIME_BONUS_MAX,
      },
    };
  }

  try {
    const startTime = new Date(player.startTime);
    const endTime = new Date(player.lastUpdate);
    const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));

    let timeBonus = 0;
    let minutesSaved = 0;

    if (totalMinutes < POINTS_CONFIG.TIME_TARGET_MINUTES) {
      minutesSaved = POINTS_CONFIG.TIME_TARGET_MINUTES - totalMinutes;
      timeBonus = minutesSaved * POINTS_CONFIG.TIME_BONUS_PER_MINUTE;

      // Appliquer le plafond maximum
      timeBonus = Math.min(timeBonus, POINTS_CONFIG.TIME_BONUS_MAX);
    }

    return {
      total: Math.max(0, timeBonus),
      details: {
        totalMinutes,
        targetMinutes: POINTS_CONFIG.TIME_TARGET_MINUTES,
        minutesSaved,
        bonusRate: POINTS_CONFIG.TIME_BONUS_PER_MINUTE,
        maxBonus: POINTS_CONFIG.TIME_BONUS_MAX,
        cappedAtMax: timeBonus === POINTS_CONFIG.TIME_BONUS_MAX,
      },
    };
  } catch (error) {
    console.error("Erreur calcul bonus temps:", error);
    return {
      total: 0,
      details: {
        totalMinutes: 0,
        targetMinutes: POINTS_CONFIG.TIME_TARGET_MINUTES,
        minutesSaved: 0,
        bonusRate: POINTS_CONFIG.TIME_BONUS_PER_MINUTE,
        maxBonus: POINTS_CONFIG.TIME_BONUS_MAX,
      },
    };
  }
};

// Fonction pour calculer les pénalités d'indices
export const calculateHintPenalties = (player) => {
  // Compter le nombre d'indices utilisés depuis l'objet hintsUsed
  const hintsUsedCount = player?.hintsUsed
    ? Object.keys(player.hintsUsed).length
    : 0;

  // Utiliser la pénalité accumulée si elle existe, sinon calculer
  const totalPenalty =
    player?.hintPenalties || hintsUsedCount * POINTS_CONFIG.HINT_PENALTY;

  // Calculer le nombre d'indices basé sur la pénalité réelle pour l'affichage
  const displayedHintsUsed = player?.hintPenalties
    ? Math.round(player.hintPenalties / POINTS_CONFIG.HINT_PENALTY)
    : hintsUsedCount;

  return {
    total: totalPenalty,
    details: {
      hintsUsed: displayedHintsUsed,
      penaltyPerHint: POINTS_CONFIG.HINT_PENALTY,
      totalPenalty,
    },
  };
};

// Fonction pour calculer les points du quiz final
export const calculateQuizPoints = (quizScore, totalQuestions) => {
  if (!quizScore || !totalQuestions) {
    return {
      total: 0,
      details: {
        score: 0,
        percentage: 0,
        bonus: 0,
        tier: "none",
      },
    };
  }

  const percentage = (quizScore / totalQuestions) * 100;
  let bonus = 0;
  let tier = "none";

  if (percentage >= 100) {
    bonus = POINTS_CONFIG.QUIZ_PERFECT_BONUS;
    tier = "perfect";
  } else if (percentage >= 80) {
    bonus = POINTS_CONFIG.QUIZ_GOOD_BONUS;
    tier = "good";
  } else if (percentage >= 60) {
    bonus = POINTS_CONFIG.QUIZ_PASS_BONUS;
    tier = "pass";
  }

  return {
    total: bonus,
    details: {
      score: quizScore,
      totalQuestions,
      percentage: Math.round(percentage),
      bonus,
      tier,
    },
  };
};

// Fonction principale pour calculer le score total
export const calculateTotalScore = (
  player,
  minigameResults = [],
  quizScore = null,
  totalQuestions = null
) => {
  const enigmaPoints = calculateEnigmaPoints(player);
  const minigamePoints = calculateMinigamePoints(minigameResults);
  const trophyPoints = calculateTrophyPoints(player, minigameResults);
  const timeBonus = calculateTimeBonus(player);
  const quizPoints = calculateQuizPoints(quizScore, totalQuestions);
  const hintPenalties = calculateHintPenalties(player);

  const totalScore =
    enigmaPoints.total +
    minigamePoints.total +
    trophyPoints.total +
    timeBonus.total +
    quizPoints.total -
    hintPenalties.total;

  return {
    total: Math.max(0, totalScore), // S'assurer que le score ne soit jamais négatif
    breakdown: {
      enigmas: enigmaPoints,
      minigames: minigamePoints,
      trophies: trophyPoints,
      timeBonus: timeBonus,
      quiz: quizPoints,
      hintPenalties: hintPenalties,
    },
  };
};

// Fonction pour obtenir le rang basé sur le score
export const getScoreRank = (score) => {
  // Scores ajustés pour le nouveau système (4 énigmes × 200 = 800 points de base)
  if (score >= 4000)
    return {
      name: "Légende Maritime",
      icon: "👑",
      color: "#FFD700",
      description: "Perfection absolue",
    };
  if (score >= 3200)
    return {
      name: "Amiral des Sept Mers",
      icon: "⚓",
      color: "#C0392B",
      description: "Excellence remarquable",
    };
  if (score >= 2600)
    return {
      name: "Capitaine Expérimenté",
      icon: "🧭",
      color: "#8E44AD",
      description: "Maîtrise confirmée",
    };
  if (score >= 2000)
    return {
      name: "Navigateur Émérite",
      icon: "⛵",
      color: "#2980B9",
      description: "Très bon niveau",
    };
  if (score >= 1500)
    return {
      name: "Marin Confirmé",
      icon: "🗺️",
      color: "#27AE60",
      description: "Bon navigateur",
    };
  if (score >= 1000)
    return {
      name: "Explorateur",
      icon: "🌊",
      color: "#F39C12",
      description: "Début prometteur",
    };
  if (score >= 500)
    return {
      name: "Apprenti Marin",
      icon: "🐚",
      color: "#95A5A6",
      description: "Premiers pas",
    };
  return {
    name: "Mousse",
    icon: "⚓",
    color: "#7F8C8D",
    description: "À l'abordage !",
  };
};

// Fonction pour formater l'affichage des points
export const formatScore = (score) => {
  return score.toLocaleString("fr-FR") + " pts";
};

export default {
  calculateEnigmaPoints,
  calculateMinigamePoints,
  calculateTrophyPoints,
  calculateTimeBonus,
  calculateQuizPoints,
  calculateHintPenalties,
  calculateTotalScore,
  getScoreRank,
  formatScore,
  POINTS_CONFIG,
};
