import React, { useState, useEffect, useCallback } from "react";
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
      setNotificationQueue((prev) => [...prev, ...newlyUnlocked]);
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
    if (notificationQueue.length > 0 && !currentNotification) {
      const nextNotification = notificationQueue[0];
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
