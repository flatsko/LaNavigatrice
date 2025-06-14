import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Vérifier la taille d'écran
      const screenWidth = window.innerWidth <= 768;

      // Vérifier si c'est un appareil tactile
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Vérifier le user agent pour les appareils mobiles
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        "mobile",
        "android",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
      ];
      const isMobileUserAgent = mobileKeywords.some((keyword) =>
        userAgent.includes(keyword)
      );

      // Vérifier si une caméra est disponible
      const hasCamera =
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

      // Combinaison des critères
      const mobile =
        (screenWidth || isTouchDevice || isMobileUserAgent) && hasCamera;

      setIsMobile(mobile);
    };

    // Vérifier au chargement
    checkIsMobile();

    // Vérifier lors du redimensionnement
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};
