import React, { useState } from "react";
import { getRankDetails, getRankAdvice } from "../../utils/ranking";
import { getStoredPhotos } from "../../utils/photoStorage"; // AJOUT
import FlagQuiz from "../FlagQuiz/FlagQuiz";
import { ENIGMAS } from "../../data/enigmas";
import "../../styles/victory.css";

const VictoryPage = ({ player, onRestart, allPlayers = [], quizScore = null, quizCompleted = false }) => {
  const [showFlagQuiz, setShowFlagQuiz] = useState(false);
  const rankDetails = getRankDetails(player, allPlayers);
  const rankAdvice = getRankAdvice(player, allPlayers);

  // NOUVEAU: Récupérer les photos du joueur
  const allPhotos = getStoredPhotos();
  const playerPhotos = allPhotos;

  // Fonction pour calculer le temps total
  const calculateTotalTime = () => {
    if (!player?.startTime || !player?.lastUpdate) {
      return "Temps non disponible";
    }

    try {
      const startTime = new Date(player.startTime);
      const endTime = new Date(player.lastUpdate);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return "Temps non disponible";
      }

      const totalMs = endTime.getTime() - startTime.getTime();

      if (totalMs < 0) {
        return "Temps non disponible";
      }

      const totalSeconds = Math.floor(totalMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    } catch (error) {
      console.error("Erreur calcul temps:", error);
      return "Temps non disponible";
    }
  };

  // MODIFICATION: Fonction de partage WhatsApp avec photos
  // Génère le texte de partage avec les statistiques du joueur
  const generateShareText = () => {
    const rankDetails = getRankDetails(player, allPlayers);
    const totalTime = calculateTotalTime();

    return `⚓ VOYAGE MARITIME ACCOMPLI ! ⚓

🧭 Equipage : ${player?.name || "Capitaine"}
${rankDetails.icon} Rang: ${rankDetails.name}
⏱️ Temps: ${totalTime}
🗺️ Cartes: ${player?.completed?.length || 0}/7
${
  rankDetails.position > 0
    ? `🏅 Position: ${rankDetails.position}°/${rankDetails.totalPlayers}\n`
    : ""
}
🎂 Joyeux anniversaire Capitaine Alison ! ⚓`;
  };

  const shareOnWhatsApp = async () => {
    const shareText = generateShareText();

    // 1. Préparation des photos
    let files = [];
    try {
      files = await Promise.all(
        playerPhotos.map(async (photo) => {
          const response = await fetch(photo.dataUrl);
          const blob = await response.blob();
          return new File([blob], photo.filename, { type: "image/jpeg" });
        })
      );
    } catch (error) {
      console.error("Erreur préparation photos:", error);
      files = []; // On continue avec le partage texte uniquement
    }

    // 2. Essayer le Web Share API avec photos
    if (navigator.share && files.length > 0) {
      try {
        if (navigator.canShare({ files })) {
          await navigator.share({
            title: "🌊 Mon Aventure Maritime",
            text: shareText,
            files: files.slice(0, 10), // Limite technique de l'API
          });
          return;
        }
      } catch (error) {
        console.error("Erreur partage multiple:", error);
      }
    }

    // 3. Fallback: Web Share API texte uniquement
    if (navigator.share) {
      try {
        await navigator.share({
          title: "🌊 Mon Aventure Maritime",
          text: shareText,
        });
        return;
      } catch (error) {
        console.error("Erreur partage texte:", error);
      }
    }

    // 4. Fallback final: URL WhatsApp
    try {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        shareText
      )}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Erreur ouverture WhatsApp:", error);
      alert("Partage non disponible sur cet appareil");
    }
  };

  // NOUVEAU: Fonction pour partager une photo individuelle
  const shareIndividualPhoto = async (photo) => {
    if (navigator.share) {
      try {
        const response = await fetch(photo.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], photo.filename, { type: "image/jpeg" });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Photo souvenir - ${photo.enigmaTitle}`,
            text: `📸 Souvenir de mon voyage à ${photo.enigmaTitle} ! ⚓`,
            files: [file],
          });
          return;
        }
      } catch (error) {
        console.error("Erreur partage photo:", error);
      }
    }

    // Fallback: télécharger la photo
    downloadPhoto(photo);
  };

  // NOUVEAU: Fonction pour télécharger une photo
  const downloadPhoto = (photo) => {
    const link = document.createElement("a");
    link.href = photo.dataUrl;
    link.download = photo.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour formater la date de fin
  const formatCompletionDate = () => {
    if (!player?.lastUpdate) {
      return "Date non disponible";
    }

    try {
      const date = new Date(player.lastUpdate);
      if (isNaN(date.getTime())) {
        return "Date non disponible";
      }

      return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erreur format date:", error);
      return "Date non disponible";
    }
  };

  // Suppression de l'état showInstructions car plus de modale

  return (
    <div className="victory-page">
      <div className="victory-container">
        <div className="victory-header">
          <span className="victory-crown">⚓</span>
          <h1 className="victory-title">Félicitations !</h1>
          <h2 className="victory-subtitle">
            {rankDetails.icon} {rankDetails.name} {player?.name || "Navigateur"}
          </h2>
          <p className="victory-message">
            Vous avez collecté toutes les cartes postales et découvert la
            destination de rêve du capitaine ⚓ !
          </p>
        </div>

        <div className="victory-stats">
          <h3>🏆 Votre Carnet de Voyage</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🗺️</span>
              <span className="stat-value">
                {player?.completed?.length || 0}
              </span>
              <span className="stat-label">Cartes postales collectées</span>
            </div>

            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">{calculateTotalTime()}</span>
              <span className="stat-label">Temps de navigation</span>
            </div>

            <div className="stat-item">
              <span className="stat-icon">📅</span>
              <span className="stat-value">{formatCompletionDate()}</span>
              <span className="stat-label">Voyage terminé le</span>
            </div>

            <div className="stat-item rank-item">
              <span className="stat-icon" style={{ color: rankDetails.color }}>
                {rankDetails.icon}
              </span>
              <span className="stat-value" style={{ color: rankDetails.color }}>
                {rankDetails.name}
              </span>
              <span className="stat-label">{rankDetails.description}</span>
            </div>
            
            {quizCompleted && quizScore !== null && (
              <div className="stat-item quiz-item">
                <span className="stat-icon">🏴‍☠️</span>
                <span className="stat-value">{quizScore.toFixed(1)}%</span>
                <span className="stat-label">Quiz des Drapeaux réussi</span>
              </div>
            )}
          </div>

          {rankDetails.isFinished && rankDetails.position > 0 && (
            <div className="rank-details">
              <p className="rank-position">
                🏅 Position: {rankDetails.position}° sur{" "}
                {rankDetails.totalPlayers} navigateurs
              </p>
              <p className="rank-advice">💡 {rankAdvice}</p>
            </div>
          )}
        </div>
        {/* Instructions intégrées directement dans la page */}
        <div className="instructions-section">
          <h3>📱 Comment partager vos photos dans le groupe</h3>
          <div className="instructions-steps">
            <div className="step">
              <div className="step-header">
                <span className="step-number">1</span>
                <h4>Rejoignez le groupe WhatsApp</h4>
              </div>
              <p>
                Cliquez sur le bouton ci-dessous pour rejoindre le groupe
                WhatsApp d'Alison :
              </p>
              <button
                onClick={() =>
                  window.open(
                    "https://chat.whatsapp.com/JxcN2zllWGu2Nd3kYevVzB",
                    "_blank"
                  )
                }
                className="group-link-btn"
              >
                👥 Rejoindre le groupe WhatsApp
              </button>
            </div>

            <div className="step">
              <div className="step-header">
                <span className="step-number">2</span>
                <h4>Partagez votre aventure</h4>
              </div>
              <p>
                Une fois dans le groupe, utilisez le bouton ci-dessous pour
                partager votre aventure maritime :
              </p>
              <button
                className="victory-btn whatsapp"
                onClick={shareOnWhatsApp}
              >
                💬 Partager l'Aventure sur WhatsApp
              </button>
            </div>
          </div>
        </div>
        {/* NOUVEAU: Section photos souvenirs */}
        {playerPhotos.length > 0 && (
          <div className="photos-section">
            <h3>📸 Vos Photos Souvenirs</h3>
            <div className="photos-grid">
              {playerPhotos.map((photo, index) => (
                <div key={photo.id || index} className="photo-item">
                  <img
                    src={photo.dataUrl}
                    alt={`Souvenir ${photo.enigmaTitle}`}
                    className="photo-thumbnail"
                  />
                  <div className="photo-info">
                    <span className="photo-title">{photo.enigmaTitle}</span>
                    <button
                      onClick={() => shareIndividualPhoto(photo)}
                      className="photo-share-btn"
                    >
                      📤 Partager
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="destination-reveal">
          <h4>🌟 Destination de Rêve Révélée</h4>
          <div className="destination-content">
            <div className="destination-image">
              <span className="destination-icon">🏝️</span>
            </div>
            <div className="destination-text">
              <p>
                <strong>
                  La destination de rêve du Capitaine Alison se trouve ici, car
                  vous êtes tous là présents pour elle ! 💝
                </strong>
              </p>
              <p>
                Car le plus beau voyage, ce sont les moments partagés et les
                souvenirs créés avec ses précieux compagnons de navigation !
              </p>
              <div className="birthday-message">
                <p>
                  <strong>
                    🎂 Joyeux 40ème anniversaire Capitaine Alison ! 🎂
                  </strong>
                </p>
                <p className="birthday-quote">
                  <em>
                    "Que cette nouvelle décennie soit remplie d'aventures
                    extraordinaires et de découvertes merveilleuses !"
                  </em>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="maritime-celebration">
          <div className="celebration-elements">
            <span className="celebration-icon">🎉</span>
            <span className="celebration-icon">⚓</span>
            <span className="celebration-icon">🌊</span>
            <span className="celebration-icon">🧭</span>
            <span className="celebration-icon">⭐</span>
          </div>
          <p className="celebration-text">
            Bravo pour cette navigation exemplaire ! Vous avez fait honneur à
            l'esprit maritime et la débrouilardise du voyageur.
          </p>
        </div>

        <div className="victory-actions">
          <button className="victory-btn secondary" onClick={onRestart}>
            ⛵ Nouveau Voyage
          </button>

          <button
            className="victory-btn gallery"
            onClick={() => {
              console.log("Ouvrir galerie avec", playerPhotos.length, "photos");
            }}
          >
            📸 Album Photos ({playerPhotos.length})
          </button>

          <button
            className="victory-btn quiz"
            onClick={() => setShowFlagQuiz(true)}
          >
            🏴‍☠️ Quiz des Drapeaux
          </button>
        </div>

        <div className="captain-signature">
          <div className="signature-content">
            <p className="signature-text">
              <em>
                "Merci d'avoir participé à ce jeu, et d'être présent ce soir
                pour Alison ! Viens me voir, j'ai un petit quelque chose pour
                toi'."
              </em>
            </p>
            <p className="signature-name">— Sous-Capitaine Arnaud ⚓</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryPage;
