// Configuration des thèmes pour l'application

export const THEMES = {
  TOUR_DU_MONDE: {
    id: "tour_du_monde",
    name: "Tour du monde en mer",
    description: "Voyage maritime du Capitaine Alison",
    colors: {
      primary: "#1da1f2",
      primaryDeep: "#0f4c75",
      accent: "#ff6b6b",
      accentSunset: "#ff6b9d",
      gold: "#ffd700",
      pearl: "#f8fafc",
      grayMedium: "#a0aec0",
      success: "#22c55e",
      successLight: "#dcfce7",
      error: "#ef4444",
      errorLight: "#fecaca",
      warning: "#f59e0b",
    },
    gradients: {
      ocean: "linear-gradient(135deg, #1da1f2 0%, #1976d2 50%, #0d47a1 100%)",
      sunset: "linear-gradient(135deg, #ff8a65 0%, #ff7043 50%, #ff5722 100%)",
      treasure:
        "linear-gradient(135deg, #ffd700 0%, #ffc107 50%, #ff8f00 100%)",
      success: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      whatsapp: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
    },
    texts: {
      welcomeTitle: "Bienvenue à bord !",
      welcomeSubtitle: "Voyage Maritime du\nCapitaine Alison",
      welcomeDescription:
        "Une quête extraordinaire vous attend sur les traces du Capitaine Alison, marchez sur ses pas et retracez son voyage pour découvrir sa déstination rêvée ! 🌊",
      formTitle: "📋 Enregistrement de l'équipage",
      shipIcon: "⚓",
      captainName: "Capitaine Alison",
    },
    enigmasFile: "enigmas",
  },

  DUNE_PAGE_A_LAUTRE: {
    id: "dune_page_a_lautre",
    name: "D'une page à l'autre",
    description: "Voyage de l'Alsace vers la Charente-Maritime",
    colors: {
      primary: "#8B7355", // Brun doux comme le livre
      primaryDeep: "#5D4E37", // Brun chocolat
      accent: "#4A90A4", // Bleu océan doux
      accentSunset: "#87CEEB", // Bleu ciel
      gold: "#F4A460", // Sable doré
      pearl: "#FFF8DC", // Blanc cassé comme les pages
      grayMedium: "#A0A0A0", // Gris neutre
      success: "#6B8E23", // Vert olive
      successLight: "#F0F8E8",
      error: "#CD5C5C", // Rouge indien doux
      errorLight: "#FFE4E1",
      warning: "#DEB887", // Beige bois
    },
    gradients: {
      ocean: "linear-gradient(135deg, #8B7355 0%, #A0522D 50%, #5D4E37 100%)", // Gradient livre ouvert
      sunset: "linear-gradient(135deg, #4A90A4 0%, #87CEEB 50%, #B0E0E6 100%)", // Gradient ciel et mer
      treasure:
        "linear-gradient(135deg, #F4A460 0%, #DEB887 50%, #D2B48C 100%)", // Gradient sable et bois
      success: "linear-gradient(135deg, #6B8E23 0%, #9ACD32 100%)", // Gradient nature
      whatsapp: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
    },
    texts: {
      welcomeTitle: "Bienvenue dans l'aventure !",
      welcomeSubtitle: "D'une page à l'autre\nAvec Alison",
      welcomeDescription:
        "Accompagnez Alison dans son voyage de l'Alsace vers la Charente-Maritime ! Découvrez les étapes de cette belle aventure et aidez-la à écrire une nouvelle page de sa vie ! 📖",
      formTitle: "📝 Inscription à l'aventure",
      shipIcon: "📖",
      captainName: "Alison l'Aventurière",
    },
    enigmasFile: "enigmasAlsaceCharente",
  },
};

// Thème par défaut
export const DEFAULT_THEME = THEMES.TOUR_DU_MONDE;

// Fonction pour obtenir le thème actuel depuis le localStorage
export const getCurrentTheme = () => {
  const savedTheme = localStorage.getItem("selectedTheme");
  return savedTheme ? THEMES[savedTheme] || DEFAULT_THEME : DEFAULT_THEME;
};

// Fonction pour sauvegarder le thème sélectionné
export const saveTheme = (themeId) => {
  localStorage.setItem("selectedTheme", themeId);
};

// Fonction pour appliquer les variables CSS du thème
export const applyThemeVariables = (theme) => {
  const root = document.documentElement;

  // Appliquer les couleurs
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    root.style.setProperty(`--${cssVar}`, value);
  });

  // Appliquer les gradients
  Object.entries(theme.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value);
  });
};
