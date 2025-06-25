# Système de Points - La Navigatrice

## Vue d'ensemble

Le système de points a été entièrement revu pour offrir un équilibrage cohérent et motivant. Le score total maximum théorique est d'environ **4000 points**.

## Structure des Points

### 1. Énigmes (800-1200 points)
- **Points de base** : 200 points par énigme (4 énigmes × 200 = 800 points)
- **Bonus parfait** : +100 points par énigme résolue en 1 tentative
- **Pénalité** : -50 points par tentative supplémentaire
- **Maximum possible** : 1200 points (4 énigmes parfaites)

### 2. Mini-jeux (600-1200 points)
- **Points de base** : 150 points par mini-jeu
- **Bonus temporel** : Multiplicateur basé sur le temps restant
- **Pénalité d'abandon** : -50 points si sauté
- **Maximum possible** : ~1200 points (avec bonus temporels)

### 3. Quiz Final (200-600 points)
- **Bonus Parfait** (100%) : 600 points
- **Bonus Excellent** (≥80%) : 400 points
- **Bonus Bon** (≥60%) : 200 points
- **Bonus Passable** (≥40%) : 100 points
- **Échec** (<40%) : 0 point

### 4. Trophées/Achievements (50-500 points)
- **Commun** : 50 points
- **Rare** : 100 points
- **Épique** : 200 points
- **Légendaire** : 500 points

### 5. Bonus Temporel (0-400 points)
- **Temps cible** : 40 minutes
- **Bonus maximum** : 400 points (si terminé très rapidement)
- **Calcul** : Bonus = 400 × (1 - temps_utilisé/temps_cible)
- **Plafond** : Le bonus ne peut pas dépasser 400 points

## Rangs et Seuils

| Rang | Seuil | Description |
|------|-------|-------------|
| 🐚 Mousse | 0-499 | À l'abordage ! |
| 🌊 Apprenti Marin | 500-999 | Premiers pas |
| 🗺️ Explorateur | 1000-1499 | Début prometteur |
| ⛵ Marin Confirmé | 1500-1999 | Bon navigateur |
| 🧭 Navigateur Émérite | 2000-2599 | Très bon niveau |
| ⚓ Capitaine Expérimenté | 2600-3199 | Maîtrise confirmée |
| 👑 Amiral des Sept Mers | 3200-3999 | Excellence remarquable |
| 🏆 Légende Maritime | 4000+ | Perfection absolue |

## Stratégies pour Maximiser le Score

### 🎯 Priorité Haute
1. **Résoudre toutes les énigmes en 1 tentative** (+400 points de bonus)
2. **Terminer sous 40 minutes** (bonus temporel maximum)
3. **Réussir parfaitement le quiz final** (+600 points)

### 🎮 Priorité Moyenne
4. **Exceller dans les mini-jeux** (viser les bonus temporels)
5. **Débloquer les trophées rares/épiques**

### ⚡ Conseils d'Optimisation
- **Gestion du temps** : Équilibrer vitesse et précision
- **Préparation** : Bien lire les indices avant de répondre
- **Mini-jeux** : Ne pas les négliger, ils rapportent beaucoup
- **Quiz final** : Réviser les découvertes avant le quiz

## Équilibrage et Cohérence

### Principes de Design
- **Progression linéaire** : Chaque activité contribue significativement
- **Récompense de la maîtrise** : Bonus importants pour la perfection
- **Tolérance aux erreurs** : Possibilité de compenser les échecs
- **Motivation continue** : Objectifs atteignables à tous niveaux

### Répartition Idéale du Score
- **40%** : Énigmes et précision
- **30%** : Mini-jeux et habileté
- **20%** : Quiz final et connaissances
- **10%** : Bonus temporel et trophées

## Fichiers Techniques

- `src/utils/pointsSystem.js` : Logique principale du système
- `src/utils/scoring.jsx` : Fonctions de validation et calculs
- `src/utils/achievements.js` : Définition des trophées

---

*Système mis à jour pour garantir une expérience équilibrée et motivante pour tous les joueurs.*