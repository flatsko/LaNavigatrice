import { useEffect } from 'react';
import AchievementNotification from './AchievementNotification';
import { useAchievementNotifications } from './useAchievementNotifications';

const AchievementNotificationProvider = ({ player, children }) => {
  const {
    currentNotification,
    checkAchievements,
    handleNotificationClose
  } = useAchievementNotifications();

  // Vérifier les achievements quand le player change
  useEffect(() => {
    if (player) {
      checkAchievements(player);
    }
  }, [player, checkAchievements]);

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