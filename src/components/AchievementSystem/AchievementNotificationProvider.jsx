import React, { useState, useCallback, useEffect } from 'react';
import AchievementContext from './AchievementContext';
import AchievementNotification from './AchievementNotification';
import { ACHIEVEMENTS } from '../../data/achievements';

const AchievementNotificationProvider = ({ children, player, minigameResults }) => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const cleanupStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('playerAchievements');
      if (stored && !Array.isArray(JSON.parse(stored))) {
        localStorage.removeItem('playerAchievements');
      }
    } catch (error) {
      localStorage.removeItem('playerAchievements');
    }
  }, []);

  const getSavedAchievements = useCallback(() => {
    try {
      const saved = localStorage.getItem('playerAchievements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const saveAchievement = useCallback((achievementId) => {
    try {
      const saved = getSavedAchievements();
      if (!saved.includes(achievementId)) {
        const updated = [...saved, achievementId];
        localStorage.setItem('playerAchievements', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  }, [getSavedAchievements]);

  const addToQueue = useCallback((achievement) => {
    setNotificationQueue(prev => {
      if (!prev.find(a => a.id === achievement.id)) {
        return [...prev, achievement];
      }
      return prev;
    });
  }, []);

  const processQueue = useCallback(() => {
    if (isProcessing || currentNotification || notificationQueue.length === 0) {
      return;
    }

    const nextNotification = notificationQueue[0];
    setNotificationQueue(prev => prev.slice(1));
    setCurrentNotification(nextNotification);
    setIsProcessing(true);
  }, [isProcessing, currentNotification, notificationQueue]);

  const closeNotification = useCallback(() => {
    setCurrentNotification(null);
    setIsProcessing(false);
  }, []);

  const checkAchievements = useCallback((player, minigameResults = []) => {
    cleanupStorage();
    const savedAchievements = getSavedAchievements();
    const unlockedAchievements = ACHIEVEMENTS.filter(achievement => {
      try {
        return achievement.condition(player, minigameResults);
      } catch (error) {
        console.error('Error in achievement condition:', achievement.id, error);
        return false;
      }
    });

    const newAchievements = unlockedAchievements.filter(
      achievement => !savedAchievements.includes(achievement.id)
    );

    newAchievements.forEach(achievement => {
      saveAchievement(achievement.id);
      addToQueue(achievement);
    });

    return unlockedAchievements;
  }, [cleanupStorage, getSavedAchievements, saveAchievement, addToQueue]);

  const triggerAchievement = useCallback((achievementId) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievement) {
      addToQueue(achievement);
    }
  }, [addToQueue]);

  useEffect(() => {
    if (player) {
      checkAchievements(player, minigameResults);
    }
  }, [player, minigameResults, checkAchievements]);

  useEffect(() => {
    processQueue();
  }, [notificationQueue, isProcessing, currentNotification, processQueue]);

  const contextValue = {
    currentNotification,
    notificationQueue,
    checkAchievements,
    closeNotification,
    triggerAchievement,
    queueLength: notificationQueue.length,
  };

  return (
    <AchievementContext.Provider value={contextValue}>
      {children}
      {currentNotification && (
        <AchievementNotification
          achievement={currentNotification}
          onClose={closeNotification}
          queueLength={notificationQueue.length}
        />
      )}
    </AchievementContext.Provider>
  );
};

export default AchievementNotificationProvider;