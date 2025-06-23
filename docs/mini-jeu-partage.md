# Mini-Jeu de Partage - "Esprit de Partage"

## Description

Le mini-jeu "Esprit de Partage" est un défi social basé sur le gage : "Que serait un bon mousse sans l'esprit de partage ? Allez chercher une boisson pour chaque membre d'une équipe adverse et apportez-leur".

## Fonctionnement

### Déclenchement
- Le mini-jeu se déclenche aléatoirement après la résolution d'une énigme
- Probabilité de déclenchement :
  - 40% de base
  - 60% si 4 énigmes ou moins restantes
  - 80% si 2 énigmes ou moins restantes
  - 100% à la dernière énigme si aucun mini-jeu n'a été déclenché

### Étapes du jeu

1. **Instructions** : Présentation de la mission
   - Repérer une équipe adverse
   - Aller chercher des boissons
   - Les apporter avec le sourire
   - Prendre une photo de validation

2. **Mission en cours** : Le joueur accomplit le gage
   - Timer de 10 minutes pour accomplir la mission
   - Possibilité de passer le gage (0 points)

3. **Validation par photo** : Confirmation de l'accomplissement
   - Photo avec l'équipe adverse
   - Boissons visibles
   - Tout le monde souriant

### Système de points

- **Score de base** : 1000 points
- **Bonus temps** : 5 points par seconde restante
- **Score maximum** : ~4000 points (si accompli rapidement)
- **Échec/Abandon** : 0 points

## Validation du gage

### Méthodes de validation possibles

1. **Photo de validation** (implémentée)
   - Simulation de prise de photo
   - Dans un vrai contexte, utiliserait l'appareil photo du dispositif

2. **Validation par témoin** (à implémenter)
   - Un membre de l'équipe adverse confirme
   - Code de validation fourni par l'organisateur

3. **Géolocalisation** (à implémenter)
   - Vérifier la proximité avec d'autres équipes
   - Confirmer le déplacement du joueur

4. **Validation manuelle** (à implémenter)
   - Un organisateur valide manuellement
   - Système de codes ou QR codes spéciaux

## Améliorations possibles

### Techniques
- Intégration de l'appareil photo réel
- Reconnaissance d'image pour valider automatiquement
- Géolocalisation pour vérifier les déplacements
- Système de codes de validation partagés entre équipes

### Gameplay
- Différents types de gages selon le contexte
- Niveaux de difficulté variables
- Récompenses spéciales pour les gages accomplis
- Système de réputation basé sur l'esprit de partage

### Social
- Galerie des photos de partage
- Classement de l'esprit d'équipe
- Badges spéciaux pour les actions de partage
- Historique des interactions entre équipes

## Considérations de sécurité

- Vérifier que les gages restent appropriés et sécurisés
- Éviter les situations potentiellement dangereuses
- Respecter les règles du lieu de jeu
- Maintenir un esprit de fair-play et de respect

## Code technique

### Fichiers impliqués
- `SharingGameCard.jsx` : Composant principal du mini-jeu
- `MiniGames.css` : Styles spécifiques (section `.sharing-game-card`)
- `App.jsx` : Intégration dans l'application principale

### États gérés
- `validationStep` : Étape actuelle (instructions, photo, completed)
- `photoTaken` : Statut de la photo de validation
- `timeLeft` : Temps restant pour accomplir le gage
- `score` : Points gagnés

### Fonctions principales
- `handleStartMission()` : Lance la mission
- `handleTakePhoto()` : Simule la prise de photo
- `handleTimeUp()` : Gère l'expiration du temps
- `handleSkip()` : Permet de passer le gage