import React, { useEffect } from 'react';
import AchievementNotification from './AchievementNotification';
import { useAchievementNotifications } from './useAchievementNotifications';

const AchievementNotificationProvider = ({ player, minigameResults = [], children }) => {
  const {
    currentNotification,
    checkAchievements,
    handleNotificationClose
  } = useAchievementNotifications();

  // Vérifier les achievements quand le player ou les minigameResults changent
  useEffect(() => {
    if (player) {
      checkAchievements(player, minigameResults);
    }
  }, [player, minigameResults, checkAchievements]);

  return (
    <>
      {children}
      
      {/* Notification popup globale */}
      <AchievementNotification 
        achievement={currentNotification}
        onClose={handleNotificationClose}
      />
    </>
  );
};

export default AchievementNotificationProvider;