// Système de points pour La Navigatrice

import { ACHIEVEMENTS } from '../data/achievements.js';

// Configuration des points
const POINTS_CONFIG = {
  // Points pour les énigmes
  ENIGMA_SOLVED: 100,
  ENIGMA_PERFECT: 50, // Bonus pour résoudre en 1 tentative

  // Points pour les mini-jeux
  MINIGAME_COMPLETED: 200,
  MINIGAME_BONUS_MAX: 300, // Bonus maximum selon performance

  // Points pour les trophées
  TROPHY_COMMON: 50,
  TROPHY_RARE: 100,
  TROPHY_EPIC: 200,
  TROPHY_LEGENDARY: 300,
  TROPHY_MYTHIC: 500,

  // Bonus de temps (points par minute économisée)
  TIME_BONUS_PER_MINUTE: 10,
  TIME_TARGET_MINUTES: 45, // Temps cible pour terminer le jeu

  // Malus
  ATTEMPT_PENALTY: 10, // Malus par tentative supplémentaire
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
    // Utiliser directement le score calculé dans le mini-jeu
    const gamePoints = result.score || 0;

    totalPoints += gamePoints;
    details.push({
      type: result.type || "unknown",
      success: result.success,
      points: gamePoints,
      skipped: result.skipped || false,
      originalScore: result.score,
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
      },
    };
  }

  try {
    const startTime = new Date(player.startTime);
    const endTime = new Date(player.lastUpdate);
    const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));

    let timeBonus = 0;
    if (totalMinutes < POINTS_CONFIG.TIME_TARGET_MINUTES) {
      const minutesSaved = POINTS_CONFIG.TIME_TARGET_MINUTES - totalMinutes;
      timeBonus = minutesSaved * POINTS_CONFIG.TIME_BONUS_PER_MINUTE;
    }

    return {
      total: Math.max(0, timeBonus),
      details: {
        totalMinutes,
        targetMinutes: POINTS_CONFIG.TIME_TARGET_MINUTES,
        minutesSaved: Math.max(
          0,
          POINTS_CONFIG.TIME_TARGET_MINUTES - totalMinutes
        ),
      },
    };
  } catch (error) {
    console.error("Erreur calcul bonus temps:", error);
    return {
      total: 0,
      details: {
        totalMinutes: 0,
        targetMinutes: POINTS_CONFIG.TIME_TARGET_MINUTES,
      },
    };
  }
};

// Fonction principale pour calculer le score total
export const calculateTotalScore = (player, minigameResults = []) => {
  const enigmaPoints = calculateEnigmaPoints(player);
  const minigamePoints = calculateMinigamePoints(minigameResults);
  const trophyPoints = calculateTrophyPoints(player, minigameResults);
  const timeBonus = calculateTimeBonus(player);

  const totalScore =
    enigmaPoints.total +
    minigamePoints.total +
    trophyPoints.total +
    timeBonus.total;

  return {
    total: totalScore,
    breakdown: {
      enigmas: enigmaPoints,
      minigames: minigamePoints,
      trophies: trophyPoints,
      timeBonus: timeBonus,
    },
  };
};

// Fonction pour obtenir le rang basé sur le score
export const getScoreRank = (score) => {
  if (score >= 3000)
    return { name: "Légende Maritime", icon: "👑", color: "#FFD700" };
  if (score >= 2500)
    return { name: "Maître Navigateur", icon: "⚓", color: "#C0392B" };
  if (score >= 2000)
    return { name: "Capitaine Expérimenté", icon: "🧭", color: "#8E44AD" };
  if (score >= 1500)
    return { name: "Marin Confirmé", icon: "⛵", color: "#2980B9" };
  if (score >= 1000)
    return { name: "Explorateur", icon: "🗺️", color: "#27AE60" };
  if (score >= 500)
    return { name: "Apprenti Marin", icon: "🌊", color: "#F39C12" };
  return { name: "Mousse", icon: "🐚", color: "#95A5A6" };
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
  calculateTotalScore,
  getScoreRank,
  formatScore,
  POINTS_CONFIG,
};
