const STORAGE_KEYS = {
  CURRENT_PLAYER: "treasure_hunt_current_player",
  ALL_PLAYERS: "treasure_hunt_all_players",
  LEADERBOARD: "treasure_hunt_leaderboard",
  GAME_SETTINGS: "treasure_hunt_settings",
};

export const savePlayerData = (playerData) => {
  try {
    // Ajouter timestamp
    const enrichedData = {
      ...playerData,
      lastUpdate: new Date().toISOString(),
    };

    // Sauver joueur actuel
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_PLAYER,
      JSON.stringify(enrichedData)
    );

    // Mettre à jour la liste globale
    const allPlayers = getAllPlayersData();
    const existingIndex = allPlayers.findIndex(
      (p) => p.name === playerData.name
    );

    if (existingIndex >= 0) {
      allPlayers[existingIndex] = enrichedData;
    } else {
      allPlayers.push(enrichedData);
    }

    localStorage.setItem(STORAGE_KEYS.ALL_PLAYERS, JSON.stringify(allPlayers));

    return true;
  } catch (error) {
    console.error("Error saving player data:", error);
    return false;
  }
};

export const getPlayerData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting player data:", error);
    return null;
  }
};

export const getAllPlayersData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALL_PLAYERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting all players data:", error);
    return [];
  }
};

export const clearPlayerData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
    return true;
  } catch (error) {
    console.error("Error clearing player data:", error);
    return false;
  }
};

export const getLeaderboard = () => {
  const allPlayers = getAllPlayersData();
  return allPlayers.sort((a, b) => {
    // Tri par nombre de fragments d'abord
    if (b.completed.length !== a.completed.length) {
      return b.completed.length - a.completed.length;
    }
    // Si égalité, tri par timestamp (premier arrivé)
    return new Date(a.lastUpdate) - new Date(b.lastUpdate);
  });
};

// Pour le développement - fonction de reset
export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
  localStorage.removeItem(STORAGE_KEYS.ALL_PLAYERS);
};
