import { useState, useCallback, useEffect } from "react";
import { ACHIEVEMENTS } from "../../data/achievements";

export const useAchievementNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationQueue, setNotificationQueue] = useState([]);

  // Vérifier les achievements et déclencher les notifications
  const checkAchievements = useCallback((player, minigameResults = []) => {
    console.log("🏆 Vérification des achievements:", {
      player: player?.completed?.length || 0,
      minigameResults: minigameResults.length,
    });

    const savedAchievements = JSON.parse(
      localStorage.getItem("playerAchievements") || "[]"
    );

    const currentUnlocked = ACHIEVEMENTS.filter((achievement) => {
      const result = achievement.condition(player, minigameResults);
      console.log(`🎯 Achievement ${achievement.id}: ${result}`);
      return result;
    });

    const newlyUnlocked = currentUnlocked.filter(
      (achievement) => !savedAchievements.includes(achievement.id)
    );

    console.log("🔍 Achievements sauvegardés:", savedAchievements);
    console.log("🆕 Nouveaux achievements:", newlyUnlocked.map(a => a.id));

    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [
        ...savedAchievements,
        ...newlyUnlocked.map((a) => a.id),
      ];
      localStorage.setItem(
        "playerAchievements",
        JSON.stringify(updatedAchievements)
      );

      console.log("📢 Ajout à la queue de notifications:", newlyUnlocked.map(a => a.id));
      // Ajouter les nouveaux achievements à la queue de notifications
      setNotificationQueue((prev) => {
        console.log("📋 Queue actuelle:", prev.map(a => a.id));
        const newQueue = [...prev, ...newlyUnlocked];
        console.log("📋 Nouvelle queue:", newQueue.map(a => a.id));
        return newQueue;
      });
    }

    return currentUnlocked;
  }, []);

  // Déclencher manuellement une notification (pour des achievements spéciaux)
  const triggerNotification = useCallback((achievementId) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (achievement) {
      setNotificationQueue((prev) => [...prev, achievement]);
    }
  }, []);

  // Gérer la queue des notifications
  useEffect(() => {
    console.log("🔄 useEffect queue:", {
      queueLength: notificationQueue.length,
      hasCurrentNotification: !!currentNotification,
      queue: notificationQueue.map(a => a.id)
    });
    
    if (notificationQueue.length > 0 && !currentNotification) {
      const nextNotification = notificationQueue[0];
      console.log("🎯 Affichage notification:", nextNotification.id);
      setCurrentNotification(nextNotification);
      setNotificationQueue((prev) => prev.slice(1));
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
    achievements: ACHIEVEMENTS,
  };
};

export default useAchievementNotifications;
