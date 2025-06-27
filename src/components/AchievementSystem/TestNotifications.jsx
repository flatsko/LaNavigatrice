import React from 'react';
import { useAchievementContext } from './AchievementContext';

const TestNotifications = () => {
  const { addAchievement, resetAchievements } = useAchievementContext();

  const testAchievements = [
    {
      id: 'test_mousse',
      title: 'Test Mousse',
      description: 'Ceci est un test de notification mousse',
      icon: '🎯',
      rarity: 'mousse',
      first_discovery: true
    },
    {
      id: 'test_matelot',
      title: 'Test Matelot',
      description: 'Ceci est un test de notification matelot',
      icon: '💎',
      rarity: 'matelot',
      first_discovery: true
    },
    {
      id: 'test_capitaine',
      title: 'Test Capitaine',
      description: 'Ceci est un test de notification capitaine',
      icon: '⚡',
      rarity: 'capitaine',
      first_discovery: true
    },
    {
      id: 'test_amiral',
      title: 'Test Amiral',
      description: 'Ceci est un test de notification amiral',
      icon: '👑',
      rarity: 'amiral',
      first_discovery: true
    },
    {
      id: 'test_legende',
      title: 'Test Légende',
      description: 'Ceci est un test de notification légendaire',
      icon: '🌟',
      rarity: 'legende',
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
              background: achievement.rarity === 'mousse' ? '#95A5A6' :
                   achievement.rarity === 'matelot' ? '#3498DB' :
                   achievement.rarity === 'capitaine' ? '#9B59B6' :
                   achievement.rarity === 'amiral' ? '#E67E22' : '#FFD700',
        color: '#fff',
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