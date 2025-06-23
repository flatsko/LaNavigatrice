import { useState, useEffect, useCallback } from 'react';

const ACHIEVEMENTS = [
  {
    id: "first_discovery",
    title: "Premier Explorateur",
    description: "Découvrir votre première destination",
    icon: "🗺️",
    condition: (player) => player.completed?.length >= 1,
    rarity: "common",
  },
  {
    id: "photo_enthusiast",
    title: "Photographe Aventurier",
    description: "Prendre 3 photos souvenirs",
    icon: "📸",
    condition: () => {
      const photos = JSON.parse(localStorage.getItem("gamePhotos") || "[]");
      return photos.length >= 3;
    },
    rarity: "rare",
  },
  {
    id: "perfect_navigator",
    title: "Navigateur Parfait",
    description: "Résoudre 3 énigmes sans erreur",
    icon: "🧭",
    condition: (player) => {
      const perfectSolves = player.completed?.filter((enigmaId) => {
        const attempts = player.enigmaAttempts?.[enigmaId] || 0;
        return attempts === 1;
      });
      return perfectSolves?.length >= 3;
    },
    rarity: "epic",
  },
  {
    id: "speed_demon",
    title: "Éclair des Mers",
    description: "Résoudre une énigme en moins de 30 secondes",
    icon: "⚡",
    condition: () => {
      // Cette condition nécessiterait un tracking du temps
      return false; // À implémenter avec un système de timing
    },
    rarity: "legendary",
  },
  {
    id: "treasure_hunter",
    title: "Chasseur de Trésor Légendaire",
    description: "Compléter toutes les destinations",
    icon: "🏆",
    condition: (player) => player.completed?.length >= 5,
    rarity: "legendary",
  },
];

export const useAchievementNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationQueue, setNotificationQueue] = useState([]);

  // Vérifier les achievements et déclencher les notifications
  const checkAchievements = useCallback((player) => {
    const savedAchievements = JSON.parse(
      localStorage.getItem("playerAchievements") || "[]"
    );
    
    const currentUnlocked = ACHIEVEMENTS.filter((achievement) =>
      achievement.condition(player)
    );

    const newlyUnlocked = currentUnlocked.filter(
      (achievement) => !savedAchievements.includes(achievement.id)
    );

    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [
        ...savedAchievements,
        ...newlyUnlocked.map((a) => a.id),
      ];
      localStorage.setItem(
        "playerAchievements",
        JSON.stringify(updatedAchievements)
      );
      
      // Ajouter les nouveaux achievements à la queue de notifications
      setNotificationQueue(prev => [...prev, ...newlyUnlocked]);
    }

    return currentUnlocked;
  }, []);

  // Déclencher manuellement une notification (pour des achievements spéciaux)
  const triggerNotification = useCallback((achievementId) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievement) {
      setNotificationQueue(prev => [...prev, achievement]);
    }
  }, []);

  // Gérer la queue des notifications
  useEffect(() => {
    if (notificationQueue.length > 0 && !currentNotification) {
      const nextNotification = notificationQueue[0];
      setCurrentNotification(nextNotification);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [notificationQueue, currentNotification]);

  const handleNotificationClose = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  return {
    currentNotification,
    checkAchievements,
    triggerNotification,
    handleNotificationClose,
    achievements: ACHIEVEMENTS
  };
};

export default useAchievementNotifications;