import React, { useState } from "react";
import { getCurrentTheme } from "../../data/themes";
import "../../styles/welcome.css";

const WelcomePage = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showRules, setShowRules] = useState(false);
  
  const currentTheme = getCurrentTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() && agreeTerms) {
      onStartGame({
        name: playerName.trim(),
        email: playerEmail.trim(),
        joinedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="welcome-page">
      <div className="ocean-background">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      <div className="welcome-container">
        {/* Header principal */}
        <div className="welcome-header">
          <div className="ship-icon">{currentTheme.texts.shipIcon}</div>
          <h1 className="welcome-title">{currentTheme.texts.welcomeTitle}</h1>
          <h2 className="welcome-subtitle">
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
          </h2>
          <p className="welcome-description">
            {currentTheme.texts.welcomeDescription}
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <div className="registration-form">
          <form onSubmit={handleSubmit} className="navigator-form">
            <h3 className="form-title">{currentTheme.texts.formTitle}</h3>

            <div className="form-group">
              <label htmlFor="playerName" className="form-label">
                🏷️ Nom de l'équpage *
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Equipe Jean Jacques SousLeau"
                className="form-input"
                required
                maxLength={30}
              />
            </div>

            <div className="form-group checkbox-group">
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
                  Code des Navigateurs
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={!playerName.trim() || !agreeTerms}
              className="btn btn-primary btn-large"
            >
              ⛵ Embarquer pour l'Aventure !
            </button>
          </form>
        </div>

        {/* Règles du jeu */}
        {showRules && (
          <div className="rules-modal">
            <div className="rules-content">
              <h3 className="rules-title">
                ⚖️ Code des Navigateurs - Règles du Voyage
              </h3>
              <div className="rules-list">
                <div className="rule-item">
                  <span className="rule-icon">🗺️</span>
                  <div className="rule-text">
                    <strong>Mission :</strong> Découvrez les 7 cartes postales
                    des plus belles destinations du capitaine Alison
                  </div>
                </div>
                <div className="rule-item">
                  <span className="rule-icon">📱</span>
                  <div className="rule-text">
                    <strong>QR Codes :</strong> Scannez les codes ou
                    saisissez-les manuellement pour débloquer les destinations
                  </div>
                </div>
                <div className="rule-item">
                  <span className="rule-icon">🧩</span>
                  <div className="rule-text">
                    <strong>Énigmes :</strong> Résolvez les énigmes sur les
                    merveilles du monde pour obtenir les cartes postales
                  </div>
                </div>
                <div className="rule-item">
                  <span className="rule-icon">⏱️</span>
                  <div className="rule-text">
                    <strong>Navigation :</strong> Plus vous naviguez avec
                    élégance, plus vous montez dans le classement des marins !
                  </div>
                </div>
                <div className="rule-item">
                  <span className="rule-icon">🏆</span>
                  <div className="rule-text">
                    <strong>Destination finale :</strong> Collectez toutes les
                    cartes postales pour révéler la destination de rêve d'Alison
                    ! Et repartir avec un précieux trésor 🪙
                  </div>
                </div>
                <div className="rule-item">
                  <span className="rule-icon">🤝</span>
                  <div className="rule-text">
                    <strong>Esprit marin :</strong> Entraide bienvenue dans
                    l'esprit de camaraderie ! Le voyage compte autant que la
                    destination
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRules(false)}
                className="btn btn-secondary"
              >
                ⚓ Compris, Capitaine !
              </button>
            </div>
          </div>
        )}

        {/* Informations de l'événement */}
        <div className="event-info">
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🎂</div>
              <div className="info-content">
                <h4>Célébration</h4>
                <p>40 ans d'Alison</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📅</div>
              <div className="info-content">
                <h4>Date</h4>
                <p>Juin 2025</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🌍</div>
              <div className="info-content">
                <h4>Destinations</h4>
                <p>7 merveilles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="welcome-footer">
          <p className="footer-text">
            🎁 Un voyage créé avec ❤️ pour célébrer notre Capitaine Alison
          </p>
          <div className="version-info">Version 1.0</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
