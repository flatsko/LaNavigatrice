import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { ENIGMAS } from "../../data/enigmas";
import "./QRGenerator.css";

const QRGenerator = () => {
  // URL de base de ton application
  const BASE_URL = window.location.origin;

  const generateQRUrl = (enigma) => {
    // L'URL contiendra l'ID de l'énigme pour l'ouvrir directement
    return `${BASE_URL}?enigma=${enigma.qrCode}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-generator">
      <div className="qr-header no-print">
        <h1>🗺️ Cartes QR du Trésor du Capitaine Alison</h1>
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Imprimer toutes les cartes
        </button>
        <p className="instruction">
          Découpez chaque carte et placez-les aux endroits correspondants pour
          que les joueurs puissent les scanner !
        </p>
      </div>

      <div className="qr-cards-grid">
        {ENIGMAS.map((enigma, index) => (
          <QRCard
            key={enigma.id}
            enigma={enigma}
            index={index + 1}
            qrUrl={generateQRUrl(enigma)}
          />
        ))}
      </div>
    </div>
  );
};

const QRCard = ({ enigma, index, qrUrl }) => {
  return (
    <div className="qr-card">
      {/* En-tête de la carte */}
      <div className="qr-card-header">
        <div className="card-number">#{index}</div>
        <h3 className="card-title">{enigma.title}</h3>
        <div className="card-flag">{enigma.flag}</div>
      </div>

      {/* QR Code */}
      <div className="qr-code-container">
        <QRCodeSVG
          value={qrUrl}
          size={120}
          level="M"
          includeMargin={true}
          fgColor="#1e3a5f"
          bgColor="#ffffff"
        />
      </div>

      {/* Instructions pour les joueurs */}
      <div className="qr-card-content">
        <h4>📱 Instructions :</h4>
        <ol>
          <li>Scannez ce QR code</li>
          <li>Répondez à l'énigme</li>
          <li>Collectez le fragment !</li>
        </ol>

        <div className="card-hint">
          💡 <strong>Indice :</strong> Cherchez l'élément maritime sur la photo
          !
        </div>
      </div>

      {/* Code de l'énigme */}
      <div className="qr-card-footer">
        <div className="enigma-code">Code: {enigma.id}</div>
        <div className="captain-signature">⚓ Capitaine Alison ⚓</div>
      </div>

      {/* Ligne de découpage */}
      <div className="cut-line">✄ ✄ ✄ ✄ ✄ ✄ ✄ ✄ ✄ ✄</div>
    </div>
  );
};

export default QRGenerator;
