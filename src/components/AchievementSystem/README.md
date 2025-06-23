# Système de Notifications d'Achievements

Ce système permet d'afficher des popups élégantes quand un joueur débloque un nouvel exploit dans le jeu.

## Composants

### 1. AchievementNotification
Composant de popup qui affiche une notification animée quand un achievement est débloqué.

**Fonctionnalités :**
- Animation d'entrée et de sortie fluide
- Styles différents selon la rareté (commun, rare, épique, légendaire)
- Auto-fermeture après 5 secondes
- Effets visuels (particules, brillances)
- Responsive design

### 2. AchievementNotificationProvider
Provider global qui surveille automatiquement les achievements et déclenche les notifications.

**Usage :**
```jsx
import { AchievementNotificationProvider } from './components/AchievementSystem';

function App() {
  return (
    <AchievementNotificationProvider player={currentPlayer}>
      {/* Votre application */}
    </AchievementNotificationProvider>
  );
}
```

### 3. useAchievementNotifications
Hook personnalisé pour gérer les notifications d'achievements.

**Usage :**
```jsx
import { useAchievementNotifications } from './components/AchievementSystem';

function MyComponent() {
  const { 
    currentNotification, 
    checkAchievements, 
    triggerNotification,
    handleNotificationClose 
  } = useAchievementNotifications();

  // Déclencher manuellement une notification
  const handleSpecialEvent = () => {
    triggerNotification('speed_demon');
  };

  return (
    <div>
      {/* Votre composant */}
      <AchievementNotification 
        achievement={currentNotification}
        onClose={handleNotificationClose}
      />
    </div>
  );
}
```

## Types d'Achievements

### Raretés disponibles :
- **common** (vert) - Achievements de base
- **rare** (bleu) - Achievements moyennement difficiles
- **epic** (violet) - Achievements difficiles
- **legendary** (or) - Achievements très rares avec effets spéciaux

### Achievements actuels :
1. **Premier Explorateur** (commun) - Découvrir la première destination
2. **Photographe Aventurier** (rare) - Prendre 3 photos
3. **Navigateur Parfait** (épique) - Résoudre 3 énigmes sans erreur
4. **Éclair des Mers** (légendaire) - Résoudre une énigme en moins de 30s
5. **Chasseur de Trésor Légendaire** (légendaire) - Compléter toutes les destinations

## Personnalisation

### Ajouter un nouvel achievement :
```javascript
// Dans useAchievementNotifications.js
const NEW_ACHIEVEMENT = {
  id: "mon_achievement",
  title: "Titre de l'Achievement",
  description: "Description de ce qu'il faut faire",
  icon: "🎯", // Emoji ou icône
  condition: (player) => {
    // Logique pour vérifier si l'achievement est débloqué
    return player.someCondition >= 10;
  },
  rarity: "epic" // common, rare, epic, legendary
};
```

### Personnaliser les styles :
Modifiez `AchievementNotification.css` pour ajuster :
- Couleurs par rareté
- Animations
- Taille et position
- Effets visuels

## Intégration

Le système est déjà intégré dans l'application principale via le `AchievementNotificationProvider` dans `App.jsx`. Les notifications apparaîtront automatiquement quand :

1. Le joueur complète une énigme
2. Le joueur prend des photos
3. Le joueur atteint certains objectifs

## Fonctionnalités avancées

### Queue de notifications
Si plusieurs achievements sont débloqués simultanément, ils sont mis en queue et affichés un par un.

### Persistance
Les achievements débloqués sont sauvegardés dans le localStorage pour éviter les doublons.

### Responsive
Les notifications s'adaptent automatiquement aux écrans mobiles et desktop.

### Accessibilité
- Support du clavier (Échap pour fermer)
- Contrastes respectés
- Animations réduites si préféré par l'utilisateur