export const ACHIEVEMENTS = [
  {
    id: "first_discovery",
    title: "Premier Explorateur",
    description: "Découvrir votre première destination",
    icon: "🗺️",
    condition: (player) => {
      return player?.completed?.length >= 1;
    },
    rarity: "mousse",
  },
  {
    id: "photo_enthusiast",
    title: "Photographe Aventurier",
    description: "Prendre 3 photos souvenirs",
    icon: "📸",
    condition: (player) => {
      if (!player?.name) return false;
      const photos = JSON.parse(
        localStorage.getItem(`photos_${player.name}`) || "[]"
      );
      return photos.length >= 3;
    },
    rarity: "matelot",
  },
  {
    id: "perfect_navigator",
    title: "Navigateur Parfait",
    description: "Résoudre au moins 5 déstinations sans erreur",
    icon: "🧭",
    condition: (player) => {
      // Le joueur doit avoir terminé au moins 5 énigmes
      if (!player || (player.completed?.length || 0) < 5) return false;

      const perfectSolves = player.completed?.filter((enigmaId) => {
        const attempts = player.enigmaAttempts?.[enigmaId] || 0;
        return attempts === 1;
      });
      // Doit avoir au moins 5 énigmes réussies du premier coup
      return perfectSolves?.length >= 5;
    },
    rarity: "capitaine",
  },
  {
    id: "speed_demon",
    title: "Éclair des Mers",
    description: "Résoudre une énigme en moins de 15 secondes",
    icon: "⚡",
    condition: (player) => {
      if (!player?.name) return false;
      const solveTimes = JSON.parse(
        localStorage.getItem(`enigmaSolveTimes_${player.name}`) || "{}"
      );
      return Object.values(solveTimes).some((time) => time < 15);
    },
    rarity: "amiral",
  },
  {
    id: "completionist",
    title: "Maître Explorateur",
    description: "Terminer toutes les destinations sans erreur",
    icon: "🏆",
    condition: (player) => {
      // Ce trophée ne devrait pas être accordé en cas d'échec global
      if (!player || (player.completed?.length || 0) < 7) return false;
      return player.completed?.length >= 7;
    },
    rarity: "legende",
  },
  {
    id: "minigame_player",
    title: "Joueur Aventurier",
    description: "Compléter un mini-jeu avec succès",
    icon: "🎮",
    condition: (player, minigameResults = []) => {
      return minigameResults.some(
        (result) => result.success && !result.skipped
      );
    },
    rarity: "mousse",
  },
  {
    id: "minigame_master",
    title: "Maître des Mini-Jeux",
    description: "Compléter tous les mini-jeux avec succès",
    icon: "🏅",
    condition: (player, minigameResults = []) => {
      const gameTypes = ["morse", "tentacle", "sharing"];
      return gameTypes.every((type) =>
        minigameResults.some(
          (result) =>
            result.gameType === type && result.success && !result.skipped
        )
      );
    },
    rarity: "capitaine",
  },
];
