import React from 'react';
import { useAchievementContext } from './AchievementContext';

const TestNotifications = () => {
  const { addAchievement, resetAchievements } = useAchievementContext();

  const testAchievements = [
    {
      id: 'test_common',
      title: 'Test Commun',
      description: 'Ceci est un test de notification commune',
      icon: '🎯',
      rarity: 'common',
      first_discovery: true
    },
    {
      id: 'test_rare',
      title: 'Test Rare',
      description: 'Ceci est un test de notification rare',
      icon: '💎',
      rarity: 'rare',
      first_discovery: true
    },
    {
      id: 'test_epic',
      title: 'Test Épique',
      description: 'Ceci est un test de notification épique',
      icon: '⚡',
      rarity: 'epic',
      first_discovery: true
    },
    {
      id: 'test_legendary',
      title: 'Test Légendaire',
      description: 'Ceci est un test de notification légendaire',
      icon: '👑',
      rarity: 'legendary',
      first_discovery: true
    }
  ];

  const handleTestNotification = (achievement) => {
    console.log('🧪 Test notification:', achievement);
    addAchievement(achievement);
  };

  const handleResetAll = () => {
    console.log('🔄 Reset des achievements');
    resetAchievements();
  };

  const handleTestSequence = () => {
    console.log('🎬 Démarrage séquence de test');
    testAchievements.forEach((achievement, index) => {
      setTimeout(() => {
        handleTestNotification(achievement);
      }, index * 4000); // 4 secondes entre chaque notification
    });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      zIndex: '1000000000',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>🧪 Test Notifications</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {testAchievements.map((achievement) => (
          <button
            key={achievement.id}
            onClick={() => handleTestNotification(achievement)}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: achievement.rarity === 'common' ? '#28a745' :
                         achievement.rarity === 'rare' ? '#007bff' :
                         achievement.rarity === 'epic' ? '#6f42c1' : '#ffc107',
              color: achievement.rarity === 'legendary' ? '#000' : '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {achievement.icon} {achievement.title}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        <button
          onClick={handleTestSequence}
          style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            background: '#17a2b8',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            flex: 1
          }}
        >
          🎬 Séquence
        </button>
        
        <button
          onClick={handleResetAll}
          style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            background: '#dc3545',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            flex: 1
          }}
        >
          🔄 Reset
        </button>
      </div>

      <div style={{ fontSize: '10px', color: '#ccc', marginTop: '4px' }}>
        Ouvrez la console pour voir les logs
      </div>
    </div>
  );
};

export default TestNotifications;