export const GAME_RULES = {
  MIN_SUCCESS_RATE: 0.49, // 50% minimum
  MAX_ATTEMPTS_PER_ENIGMA: 1,
  PENALTY_PER_WRONG_ANSWER: 100,
  TIME_PENALTY_THRESHOLD: 300000, // 5 minutes
  TOTAL_ENIGMAS: 4, // AJOUT: Centraliser le nombre total d'énigmes
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

export const isGameValid = (player) => {
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
  const hasProcessedAll = stats.totalProcessed >= GAME_RULES.TOTAL_ENIGMAS;

  console.log("🔍 Validation du jeu:", {
    completedEnigmas: stats.completedEnigmas,
    failedEnigmas: stats.failedEnigmas,
    totalProcessed: stats.totalProcessed,
    requiredTotal: GAME_RULES.TOTAL_ENIGMAS,
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
      ? `Toutes les énigmes doivent être traitées (${stats.totalProcessed}/${GAME_RULES.TOTAL_ENIGMAS})`
      : !stats.isValid
      ? `Données incohérentes: ${stats.issues.join(", ")}`
      : stats.successRate < GAME_RULES.MIN_SUCCESS_RATE
      ? `Taux de réussite insuffisant: ${Math.round(
          stats.successRate * 100
        )}% (minimum 50%)`
      : null,
  };
};

// AJOUT: Fonction calculateScore manquante
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

  const baseScore = 1000;
  const timeBonus = calculateTimeBonus(player);
  const accuracyBonus = Math.round(validation.successRate * 500);
  const wrongAnswerPenalty =
    (player.wrongAnswers || 0) * GAME_RULES.PENALTY_PER_WRONG_ANSWER;

  return {
    base: baseScore * player.completed.length,
    timeBonus,
    accuracyBonus,
    penalty: wrongAnswerPenalty,
    total: Math.max(
      0,
      baseScore * player.completed.length +
        timeBonus +
        accuracyBonus -
        wrongAnswerPenalty
    ),
    valid: true,
    successRate: validation.successRate,
  };
};

// AJOUT: Fonction calculateTimeBonus manquante
const calculateTimeBonus = (player) => {
  if (!player || !player.startTime || !player.lastUpdate) return 0;

  try {
    const totalTime = new Date(player.lastUpdate) - new Date(player.startTime);
    const maxBonus = 1000;

    if (totalTime < 600000) return maxBonus; // < 10 min
    if (totalTime < 1200000) return 500; // < 20 min
    if (totalTime < 1800000) return 250; // < 30 min
    return 0;
  } catch (error) {
    console.error("Erreur calcul bonus temps:", error);
    return 0;
  }
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
