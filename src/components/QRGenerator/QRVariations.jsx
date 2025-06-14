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

export default QRVariations;
