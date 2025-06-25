export const GAME_RULES = {
  MIN_SUCCESS_RATE: 0.49, // 50% minimum
  MAX_ATTEMPTS_PER_ENIGMA: 1,
  PENALTY_PER_WRONG_ANSWER: 50, // Réduit pour cohérence avec nouveau système
  TIME_PENALTY_THRESHOLD: 300000, // 5 minutes
  // TOTAL_ENIGMAS supprimé - sera calculé dynamiquement
  
  // === COHÉRENCE AVEC LE NOUVEAU SYSTÈME DE POINTS ===
  BASE_SCORE_PER_ENIGMA: 200, // Aligné avec pointsSystem.js
  PERFECT_BONUS: 100, // Bonus pour résolution en 1 tentative
  TIME_TARGET_MINUTES: 40, // Temps cible aligné
};

export const calculateSuccessRate = (player) => {
  if (!player) return 0;

  const totalAttempts = player.totalAttempts || 0;
  const wrongAnswers = player.wrongAnswers || 0;
  const correctAnswers = totalAttempts - wrongAnswers;

  console.log("Calcul taux de réussite:", {
    totalAttempts,
    wrongAnswers,
    correctAnswers,
    completedEnigmas: player.completed?.length || 0,
  });

  if (totalAttempts === 0) return 1; // 100% si aucune tentative

  const successRate = correctAnswers / totalAttempts;

  // Vérification de cohérence
  if (successRate > 1) {
    console.error("ERREUR: Taux de réussite > 100%", {
      totalAttempts,
      wrongAnswers,
      correctAnswers,
      successRate,
    });
    return Math.min(successRate, 1); // Plafonner à 100%
  }

  return successRate;
};

// NOUVELLE FONCTION: Calculer les statistiques détaillées
export const calculateDetailedStats = (player) => {
  if (!player)
    return {
      totalAttempts: 0,
      wrongAnswers: 0,
      correctAnswers: 0,
      completedEnigmas: 0,
      failedEnigmas: 0,
      totalProcessed: 0,
      successRate: 0,
      issues: ["Aucun joueur"],
      isValid: false,
    };

  const totalAttempts = player.totalAttempts || 0;
  const wrongAnswers = player.wrongAnswers || 0;
  const correctAnswers = totalAttempts - wrongAnswers;
  const completedEnigmas = player.completed?.length || 0;
  const failedEnigmas = player.failed?.length || 0; // AJOUT
  const totalProcessed = completedEnigmas + failedEnigmas; // AJOUT

  // Vérifications de cohérence
  const issues = [];

  if (correctAnswers < 0) {
    issues.push("Nombre de bonnes réponses négatif");
  }

  if (correctAnswers < completedEnigmas) {
    issues.push(
      `Incohérence: ${correctAnswers} bonnes réponses mais ${completedEnigmas} énigmes complétées`
    );
  }

  if (wrongAnswers > totalAttempts) {
    issues.push("Plus de mauvaises réponses que de tentatives totales");
  }

  return {
    totalAttempts,
    wrongAnswers,
    correctAnswers,
    completedEnigmas,
    failedEnigmas, // AJOUT
    totalProcessed, // AJOUT
    successRate: totalAttempts > 0 ? correctAnswers / totalAttempts : 1,
    issues,
    isValid: issues.length === 0,
  };
};

export const isGameValid = (player, totalEnigmas = 4) => {
  if (!player) {
    return {
      isValid: false,
      successRate: 0,
      hasProcessedAll: false,
      reason: "Aucun joueur",
    };
  }

  const stats = calculateDetailedStats(player);

  // CORRECTION: Vérifier que toutes les énigmes ont été traitées (réussies + échouées)
  const hasProcessedAll = stats.totalProcessed >= totalEnigmas;

  console.log("🔍 Validation du jeu:", {
    completedEnigmas: stats.completedEnigmas,
    failedEnigmas: stats.failedEnigmas,
    totalProcessed: stats.totalProcessed,
    requiredTotal: totalEnigmas,
    hasProcessedAll,
    successRate: stats.successRate,
    minRequired: GAME_RULES.MIN_SUCCESS_RATE,
    isValid: stats.isValid,
  });

  // Vérifier les incohérences
  if (!stats.isValid) {
    console.error("Données incohérentes détectées:", stats.issues);
  }

  const isValidGame =
    stats.successRate >= GAME_RULES.MIN_SUCCESS_RATE &&
    hasProcessedAll &&
    stats.isValid;

  return {
    isValid: isValidGame,
    successRate: stats.successRate,
    hasProcessedAll,
    totalProcessed: stats.totalProcessed,
    completedEnigmas: stats.completedEnigmas,
    failedEnigmas: stats.failedEnigmas,
    reason: !hasProcessedAll
      ? `Toutes les énigmes doivent être traitées (${stats.totalProcessed}/${totalEnigmas})`
      : !stats.isValid
      ? `Données incohérentes: ${stats.issues.join(", ")}`
      : stats.successRate < GAME_RULES.MIN_SUCCESS_RATE
      ? `Taux de réussite insuffisant: ${Math.round(
          stats.successRate * 100
        )}% (minimum 50%)`
      : null,
  };
};

// AJOUT: Fonction calculateScore manquante - MISE À JOUR AVEC NOUVEAU SYSTÈME
export const calculateScore = (player) => {
  if (!player)
    return {
      total: 0,
      valid: false,
      reason: "Aucun joueur",
      base: 0,
      timeBonus: 0,
      accuracyBonus: 0,
      penalty: 0,
      successRate: 0,
    };

  const validation = isGameValid(player);
  if (!validation.isValid)
    return {
      total: 0,
      valid: false,
      reason: validation.reason,
      base: 0,
      timeBonus: 0,
      accuracyBonus: 0,
      penalty: 0,
      successRate: validation.successRate,
    };

  // Utiliser les nouvelles constantes alignées
  const baseScore = GAME_RULES.BASE_SCORE_PER_ENIGMA * player.completed.length;
  const timeBonus = calculateTimeBonus(player);
  const accuracyBonus = Math.round(validation.successRate * 300); // Réduit pour équilibrage
  const wrongAnswerPenalty = (player.wrongAnswers || 0) * GAME_RULES.PENALTY_PER_WRONG_ANSWER;

  // Bonus pour énigmes parfaites (résolues en 1 tentative)
  let perfectBonus = 0;
  if (player.enigmaAttempts) {
    const perfectSolves = player.completed.filter(enigmaId => {
      const attempts = player.enigmaAttempts[enigmaId] || 1;
      return attempts === 1;
    });
    perfectBonus = perfectSolves.length * GAME_RULES.PERFECT_BONUS;
  }

  return {
    base: baseScore,
    timeBonus,
    accuracyBonus,
    perfectBonus,
    penalty: wrongAnswerPenalty,
    total: Math.max(
      0,
      baseScore + timeBonus + accuracyBonus + perfectBonus - wrongAnswerPenalty
    ),
    valid: true,
    successRate: validation.successRate,
  };
};

// AJOUT: Fonction calculateTimeBonus manquante
export const calculateTimeBonus = (player) => {
  if (!player || !player.gameTime) return 0;

  const gameTimeMinutes = player.gameTime / (1000 * 60);
  const targetTime = GAME_RULES.TIME_TARGET_MINUTES; // Utiliser la constante alignée
  const maxBonus = 400; // Réduit pour équilibrage

  if (gameTimeMinutes <= targetTime) {
    const timeRatio = 1 - gameTimeMinutes / targetTime;
    return Math.round(maxBonus * timeRatio);
  }

  return 0;
};

// Fonction pour corriger les données incohérentes
export const fixPlayerData = (player) => {
  if (!player) return null;

  const stats = calculateDetailedStats(player);

  if (stats.isValid) {
    return player; // Pas besoin de correction
  }

  console.log("Correction des données incohérentes...", stats);

  // Recalculer à partir de l'historique si disponible
  if (player.attemptHistory && Array.isArray(player.attemptHistory)) {
    const correctFromHistory = player.attemptHistory.filter(
      (attempt) => attempt.isCorrect
    ).length;
    const wrongFromHistory = player.attemptHistory.filter(
      (attempt) => !attempt.isCorrect
    ).length;
    const totalFromHistory = player.attemptHistory.length;

    return {
      ...player,
      totalAttempts: totalFromHistory,
      wrongAnswers: wrongFromHistory,
      // Vérifier que les énigmes complétées correspondent
      completed: player.completed || [],
    };
  }

  // Sinon, essayer de corriger avec les données disponibles
  const completedCount = player.completed?.length || 0;
  const minCorrectAnswers = Math.max(completedCount, 0);
  const totalAttempts = Math.max(player.totalAttempts || 0, minCorrectAnswers);
  const wrongAnswers = Math.max(
    0,
    Math.min(player.wrongAnswers || 0, totalAttempts - minCorrectAnswers)
  );

  return {
    ...player,
    totalAttempts,
    wrongAnswers,
  };
};

// Fonction utilitaire pour debug
export const debugPlayerStats = (player) => {
  if (!player) {
    console.log("Aucun joueur à analyser");
    return;
  }

  console.log("=== STATISTIQUES JOUEUR ===");
  console.log("Nom:", player.name);
  console.log("Énigmes complétées:", player.completed?.length || 0);
  console.log("Énigmes échouées:", player.failed?.length || 0);
  console.log(
    "Total traité:",
    (player.completed?.length || 0) + (player.failed?.length || 0)
  );
  console.log("Tentatives totales:", player.totalAttempts || 0);
  console.log("Mauvaises réponses:", player.wrongAnswers || 0);
  console.log(
    "Taux de réussite:",
    Math.round(calculateSuccessRate(player) * 100) + "%"
  );
  console.log("Validation:", isGameValid(player));
  console.log("Score:", calculateScore(player));
  console.log("Tentatives par énigme:", player.enigmaAttempts || {});
  console.log("==============================");
};
