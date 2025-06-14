// Énigmes pour le thème "D'une page à l'autre" - Voyage Alsace vers Charente-Maritime
import { MAP_POSITIONS } from "./mapPositions";

export const ENIGMAS_ALSACE_CHARENTE = [
  {
    id: "strasbourg",
    title: "Strasbourg 🏰",
    flag: "🇫🇷",
    qrCode: "ENIGMA_STRASBOURG",
    coordinates: MAP_POSITIONS.france, // Réutilisation de la position France
    image: "/images/strasbourg.JPEG",
    question: "Quelle est la spécialité culinaire emblématique de l'Alsace ?",
    answers: ["La choucroute", "La bouillabaisse", "Le cassoulet", "La tartiflette"],
    correctAnswer: "La choucroute",
    funFact:
      "La choucroute alsacienne est un plat traditionnel à base de chou fermenté, accompagné de saucisses et de charcuterie. C'est le symbole de la gastronomie alsacienne !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo avec une pose alsacienne traditionnelle, comme si vous portiez un costume folklorique !",
  },
  {
    id: "colmar",
    title: "Colmar 🍷",
    flag: "🇫🇷",
    qrCode: "ENIGMA_COLMAR",
    coordinates: { x: 420, y: 375 }, // Légèrement décalé de la France
    image: "/images/colmar.JPEG",
    question: "Quel est le surnom de Colmar ?",
    answers: [
      "La Petite Venise",
      "La Perle de l'Alsace",
      "La Capitale du Vin",
      "La Ville des Fleurs"
    ],
    correctAnswer: "La Petite Venise",
    funFact:
      "Colmar est surnommée 'La Petite Venise' en raison de ses canaux pittoresques qui traversent le quartier historique, créant un paysage romantique unique !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo près de l'eau, comme si vous naviguiez dans les canaux de la Petite Venise !",
  },
  {
    id: "route_des_vins",
    title: "Route des Vins 🍇",
    flag: "🇫🇷",
    qrCode: "ENIGMA_ROUTE_VINS",
    coordinates: { x: 425, y: 385 },
    image: "/images/route_vins.JPEG",
    question: "Quel cépage blanc est le plus emblématique de l'Alsace ?",
    answers: ["Le Riesling", "Le Chardonnay", "Le Sauvignon", "Le Pinot Gris"],
    correctAnswer: "Le Riesling",
    funFact:
      "Le Riesling est considéré comme le roi des cépages alsaciens. Il produit des vins blancs secs, fruités et élégants, parfaits pour accompagner la gastronomie locale !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo en levant un verre imaginaire, comme si vous dégustiez un excellent Riesling !",
  },
  {
    id: "paris_etape",
    title: "Paris - Étape 📍",
    flag: "🇫🇷",
    qrCode: "ENIGMA_PARIS_ETAPE",
    coordinates: { x: 410, y: 370 },
    image: "/images/paris_etape.JPEG",
    question: "Que représente Paris dans le voyage d'Alison ?",
    answers: [
      "Sa destination finale",
      "Une étape de transition",
      "Son lieu de naissance",
      "Un simple passage"
    ],
    correctAnswer: "Une étape de transition",
    funFact:
      "Paris représente une étape importante dans le voyage d'Alison, un moment de réflexion avant de poursuivre vers sa nouvelle destination en Charente-Maritime !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo contemplative, comme si vous réfléchissiez à votre avenir depuis un point de vue parisien !",
  },
  {
    id: "poitiers",
    title: "Poitiers 🏛️",
    flag: "🇫🇷",
    qrCode: "ENIGMA_POITIERS",
    coordinates: { x: 390, y: 400 },
    image: "/images/poitiers.JPEG",
    question: "Quelle bataille historique célèbre a eu lieu près de Poitiers ?",
    answers: [
      "La bataille de Poitiers (732)",
      "La bataille d'Azincourt",
      "La bataille de Bouvines",
      "La bataille de Marignan"
    ],
    correctAnswer: "La bataille de Poitiers (732)",
    funFact:
      "La bataille de Poitiers en 732 a vu Charles Martel arrêter l'expansion musulmane en Europe. Cette victoire a marqué l'histoire de France !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo héroïque, comme si vous étiez un chevalier défendant la région !",
  },
  {
    id: "cognac",
    title: "Cognac 🥃",
    flag: "🇫🇷",
    qrCode: "ENIGMA_COGNAC",
    coordinates: { x: 380, y: 420 },
    image: "/images/cognac.JPEG",
    question: "Combien d'années minimum doit vieillir un Cognac VS ?",
    answers: ["2 ans", "3 ans", "5 ans", "10 ans"],
    correctAnswer: "2 ans",
    funFact:
      "Le Cognac VS (Very Special) doit vieillir au minimum 2 ans en fût de chêne. Cette région produit l'une des eaux-de-vie les plus prestigieuses au monde !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo sophistiquée, comme si vous dégustiez un cognac dans un chai traditionnel !",
  },
  {
    id: "la_rochelle",
    title: "La Rochelle ⚓",
    flag: "🇫🇷",
    qrCode: "ENIGMA_LA_ROCHELLE",
    coordinates: { x: 370, y: 430 },
    image: "/images/la_rochelle.JPEG",
    question: "Quel est l'emblème architectural de La Rochelle ?",
    answers: [
      "Les Tours du Vieux-Port",
      "La Cathédrale",
      "Le Château",
      "Les Halles"
    ],
    correctAnswer: "Les Tours du Vieux-Port",
    funFact:
      "Les Tours de La Rochelle (Tour de la Chaîne, Tour Saint-Nicolas et Tour de la Lanterne) gardent l'entrée du Vieux-Port depuis le Moyen Âge !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo maritime, comme si vous arriviez au port après un long voyage !",
  },
  {
    id: "ile_de_re",
    title: "Île de Ré 🚲",
    flag: "🇫🇷",
    qrCode: "ENIGMA_ILE_RE",
    coordinates: { x: 365, y: 425 },
    image: "/images/ile_de_re.JPEG",
    question: "Quel moyen de transport est emblématique de l'Île de Ré ?",
    answers: ["Le vélo", "Le cheval", "Le bateau", "La voiture électrique"],
    correctAnswer: "Le vélo",
    funFact:
      "L'Île de Ré est surnommée 'l'île aux vélos' avec plus de 100 km de pistes cyclables. C'est le moyen de transport privilégié pour découvrir ses villages blancs et ses marais salants !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo dynamique, comme si vous pédaliez joyeusement sur les pistes de l'île !",
  },
  {
    id: "saintes",
    title: "Saintes 🏺",
    flag: "🇫🇷",
    qrCode: "ENIGMA_SAINTES",
    coordinates: { x: 375, y: 415 },
    image: "/images/saintes.JPEG",
    question: "Quelle civilisation antique a laissé des vestiges importants à Saintes ?",
    answers: ["Les Romains", "Les Gaulois", "Les Vikings", "Les Wisigoths"],
    correctAnswer: "Les Romains",
    funFact:
      "Saintes, ancienne Mediolanum Santonum, conserve de magnifiques vestiges romains dont un amphithéâtre et l'Arc de Germanicus. C'était une cité importante de l'Aquitaine romaine !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo majestueuse, comme si vous étiez un empereur romain visitant la cité !",
  },
  {
    id: "nouveau_depart",
    title: "Nouveau Départ 🌅",
    flag: "🇫🇷",
    qrCode: "ENIGMA_NOUVEAU_DEPART",
    coordinates: { x: 360, y: 440 },
    image: "/images/nouveau_depart.JPEG",
    question: "Que symbolise l'arrivée d'Alison en Charente-Maritime ?",
    answers: [
      "Un nouveau chapitre de sa vie",
      "Des vacances temporaires",
      "Un retour aux sources",
      "Une mission professionnelle"
    ],
    correctAnswer: "Un nouveau chapitre de sa vie",
    funFact:
      "L'installation d'Alison en Charente-Maritime marque le début d'une nouvelle aventure, loin de l'Alsace natale mais riche de promesses et de découvertes !",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo pleine d'espoir, les bras ouverts vers l'horizon, comme si vous embrassiez votre nouvelle vie !",
  },
];