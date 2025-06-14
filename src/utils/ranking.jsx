// Système de rangs pour la chasse au trésor

export const RANKS = {
  LEGEND: {
    name: "Légende",
    icon: "👑",
    color: "#FFD700",
    description: "Maître des océans",
  },
  CAPTAIN: {
    name: "Capitaine",
    icon: "⚓",
    color: "#FF6B35",
    description: "Navigateur expérimenté",
  },
  NAVIGATOR: {
    name: "Navigateur",
    icon: "🧭",
    color: "#4ECDC4",
    description: "Explorateur confirmé",
  },
  SAILOR: {
    name: "Matelot",
    icon: "⛵",
    color: "#45B7D1",
    description: "Aventurier des mers",
  },
  APPRENTICE: {
    name: "Mousse",
    icon: "🌊",
    color: "#96CEB4",
    description: "Novice courageux",
  },
};

// Fonction utilitaire pour calculer le temps total en millisecondes
export const calculateTotalTimeMs = (player) => {
  if (!player?.startTime || !player?.lastUpdate) {
    console.log("❌ Données de temps manquantes:", {
      startTime: player?.startTime,
      lastUpdate: player?.lastUpdate,
    });
    return null;
  }

  try {
    const startTime = new Date(player.startTime);
    const endTime = new Date(player.lastUpdate);

    console.log("🕐 Calcul temps:", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      startTimeMs: startTime.getTime(),
      endTimeMs: endTime.getTime(),
    });

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.log("❌ Dates invalides");
      return null;
    }

    const totalMs = endTime.getTime() - startTime.getTime();

    console.log("⏱️ Temps calculé:", {
      totalMs,
      totalMinutes: totalMs / (1000 * 60),
      isPositive: totalMs > 0,
    });

    return totalMs > 0 ? totalMs : null;
  } catch (error) {
    console.error("Erreur calcul temps:", error);
    return null;
  }
};

// NOUVELLE FONCTION: Formater le temps comme dans VictoryPage
export const formatTotalTime = (player) => {
  const totalMs = calculateTotalTimeMs(player);

  if (totalMs === null) {
    return "Temps non disponible";
  }

  // Convertir en heures, minutes, secondes
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Formater l'affichage
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// Calcul du rang basé sur le temps et les performances
export const calculateRank = (player, allPlayers = []) => {
  if (!player || !player.completed || player.completed.length === 0) {
    return RANKS.APPRENTICE;
  }

  const totalEnigmas = 3; // Nombre total d'énigmes
  const completedCount = player.completed.length;
  const completionRate = completedCount / totalEnigmas;

  // Si pas terminé, rang basé sur le pourcentage de complétion
  if (completedCount < totalEnigmas) {
    if (completionRate >= 0.8) return RANKS.NAVIGATOR;
    if (completionRate >= 0.6) return RANKS.SAILOR;
    if (completionRate >= 0.3) return RANKS.SAILOR;
    return RANKS.APPRENTICE;
  }

  // Si terminé, rang basé sur le temps et la position dans le classement
  const totalTime = calculateTotalTimeMs(player);

  if (totalTime === null) {
    console.log("⚠️ Pas de temps disponible, rang par défaut");
    return RANKS.CAPTAIN; // Rang par défaut si pas de temps
  }

  // Calculer la position dans le classement
  const finishedPlayers = allPlayers.filter(
    (p) => p.completed && p.completed.length === totalEnigmas
  );

  const position =
    finishedPlayers
      .sort((a, b) => calculateTotalTimeMs(a) - calculateTotalTimeMs(b))
      .findIndex((p) => p.name === player.name) + 1;

  const totalFinished = finishedPlayers.length;

  // Critères pour les rangs (temps en minutes)
  const timeInMinutes = totalTime / (1000 * 60);

  console.log("🏆 Calcul rang:", {
    playerName: player.name,
    totalTimeMs: totalTime,
    timeInMinutes: timeInMinutes.toFixed(2),
    position,
    totalFinished,
    formattedTime: formatTotalTime(player),
  });

  // Légende : moins de 30 minutes
  if (timeInMinutes <= 30) {
    console.log("👑 Rang LEGEND attribué");
    return RANKS.LEGEND;
  }

  // Capitaine : moins de 45 minutes
  if (timeInMinutes <= 45) {
    console.log("⚓ Rang CAPTAIN attribué");
    return RANKS.CAPTAIN;
  }

  // Navigateur : moins de 60 minutes
  if (timeInMinutes <= 60) {
    console.log("🧭 Rang NAVIGATOR attribué");
    return RANKS.NAVIGATOR;
  }

  // Matelot : moins de 90 minutes
  if (timeInMinutes <= 90) {
    console.log("⛵ Rang SAILOR attribué");
    return RANKS.SAILOR;
  }

  // Mousse : Terminé mais lentement
  console.log("🌊 Rang APPRENTICE attribué");
  return RANKS.APPRENTICE;
};

// Fonction pour obtenir le rang avec des détails supplémentaires
export const getRankDetails = (player, allPlayers = []) => {
  const rank = calculateRank(player, allPlayers);
  const totalTime = calculateTotalTimeMs(player);

  // Calculer des statistiques supplémentaires
  const finishedPlayers = allPlayers.filter(
    (p) => p.completed && p.completed.length === 7
  );

  const position =
    finishedPlayers.length > 0
      ? finishedPlayers
          .sort((a, b) => calculateTotalTimeMs(a) - calculateTotalTimeMs(b))
          .findIndex((p) => p.name === player.name) + 1
      : 0;

  return {
    ...rank,
    position,
    totalPlayers: finishedPlayers.length,
    timeMs: totalTime,
    isFinished: player.completed && player.completed.length === 7,
  };
};

// Fonction pour obtenir le prochain rang
export const getNextRank = (currentRank) => {
  const rankOrder = [
    RANKS.APPRENTICE,
    RANKS.SAILOR,
    RANKS.NAVIGATOR,
    RANKS.CAPTAIN,
    RANKS.LEGEND,
  ];

  const currentIndex = rankOrder.findIndex(
    (rank) => rank.name === currentRank.name
  );

  if (currentIndex < rankOrder.length - 1) {
    return rankOrder[currentIndex + 1];
  }

  return null; // Déjà au rang maximum
};

// Conseils pour améliorer le rang
export const getRankAdvice = (player, allPlayers = []) => {
  const rankDetails = getRankDetails(player, allPlayers);
  const nextRank = getNextRank(rankDetails);

  if (!nextRank) {
    return "Vous avez atteint le rang maximum ! 👑";
  }

  const completedCount = player.completed ? player.completed.length : 0;

  if (completedCount < 7) {
    const remaining = 7 - completedCount;
    return `Trouvez ${remaining} fragment${
      remaining > 1 ? "s" : ""
    } de plus pour progresser vers ${nextRank.icon} ${nextRank.name}`;
  }

  const timeInMinutes = rankDetails.timeMs
    ? Math.ceil(rankDetails.timeMs / (1000 * 60))
    : 0;

  switch (nextRank.name) {
    case "Matelot":
      return "Terminez en moins de 90 minutes pour devenir Matelot ⛵";
    case "Navigateur":
      return "Terminez en moins de 60 minutes pour devenir Navigateur 🧭";
    case "Capitaine":
      return "Terminez en moins de 45 minutes pour devenir Capitaine ⚓";
    case "Légende":
      return "Terminez en moins de 30 minutes et soyez dans le top 10% pour devenir une Légende 👑";
    default:
      return `Continuez à explorer pour atteindre ${nextRank.icon} ${nextRank.name}`;
  }
};
