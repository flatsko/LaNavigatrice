import React, { createContext, useContext } from 'react';

const AchievementContext = createContext(null);

export const useAchievementContext = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievementContext must be used within an AchievementNotificationProvider');
  }
  return context;
};

export default AchievementContext;