import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ENIGMAS } from "../../data/enigmas";
import "./QRVariations.css";

const QRVariations = () => {
  const [selectedFormat, setSelectedFormat] = useState("standard");
  const BASE_URL = window.location.origin;

  const generateQRUrl = (enigma) => {
    return `${BASE_URL}?enigma=${enigma.id}`;
  };

  const formats = {
    standard: { name: "Format Standard", component: StandardCard },
    mini: { name: "Mini Cartes", component: MiniCard },
    photo: { name: "Avec Photos", component: PhotoCard },
    treasure: { name: "Carte au Trésor", component: TreasureCard },
    compact: { name: "Compact (6 par page)", component: CompactCard },
    bookmark: { name: "Marque-pages", component: BookmarkCard },
    a4landscape: { name: "A4 Paysage Complet", component: A4LandscapeCard },
    presentation: { name: "Page de Présentation", component: PresentationCard },
  };

  const CurrentFormat = formats[selectedFormat].component;

  return (
    <div className="qr-variations">
      <div className="format-selector no-print">
        <h1>🗺️ Générateur de Cartes QR - Capitaine Alison</h1>

        <div className="format-buttons">
          {Object.entries(formats).map(([key, format]) => (
            <button
              key={key}
              className={`format-btn ${selectedFormat === key ? "active" : ""}`}
              onClick={() => setSelectedFormat(key)}
            >
              {format.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-primary print-btn"
        >
          🖨️ Imprimer ({formats[selectedFormat].name})
        </button>
      </div>

      <div className={`cards-container format-${selectedFormat}`}>
        {ENIGMAS.map((enigma, index) => (
          <CurrentFormat
            key={enigma.id}
            enigma={enigma}
            index={index + 1}
            qrUrl={enigma.id}
          />
        ))}
      </div>
    </div>
  );
};

// ========== FORMAT STANDARD ==========
const StandardCard = ({ enigma, index, qrUrl }) => (
  <div className="qr-card standard">
    <div className="card-header">
      <span className="card-number">#{index}</span>
      <h3>{enigma.title}</h3>
      <div className="flag">{enigma.flag}</div>
    </div>

    <div className="qr-section">
      <QRCodeSVG value={qrUrl} size={120} level="M" />
    </div>

    <div className="instructions">
      <p>📱 Scannez pour découvrir l'énigme</p>
      <p className="code">Code: {enigma.qrCode}</p>
    </div>

    <div className="signature">⚓ Capitaine Alison ⚓</div>
  </div>
);

// ========== MINI CARTES (4 par page) ==========
const MiniCard = ({ enigma, index, qrUrl }) => (
  <div className="qr-card mini">
    <div className="mini-header">
      <span className="mini-number">{index}</span>
      <span className="mini-flag">{enigma.flag}</span>
    </div>

    <QRCodeSVG value={qrUrl} size={80} level="M" />

    <div className="mini-title">{enigma.title}</div>
    <div className="mini-code">{enigma.qrCode}</div>
  </div>
);

// ========== AVEC PHOTOS ==========
const PhotoCard = ({ enigma, index, qrUrl }) => (
  <div className="qr-card photo">
    <div className="photo-header">
      <div
        className="photo-bg"
        style={{ backgroundImage: `url(${enigma.image})` }}
      >
        <div className="photo-overlay">
          <h3>
            {enigma.title} {enigma.flag}
          </h3>
          <span className="photo-number">#{index}</span>
        </div>
      </div>
    </div>

    <div className="photo-content">
      <div className="qr-section">
        <QRCodeSVG value={qrUrl} size={100} level="M" />
      </div>

      <div className="photo-instructions">
        <h4>⚓ Votre mission</h4>

        <p className="hint">❓ {enigma.question.substring(0, 100)}...</p>
        <p>⌨️ Code Manuel : {enigma.id}</p>
      </div>
    </div>

    <div className="captain-seal">⚓ Bon vent ⚓</div>
  </div>
);

// ========== STYLE CARTE AU TRÉSOR ==========
const TreasureCard = ({ enigma, index, qrUrl }) => (
  <div className="qr-card treasure">
    <div className="treasure-border">
      <div className="treasure-header">
        <div className="compass-rose">🧭</div>
        <h3 className="treasure-title">Destination {index}</h3>
        <div className="treasure-flag">{enigma.flag}</div>
      </div>

      <div className="treasure-map">
        <div className="qr-treasure">
          <div className="qr-label">📍 Coordonnées Secrètes</div>
          <QRCodeSVG value={qrUrl} size={110} level="M" />
        </div>

        <div className="treasure-details">
          <h4>{enigma.title}</h4>
          <p className="treasure-coordinates">
            📍 Lat: {Math.random().toFixed(4)}°N
            <br />
            📍 Lon: {Math.random().toFixed(4)}°E
          </p>
          <p className="treasure-warning">⚠️ Attention aux pirates !</p>
        </div>
      </div>

      <div className="treasure-footer">
        <div className="treasure-code">Code Secret: {enigma.qrCode}</div>
        <div className="treasure-signature">
          ~~ Par ordre du Capitaine Alison ~~
        </div>
      </div>

      {/* Effet parchemin */}
      <div className="paper-corners">
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-left"></div>
        <div className="corner bottom-right"></div>
      </div>
    </div>
  </div>
);

// ========== FORMAT COMPACT (6 par page) ==========
const CompactCard = ({ enigma, index, qrUrl }) => (
  <div className="qr-card compact">
    <div className="compact-row">
      <div className="compact-info">
        <span className="compact-number">{index}</span>
        <span className="compact-flag">{enigma.flag}</span>
        <span className="compact-title">{enigma.title}</span>
      </div>
      <div className="compact-qr">
        <QRCodeSVG value={qrUrl} size={60} level="M" />
      </div>
    </div>
    <div className="compact-code">{enigma.qrCode}</div>
  </div>
);

// ========== MARQUE-PAGES ==========
const BookmarkCard = ({ enigma, index, qrUrl }) => (
  <div className="qr-card bookmark">
    <div className="bookmark-content">
      <div className="bookmark-header">
        <h4>{enigma.title}</h4>
        <div className="bookmark-flag">{enigma.flag}</div>
      </div>

      <div className="bookmark-qr">
        <QRCodeSVG value={qrUrl} size={90} level="M" />
      </div>

      <div className="bookmark-details">
        <p className="bookmark-mission">Mission #{index}</p>
        <p className="bookmark-code">{enigma.qrCode}</p>
        <div className="bookmark-decoration">⚓ 🌊 ⚓ 🌊 ⚓</div>
      </div>

      <div className="bookmark-captain">Capitaine Alison</div>
    </div>

    {/* Trou pour attacher */}
    <div className="bookmark-hole">○</div>
  </div>
);

// ========== FORMAT A4 PAYSAGE COMPLET ==========
const A4LandscapeCard = ({ enigma, index, qrUrl }) => (
  <div className="qr-card a4-landscape">
    <div className="a4-header">
      <h2 className="a4-title">
        Mission #{index} - {enigma.title} {enigma.flag}
      </h2>
      <div className="a4-captain">
        ⚓ Capitaine Alison - Aventure Maritime ⚓
      </div>
    </div>

    <div className="a4-content">
      <div className="a4-left-section">
        <div className="a4-photo-section">
          <h3>📸 Photo de Destination</h3>
          <div className="a4-photo">
            <img src={enigma.image} alt={enigma.title} />
          </div>
        </div>

        <div className="a4-photo-instructions">
          <h3>📷 Instructions Photo</h3>
          <div className="a4-photo-prompt">
            <p>{enigma.photoPrompt}</p>
          </div>
        </div>
      </div>

      <div className="a4-center-section">
        <div className="a4-question-section">
          <h3>❓ Votre Mission</h3>
          <div className="a4-question">
            <p>{enigma.question}</p>
          </div>
        </div>

        <div className="a4-qcm-section">
          <h3>🎯 Choix de Réponses</h3>
          <div className="a4-answers">
            {enigma.answers.map((answer, idx) => (
              <div key={idx} className="a4-answer-option">
                <span className="answer-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="answer-text">{answer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="a4-right-section">
        <div className="a4-qr-section">
          <h3>📱 Scanner QR</h3>
          <div className="a4-qr-container">
            <QRCodeSVG value={qrUrl} size={150} level="M" />
          </div>
        </div>

        <div className="a4-code-section">
          <h3>⌨️ Code Manuel</h3>
          <div className="a4-manual-code">
            <span className="code-value">{enigma.qrCode}</span>
          </div>
          <p className="code-instruction">
            Tapez ce code si vous ne pouvez pas scanner
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Page de Présentation du Jeu
const PresentationCard = () => {
  const gameUrl = "https://la-navigatrice.vercel.app/";

  return (
    <div className="qr-card presentation">
      {/* En-tête */}
      <div className="presentation-header">
        <h1 className="presentation-title">🌍 La Navigatrice 🌍</h1>
        <h2 className="presentation-subtitle">
          Jeu d'Aventure et de Découverte
        </h2>
        <div className="celebration-badge">🎉 Prêt pour l'Aventure ! 🎉</div>
      </div>

      {/* Contenu principal */}
      <div className="presentation-content">
        {/* Colonne gauche */}
        <div className="presentation-left">
          {/* Description du jeu */}
          <div className="game-description">
            <h2>🎯 À Propos du Jeu</h2>
            <p>Embarquez pour un voyage extraordinaire autour du monde !</p>
            <div className="game-features">
              <h3>✨ Caractéristiques :</h3>
              <ul>
                <li>🦶 Sur les traces d'Alison </li>
                <li>🧩 Réponses à trouver</li>
                <li>📸 Défis photo </li>
                <li>🎮 Mini-jeux </li>
              </ul>
            </div>
          </div>

          {/* Comment jouer */}
          <div className="how-to-play">
            <h3>🎮 Comment Jouer</h3>
            <ol>
              <li>Scannez le QR code, ou rendez-vous sur la page</li>
              <li>
                Utilisez la carte qui se trouve devant l'entrée pour trouver les
                destinations
              </li>
              <li>
                Mémorisez les destinations ou revenez pour voir celles qui vous
                manquent
              </li>
              <li>Résolvez les énigmes</li>
              <li>
                Chaque énigme réussie ou non propose un défi photo (La meilleure
                photo de la soirée sera élue)
              </li>
              <li>Résolvez les énigmes</li>
              <li>
                Le temps sera pris en compte pour départager la meilleure équipe
              </li>
              <li>
                À la fin de l'aventure, partagez vos photos dans le groupe
                WhatsApp avec le bouton prévu à cet effet
              </li>
            </ol>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="presentation-right">
          {/* QR Code d'accès */}
          <div className="qr-access">
            <h2>🚀 Accès au Jeu</h2>
            <div className="qr-container-presentation">
              <QRCodeSVG
                value={gameUrl}
                size={150}
                level="M"
                includeMargin={true}
              />
            </div>
            <div className="access-url">
              <p className="url-label">Ou visitez directement :</p>
              <p className="game-url">{gameUrl}</p>
            </div>
          </div>

          {/* Message du Capitaine */}
          <div className="captain-message">
            <h3>💬 Message du Sous-Capitaine Arnaud</h3>
            <div className="message-bubble">
              <p>
                "Ahoy, aventuriers ! Préparez-vous à embarquer pour un voyage
                sur les traces d'Alison. Retracez son parcours et découvrez les
                merveilles du monde... À vous de jouer !"
              </p>
              <div className="captain-signature">⚓ Sous-Capitaine Arnaud</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="presentation-footer">
        <div className="footer-waves">🌊 ⛵ 🌊</div>
        <p>Bon voyage et que l'aventure commence !</p>
        <div className="footer-date">
          Créé avec ❤️ • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default QRVariations;
