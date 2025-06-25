import React, { useState } from "react";
import { motion } from 'framer-motion';
import { getCurrentTheme } from "../../data/themes";
import "../../styles/welcome.css";

const WelcomePage = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const currentTheme = getCurrentTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() && agreeTerms) {
      setIsAnimating(true);
      setTimeout(() => {
        onStartGame({
          name: playerName.trim(),
          email: playerEmail.trim(),
          joinedAt: new Date().toISOString(),
        });
      }, 1000);
    }
  };

  return (
    <div className="welcome-page">
      {/* Background océan animé */}
      <div className="ocean-background">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        
        {/* Particules flottantes */}
        <div className="floating-particles">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [0, -120, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            >
              {i % 4 === 0 ? '✨' : i % 4 === 1 ? '🌟' : i % 4 === 2 ? '⭐' : '💫'}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="welcome-container">
        {/* Header principal avec animations */}
        <motion.div 
          className="welcome-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="ship-icon"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            {currentTheme.texts.shipIcon}
          </motion.div>

          <motion.h1 
            className="welcome-title"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {currentTheme.texts.welcomeTitle}
          </motion.h1>

          <motion.h2 
            className="welcome-subtitle"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {currentTheme.texts.welcomeSubtitle.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line.includes(currentTheme.texts.captainName) ? (
                  <span className="captain-name">{line}</span>
                ) : (
                  line
                )}
                {index === 0 && <br />}
              </React.Fragment>
            ))}
          </motion.h2>

          <motion.p 
            className="welcome-description"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {currentTheme.texts.welcomeDescription}
          </motion.p>

          {/* Perroquet parlant */}
          <motion.div 
            className="talking-parrot"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 3, -3, 0] 
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity 
            }}
          >
            🦜
            <div className="parrot-bubble">
              <motion.span
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                "Prêts à lever l'ancre, moussaillons ?"
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        {/* Formulaire d'inscription avec animations */}
        <motion.div 
          className="registration-form"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <form onSubmit={handleSubmit} className="navigator-form">
            <motion.h3 
              className="form-title"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {currentTheme.texts.formTitle} 
            </motion.h3>

            <motion.div 
              className="form-group"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <label htmlFor="playerName" className="form-label">
                 Nom de votre équipage
              </label>
              <div className="input-wrapper">
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Equipage de Jean Jaques SousL'eau"
                  className="form-input"
                  required
                  maxLength={30}
                />
                <div className="input-decoration">⚓</div>
              </div>
            </motion.div>

            <motion.div 
              className="form-group checkbox-group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="form-checkbox"
                  required
                />
                <span className="checkbox-custom"></span>
                J'accepte d'embarquer dans cette aventure maritime et de
                respecter le{" "}
                <button
                  type="button"
                  onClick={() => setShowRules(!showRules)}
                  className="link-btn"
                >
                  Code des Navigateurs ⚖️
                </button>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={!playerName.trim() || !agreeTerms || isAnimating}
              className={`btn btn-primary btn-large ${isAnimating ? 'animating' : ''}`}
              whileHover={{ scale: (!playerName.trim() || !agreeTerms) ? 1 : 1.05 }}
              whileTap={{ scale: (!playerName.trim() || !agreeTerms) ? 1 : 0.95 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                ...(isAnimating && { rotate: [0, 360], scale: [1, 1.1, 1] })
              }}
              transition={{
                duration: isAnimating ? 1 : 0.6,
                delay: isAnimating ? 0 : 2
              }}
            >
              {isAnimating ? (
                <>🧭 Larguez les amarres !</>
              ) : (
                <>🚀 Embarquer pour l'Aventure !</>
              )}
            </motion.button>

            {/* Conseil de marin */}
            <motion.p 
              className="sailor-tip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              💡 <em>Conseil de vieux loup de mer :
              Choisissez un nom qui ferait honneur au Capitaine Alison ! ⚓ </em> 
            </motion.p>
          </form>
        </motion.div>

        {/* Règles du jeu avec animations */}
    {showRules && (
      <motion.div 
        className="rules-modal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="rules-content"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="rules-title">
            ⚖️ Code des Navigateurs - Règles du Voyage
          </h3>
          <div className="rules-list">
            {[
              {
                icon: "🗺️",
                title: "Mission",
                text: "Découvrez les 7 cartes postales des plus belles destinations du capitaine Alison"
              },
              {
                icon: "📱",
                title: "QR Codes",
                text: "Scannez les codes ou saisissez-les manuellement pour débloquer les destinations"
              },
              {
                icon: "🧩",
                title: "Énigmes",
                text: "Résolvez les énigmes sur les merveilles du monde pour obtenir les cartes postales"
              },
              {
                icon: "⏱️",
                title: "Navigation",
                text: "Plus vous naviguez avec élégance, plus vous montez dans le classement des marins !"
              },
              {
                icon: "🏆",
                title: "Destination finale",
                text: "Collectez toutes les cartes postales pour révéler la destination de rêve d'Alison ! Et repartir avec un précieux trésor 🪙"
              },
              {
                icon: "🤝",
                title: "Esprit marin",
                text: "Entraide bienvenue dans l'esprit de camaraderie ! Le voyage compte autant que la destination"
              }
            ].map((rule, index) => (
              <motion.div 
                key={index}
                className="rule-item"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <span className="rule-icon">{rule.icon}</span>
                <div className="rule-text">
                  <strong>{rule.title} :</strong> {rule.text}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            onClick={() => setShowRules(false)}
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            ⚓ Compris, Capitaine !
          </motion.button>
        </motion.div>
      </motion.div>
    )}

    {/* Informations de l'événement avec animations */}
    <motion.div 
      className="event-info"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.4 }}
    >
      <div className="info-cards">
        {[
          { icon: "🎂", title: "Célébration", text: "40 ans d'Alison" },
          { icon: "📅", title: "Date", text: "Juin 2025" },
          { icon: "🌍", title: "Destinations", text: "7 merveilles" }
        ].map((info, index) => (
          <motion.div 
            key={index}
            className="info-card"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 8px 25px rgba(212, 175, 55, 0.3)" 
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.6 + index * 0.2 }}
          >
            <motion.div 
              className="info-icon"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.5 
              }}
            >
              {info.icon}
            </motion.div>
            <div className="info-content">
              <h4>{info.title}</h4>
              <p>{info.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
        </motion.div>

        {/* Footer avec animation */}
        <motion.div 
          className="welcome-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.2 }}
        >
          <p className="footer-text">
            🎁 Un voyage créé avec ❤️ pour célébrer notre Capitaine Alison
          </p>
          <div className="version-info">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚓ Version 1.0 ⚓
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;