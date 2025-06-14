import { MAP_POSITIONS } from "./mapPositions";

export const ENIGMAS = [
  {
    id: "france",
    title: "France 🇫🇷",
    flag: "🇫🇷",
    qrCode: "ENIGMA_FRANCE",
    coordinates: MAP_POSITIONS.france,
    image: "/images/bresil.JPEG",
    question: "En quelle année la Tour Eiffel a-t-elle été inaugurée ?",
    answers: ["1887", "1889", "1891", "1893"],
    correctAnswer: "1889",
    funFact:
      "La Tour Eiffel fut inaugurée le 31 mars 1889 pour l'Exposition universelle. Initialement critiquée, elle devait être démontée en 1909 mais fut sauvée grâce à son utilité comme antenne radio !",
  },
  {
    id: "fidji",
    title: "Fidji 🇫🇯",
    flag: "🇫🇯",
    qrCode: "ENIGMA_FIDJI",
    coordinates: MAP_POSITIONS.fidji,
    image: "/images/fidji.JPEG",
    question: "Que représente cette photo pour le capitaine?",
    answers: [
      "Une rencontre avec un guide local",
      "Son premier voyage en solo",
      "Le jour où nous nous sommes mis ensemble",
      "Son retour après un long voyage",
    ],
    correctAnswer: "Le jour où nous nous sommes mis ensemble",
    funFact: "Ce cliché immortalise le début de notre grande aventure à deux !",
  },
  {
    id: "tahiti",
    title: "Tahiti 🇵🇫",
    flag: "🇵🇫",
    qrCode: "ENIGMA_TAHITI",
    coordinates: MAP_POSITIONS.tahiti,
    image: "/images/tahiti.JPEG",
    question: "Comment s'appelle l'animal sur la photo ?",
    answers: [
      "Raie manta",
      "Requin baleine",
      "Raie pastenague",
      "Tortue de mer",
    ],
    correctAnswer: "Raie manta",
    funFact:
      "Un moment magique de notre que notre captaine a partagé avec ces Raies Manta",
  },

  {
    id: "brazil",
    title: "Brésil 🇧🇷",
    flag: "🇧🇷",
    qrCode: "ENIGMA_BRAZIL",
    coordinates: MAP_POSITIONS.brazil,
    image: "/images/bresil.JPEG",
    question: "Comment s'apellent les chuttes d'eau derrière le capitaine ?",
    answers: [
      "Chutes d'Iguazu",
      "Chutes de Kaieteur",
      "Salto del Tequendama",
      "Chutes de Gocta",
    ],
    correctAnswer: "Chutes d'Iguazu",
    funFact:
      "Les chutes d'Iguazu sont situées sur la frontière entre l'Argentine et le Brésil. Un moment passé incroyable. Leur nom provient de l'espèce d'araignée Iguana, qui se trouve dans la région.",
  },
];

// Message final révélé quand tous les fragments sont collectés
export const FINAL_TREASURE_MESSAGE = `🏴‍☠️ FÉLICITATIONS BRAVE MATELOT ! 🏴‍☠️

Tu as rassemblé tous les fragments de la carte du trésor !

"Le trésor se cache où les marées dansent avec la lune pleine,
sous l'étoile du berger, dans la grotte aux mille échos,
là où le soleil embrasse la mer, au cœur de l'île aux perles,
attend le capitaine courageux !"

🗺️ La carte complète révèle : 

Le trésor du Capitaine Alison se trouve dans SON CŒUR ! 💝

Car le plus grand trésor, ce sont les aventures partagées 
et les souvenirs créés avec ses fidèles compagnons d'équipage !

⚓ Bon anniversaire Capitaine Alison ! ⚓

🎁 Direction : [LIEU DE LA FÊTE] pour récupérer ton véritable trésor !

P.S. : N'oublie pas de montrer cette victoire aux organisateurs 
pour réclamer ta récompense de pirate accompli ! 🏆`;

export const getEnigmaByQR = (qrCode) => {
  return enigmas.find((enigma) => enigma.qrCode === qrCode);
};
