import React, { useEffect, useRef } from "react";
import "./ParticleEffect.css";

const ParticleEffect = ({ type = "success", duration = 3000, onComplete }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particleCount = type === "success" ? 50 : 30;

    // Créer les particules
    for (let i = 0; i < particleCount; i++) {
      createParticle(container, type, i);
    }

    // Nettoyer après la durée
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(timeout);
      // Nettoyer les particules
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [type, duration, onComplete]);

  const createParticle = (container, effectType, index) => {
    const particle = document.createElement("div");
    particle.className = `particle particle-${effectType}`;

    // Position aléatoire
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    // Propriétés selon le type d'effet
    if (effectType === "success") {
      particle.innerHTML = ["🎉", "⭐", "✨", "🏆", "🎊"][
        Math.floor(Math.random() * 5)
      ];
      particle.style.fontSize = `${Math.random() * 20 + 15}px`;
    } else if (effectType === "discovery") {
      particle.innerHTML = ["🗺️", "🧭", "⚓", "🏴‍☠️", "💎"][
        Math.floor(Math.random() * 5)
      ];
      particle.style.fontSize = `${Math.random() * 15 + 12}px`;
    } else if (effectType === "photo") {
      particle.innerHTML = ["📸", "💫", "✨", "🌟"][
        Math.floor(Math.random() * 4)
      ];
      particle.style.fontSize = `${Math.random() * 18 + 14}px`;
    }

    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.animationDelay = `${index * 50}ms`;

    container.appendChild(particle);
  };

  return <div ref={containerRef} className="particle-container" />;
};

export default ParticleEffect;
