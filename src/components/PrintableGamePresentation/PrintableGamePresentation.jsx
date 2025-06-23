import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './PrintableGamePresentation.css';

const PrintableGamePresentation = ({ onClose }) => {
  const gameUrl = window.location.origin;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="printable-presentation">
      <div className="print-controls">
        <button onClick={handlePrint} className="print-button">
          🖨️ Imprimer la page de présentation
        </button>
        <button onClick={onClose} className="close-button">
          ❌ Fermer
        </button>
      </div>
      
      <div className="presentation-page">
        <div className="presentation-header">
          <h1>🧭 La Navigatrice</h1>
          <h2>Jeu d'Aventure et d'Exploration</h2>
        </div>
        
        <div className="presentation-content">
          <div className="presentation-left">
            <div className="game-description">
              <h3>🌍 À propos du jeu</h3>
              <p>
                Embarquez pour un voyage extraordinaire autour du monde ! 
                La Navigatrice vous invite à découvrir des destinations fascinantes 
                à travers des énigmes captivantes et des défis interactifs.
              </p>
              <p>
                Chaque destination révèle ses secrets à travers des quiz, 
                des expériences sensorielles et des défis photo uniques.
              </p>
            </div>
            
            <div className="how-to-play">
              <h3>🎮 Comment Jouer</h3>
              <ol>
                <li>Scannez le QR code pour accéder au jeu</li>
                <li>Choisissez votre destination sur la carte du monde</li>
                <li>Résolvez les énigmes pour débloquer les secrets</li>
                <li>Collectez des points et débloquez des succès</li>
                <li>Partagez vos découvertes avec d'autres joueurs</li>
                <li>Explorez toutes les destinations pour devenir un vrai navigateur !</li>
              </ol>
            </div>
          </div>
          
          <div className="presentation-right">
            <div className="qr-access">
              <h3>🔗 Accès au Jeu</h3>
              <div className="qr-container">
                <QRCodeSVG 
                  value={gameUrl}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  includeMargin={true}
                  className="qr-image"
                />
              </div>
              <p className="qr-instruction">
                Scannez ce QR code avec votre smartphone pour commencer l'aventure !
              </p>
              <p className="game-url">{gameUrl}</p>
            </div>
            
            <div className="captain-message">
              <h3>💬 Message du Capitaine Alison</h3>
              <div className="message-content">
                <p>
                  "Bienvenue à bord, matelot ! Préparez-vous à vivre une aventure 
                  inoubliable à travers les merveilles de notre planète. 
                  Chaque destination cache des trésors de connaissance qui n'attendent 
                  que d'être découverts. Bon voyage !"
                </p>
                <p className="signature">- Capitaine Alison 🧭</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="presentation-footer">
          <p>🌟 Une expérience ludique et éducative pour tous les âges 🌟</p>
        </div>
      </div>
    </div>
  );
};

export default PrintableGamePresentation;