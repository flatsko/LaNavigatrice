import { MAP_POSITIONS } from "./mapPositions";

export const ENIGMAS = [
  {
    id: "perou",
    title: "Pérou 🇵🇪",
    flag: "🇵🇪",
    qrCode: "INCA",
    coordinates: MAP_POSITIONS.perou,
    image: "/images/perou.JPEG",
    successImage: "/images/perou.JPEG",
    question:
      "Perchée dans les nuages andins, cette citadelle inca où le Capitaine a gravi les terrasses sacrées culmine à quelle altitude ?",
    answers: ["2 430 mètres", "3 200 mètres", "1 980 mètres", "2 850 mètres"],
    correctAnswer: "2 430 mètres",
    indice: "Cette altitude correspond à celle du célèbre site archéologique du Machu Picchu, situé dans la cordillère des Andes.",
    funFact:
      "Le célèbre Chemin de l'Inca demande 3 jours de trek épique... mais notre Capitaine a préféré l'élégance du train panoramique ! Après tout, pourquoi marcher quand on peut prendre le train ? 🚂⚓ ",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo sauté, comme si vous vouliez atteindre les sommets sacrés des Andes !",
  },
  {
    id: "argentine",
    title: "Argentine 🇦🇷",
    flag: "🇦🇷",
    qrCode: "TANGO",
    coordinates: MAP_POSITIONS.argentine,
    image: "/images/argentine.JPEG",
    successImage: "/images/argentine.JPEG",
    question:
      "À El Calafate, le Capitaine a contemplé ce mur de glace de 60 mètres de haut qui gronde et craque jour et nuit. Ce glacier de Patagonie porte le nom d'un explorateur argentin...",
    answers: [
      "Almirante Brown",
      "San Martín",
      "Perito Moreno",
      "López Castelo",
    ],
    correctAnswer: "Perito Moreno",
    indice: "Cet explorateur était un géographe et naturaliste qui a donné son nom au parc national où se trouve ce glacier.",
    funFact:
      "Le glacier Perito Moreno est l'un des rares glaciers au monde qui continue de croître ! Elle a eu la chance d'avoir un morceau qui s'est détaché et est tombé devant elle.",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo de groupe avec les bras écartés comme si vous accueilliez la chute d'un iceberg, face au paysage !",
  },
  {
    id: "fidji",
    title: "Fidji 🇫🇯",
    flag: "🇫🇯",
    qrCode: "BULA",
    coordinates: MAP_POSITIONS.fidji,
    image: "/images/fidji.JPEG",
    successImage: "/images/fidji.JPEG",
    question: "Comment s'appelle l'épice que vous avez sous le nez ?",
    answers: ["Taro", "Kava", "Yaqona", "Bilo"],
    correctAnswer: "Kava",
    indice: "Cette racine est traditionnellement utilisée pour préparer une boisson cérémonielle dans le Pacifique Sud.",
    funFact:
      "Cette poudre de racine est utilisée pour faire une boisson relaxante, Alison en a horreur",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo de l'un de vous en train de boire un bol de Kava",
  },
  {
    id: "vanuatu",
    title: "Vanuatu 🇻🇺",
    flag: "🇻🇺",
    qrCode: "VOLC",
    coordinates: MAP_POSITIONS.vanuatu,
    image: "/images/vanuatu.JPEG",
    successImage: "/images/vanuatu.JPEG",
    question:
      "Dans cet archipel volcanique du Pacifique Sud où le Capitaine a exploré les récifs coralliens, quelle langue créole est parlée aux côtés du français et de l'anglais ?",
    answers: ["Bislama", "Tok Pisin", "Pijin", "Beach-la-Mar"],
    correctAnswer: "Bislama",
    indice: "Cette langue créole tire son nom de 'beach-la-mar', une déformation de 'bêche-de-mer', et signifie 'langue du marché'.",
    funFact:
      "Piège ! Tok Pisin est parlé en Papouasie-Nouvelle-Guinée, Pijin aux Îles Salomon, et Beach-la-Mar était l'ancien nom du Bislama ! Cette langue créole signifie littéralement 'langue du marché' et permet aux 100+ tribus de communiquer !",
    hasPhoto: true,
    photoPrompt: "Prenez une photo en imitant une tribu hostile",
  },
  {
    id: "tahiti",
    title: "Tahiti 🇵🇫",
    flag: "🇵🇫",
    qrCode: "MANA",
    coordinates: MAP_POSITIONS.tahiti,
    image: "/images/tahiti.JPEG",
    successImage: "/images/tahiti.JPEG",
    question:
      "Deux invités se présentent ce soir ont été rencontrés sur l'archipel des Tuamotu, mais sur quelle île précisément ?",
    answers: ["Bora Bora", "Tikehau", "Rurutu", "Raiatea"],
    correctAnswer: "Tikehau",
    indice: "Parmi ces îles, une seule fait partie de l'archipel des Tuamotu, les autres appartiennent aux îles de la Société ou aux Australes.",
    funFact: "De cette liste une seule île fait partie des Tuamotu : Tikehau.",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo de l'équipe en imitant la nage avec les raies manta - allongez-vous et 'nagez' gracieusement près de l'eau !",
  },

  {
    id: "brazil",
    title: "Brésil 🇧🇷",
    flag: "🇧🇷",
    qrCode: "SAMBA",
    coordinates: MAP_POSITIONS.brazil,
    image: "/images/bresil.JPEG",
    successImage: "/images/bresil.JPEG",
    question: "Comment s'appellent les chutes d'eau derrière le capitaine ?",
    answers: [
      "Chutes d'Iguazu",
      "Chutes de Kaieteur",
      "Salto del Tequendama",
      "Chutes de Gocta",
    ],
    correctAnswer: "Chutes d'Iguazu",
    indice: "Ces chutes spectaculaires se trouvent à la frontière entre l'Argentine et le Brésil, et leur nom signifie 'grandes eaux' en guarani.",
    funFact:
      "Les chutes d'Iguazu sont situées sur la frontière entre l'Argentine et le Brésil. Un moment incroyable passé là-bas. Leur nom provient du mot guarani 'Iguazú' qui signifie 'grandes eaux'.",
    hasPhoto: true,
    photoPrompt:
      "Prenez une photo spectaculaire, vous vous souvenez des cours d'acrogym ? ",
  },
  {
    id: "tanzania",
    title: "Tanzanie 🇹🇿",
    flag: "🇹🇿",
    qrCode: "SIMBA",
    coordinates: MAP_POSITIONS.tanzania,
    image: "/images/zanzibar.JPEG",
    successImage: "/images/zanzibar.JPEG",
    question:
      "Quel âge avait notre capitaine quand il a visité la Tanzanie ? Marius avait 2 ans.",
    answers: ["40 ans", "37 ans", "35 ans", "36 ans"],
    correctAnswer: "37 ans",
    indice: "Si Marius avait 2 ans lors de ce voyage, calculez l'âge du capitaine en fonction de leur différence d'âge.",
    funFact: "",
    hasPhoto: true,
    photoPrompt:
      "Formez une chaîne d'éléphants avec votre équipe en file indienne.",
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
