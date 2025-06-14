export const MAP_POSITIONS = {
  // France - Europe occidentale (sur le continent européen)

  france: {
    x: 415, // Europe occidentale
    y: 380,
    continent: "europe",
    region: "Europe occidentale",
    country: "France",
  },

  fidji: {
    x: 780, // Pacifique Sud-Ouest
    y: 480,
    continent: "oceania",
    region: "Mélanésie",
    country: "Fidji",
  },

  tahiti: {
    x: 70, // Pacifique Sud-Est
    y: 450,
    continent: "oceania",
    region: "Polynésie",
    country: "Polynésie française",
  },
  tanzania: {
    x: 520, // Ocean Indien
    y: 520,
    continent: "afrique",
    region: "afrique",
    country: "Tanzanie",
  },

  brazil: {
    x: 280, // Amérique du Sud
    y: 520,
    continent: "south-america",
    region: "Amérique du Sud",
    country: "Brésil",
  },

  japan: {
    x: 680, // Asie de l'Est
    y: 220,
    continent: "asia",
    region: "Asie de l'Est",
    country: "Japon",
  },

  egypt: {
    x: 450, // Afrique du Nord
    y: 280,
    continent: "africa",
    region: "Afrique du Nord",
    country: "Égypte",
  },

  australia: {
    x: 650, // Océanie
    y: 580,
    continent: "oceania",
    region: "Océanie",
    country: "Australie",
  },
};

// Fonction utilitaire pour obtenir les coordonnées d'une destination
export const getDestinationCoordinates = (destinationId) => {
  const position = MAP_POSITIONS[destinationId];
  if (!position) {
    console.warn(`Position non trouvée pour la destination: ${destinationId}`);
    return { x: 500, y: 250 }; // Position par défaut au centre
  }
  return { x: position.x, y: position.y };
};

// Fonction pour obtenir toutes les destinations d'un continent
export const getDestinationsByContinent = (continent) => {
  return Object.entries(MAP_POSITIONS)
    .filter(([_, position]) => position.continent === continent)
    .map(([id, position]) => ({ id, ...position }));
};

// Fonction pour calculer la distance entre deux destinations (en "kilomètres" fictifs)
export const calculateDistance = (destination1Id, destination2Id) => {
  const pos1 = MAP_POSITIONS[destination1Id];
  const pos2 = MAP_POSITIONS[destination2Id];

  if (!pos1 || !pos2) {
    return 0;
  }

  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;

  // Distance euclidienne convertie en "kilomètres" fictifs
  // Facteur de conversion pour rendre les distances plus réalistes
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 15);
};

// Informations détaillées sur les continents avec coordonnées de centre
export const CONTINENT_INFO = {
  europe: {
    name: "Europe",
    emoji: "🇪🇺",
    color: "#228B22",
    description: "Le vieux continent aux mille merveilles",
    center: { x: 520, y: 130 },
    destinations: ["france", "italie"],
  },
  asia: {
    name: "Asie",
    emoji: "🇨🇳",
    color: "#32CD32",
    description: "Le continent des traditions millénaires",
    center: { x: 750, y: 200 },
    destinations: ["thailande"],
  },
  america: {
    name: "Amérique",
    emoji: "🌎",
    color: "#2E8B57",
    description: "Le nouveau monde aux paysages grandioses",
    center: { x: 200, y: 240 },
    destinations: ["mexique", "brazil"],
  },
  oceania: {
    name: "Océanie",
    emoji: "🇦🇺",
    color: "#8FBC8F",
    description: "Les îles paradisiaques du Pacifique",
    center: { x: 850, y: 350 },
    destinations: ["fidji", "tahiti"],
  },
  africa: {
    name: "Afrique",
    emoji: "🌍",
    color: "#9ACD32",
    description: "Le berceau de l'humanité",
    center: { x: 520, y: 300 },
    destinations: [],
  },
};

// Fonction pour obtenir les informations d'un continent
export const getContinentInfo = (continentId) => {
  return (
    CONTINENT_INFO[continentId] || {
      name: "Inconnu",
      emoji: "🌍",
      color: "#666666",
      description: "Continent mystérieux",
      center: { x: 500, y: 250 },
      destinations: [],
    }
  );
};

// Validation des positions sur la nouvelle carte
export const validatePositions = () => {
  const errors = [];

  Object.entries(MAP_POSITIONS).forEach(([id, position]) => {
    if (!position.x || !position.y) {
      errors.push(`Position manquante pour ${id}`);
    }

    // Nouvelles limites pour la carte 1000x500
    if (position.x < 0 || position.x > 1000) {
      errors.push(`Position X invalide pour ${id}: ${position.x}`);
    }

    if (position.y < 0 || position.y > 500) {
      errors.push(`Position Y invalide pour ${id}: ${position.y}`);
    }

    if (!position.continent) {
      errors.push(`Continent manquant pour ${id}`);
    }

    // Vérifier que les destinations sont bien sur les continents
    const continentInfo = CONTINENT_INFO[position.continent];
    if (continentInfo && !continentInfo.destinations.includes(id)) {
      console.warn(
        `${id} n'est pas listé dans les destinations de ${position.continent}`
      );
    }
  });

  if (errors.length > 0) {
    console.warn("Erreurs de validation des positions:", errors);
  }

  return errors.length === 0;
};

// Fonction pour obtenir les destinations proches d'un point
export const getNearbyDestinations = (x, y, radius = 100) => {
  return Object.entries(MAP_POSITIONS)
    .filter(([_, position]) => {
      const distance = Math.sqrt(
        Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2)
      );
      return distance <= radius;
    })
    .map(([id, position]) => ({ id, ...position }));
};

// Fonction pour calculer le centre géographique des destinations visitées
export const calculateTravelCenter = (visitedDestinations) => {
  if (!visitedDestinations || visitedDestinations.length === 0) {
    return { x: 500, y: 250 }; // Centre de la carte
  }

  const positions = visitedDestinations
    .map((id) => MAP_POSITIONS[id])
    .filter(Boolean);

  if (positions.length === 0) {
    return { x: 500, y: 250 };
  }

  const centerX =
    positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
  const centerY =
    positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;

  return { x: Math.round(centerX), y: Math.round(centerY) };
};

// Initialisation et validation au chargement
if (typeof window !== "undefined") {
  // Valider les positions au chargement
  validatePositions();

  // Log des informations de debug
  console.log("🗺️ Nouvelle carte mondiale chargée");
  console.log(
    "📍 Positions des destinations:",
    Object.keys(MAP_POSITIONS).length,
    "destinations"
  );
  console.log("🌍 Continents disponibles:", Object.keys(CONTINENT_INFO));

  // Vérifier que toutes les destinations sont bien positionnées sur les continents
  Object.entries(MAP_POSITIONS).forEach(([id, position]) => {
    console.log(
      `📍 ${id}: (${position.x}, ${position.y}) sur ${position.continent}`
    );
  });
}
