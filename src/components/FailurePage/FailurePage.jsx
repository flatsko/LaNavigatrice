import React from "react";
import { useState, useRef } from "react";
import { calculateDetailedStats } from "../../utils/scoring";
import { ENIGMAS } from "../../data/enigmas";
import Camera from "../Camera/Camera";
import PhotoNotification from "../PhotoNotification/PhotoNotification";
import { savePhoto, getStoredPhotos } from "../../utils/photoStorage";
import { useIsMobile } from "../../hooks/useIsMobile";
import "../../styles/failure.css";

const FailurePage = ({
  player,
  reason: failureReason,
  onRestart,
  onViewStats,
  onPhotoShared,
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [showPhotoNotification, setShowPhotoNotification] = useState(false);
  const [lastPhotoData, setLastPhotoData] = useState(null);
  const isMobile = useIsMobile();
  const cameraRef = useRef(null);
  const stats = calculateDetailedStats(player);
  const completed = player?.completed || [];

  // Récupérer toutes les photos du joueur
  const allPhotos = getStoredPhotos();
  const playerPhotos = allPhotos;

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handlePhotoCapture = async (photoData) => {
    try {
      const photoInfo = {
        id: Date.now().toString(),
        data: photoData,
        timestamp: new Date().toISOString(),
        location: "Échec d'énigme",
        playerName: player?.name || "Navigateur",
        context: "failure",
        enigmaTitle: failureReason || "Voyage inachevé",
      };

      await savePhoto(photoInfo);
      setLastPhotoData(photoInfo);
      setShowCamera(false);
      setShowPhotoNotification(true);

      if (onPhotoShared) {
        onPhotoShared(photoInfo);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la photo:", error);
      setShowCamera(false);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleClosePhotoNotification = () => {
    setShowPhotoNotification(false);
    setLastPhotoData(null);
  };

  // Fonction de partage WhatsApp avec photos
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

  const shareOnWhatsApp = async () => {
    const allPhotos = getStoredPhotos();
    const playerPhotos = allPhotos;

    const shareText =
      `🌊 Aventure Maritime - Voyage Inachevé\n\n` +
      `⚓ Navigateur: ${player?.name || "Anonyme"}\n` +
      `🎯 Énigmes résolues: ${player?.completed?.length || 0}\n` +
      `📸 Photos prises: ${playerPhotos.length}\n\n` +
      `Même si le voyage n'est pas terminé, l'aventure continue ! 🚢\n\n` +
      `#LaNavigatrice #AventureMaritine`;

    try {
      // 1. Essayer le partage natif avec photos (mobile)
      if (navigator.share && playerPhotos.length > 0) {
        const files = [];
        for (const photo of playerPhotos.slice(0, 8)) {
          // Limiter à 5 photos
          try {
            const response = await fetch(photo.dataUrl);
            const blob = await response.blob();
            const file = new File(
              [blob],
              photo.filename || `photo-${photo.id}.jpg`,
              {
                type: "image/jpeg",
              }
            );
            files.push(file);
          } catch (error) {
            console.warn("Erreur conversion photo:", error);
          }
        }

        if (files.length > 0) {
          await navigator.share({
            title: "Aventure Maritime - Voyage Inachevé",
            text: shareText,
            files: files,
          });
          return;
        }
      }

      // 2. Fallback: partage texte uniquement
      if (navigator.share) {
        await navigator.share({
          title: "Aventure Maritime - Voyage Inachevé",
          text: shareText,
        });
        return;
      }

      // 3. Fallback final: URL WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        shareText
      )}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Erreur partage WhatsApp:", error);
      alert("Partage non disponible sur cet appareil");
    }
  };
  const failed = player?.failed || [];

  return (
    <div className="failure-page">
      <div className="failure-container">
        <div className="failure-header">
          <div className="failure-icon">⚓</div>
          <h1 className="failure-title">Voyage Inachevé</h1>
          <h2 className="failure-subtitle">
            La destination finale reste à découvrir...
          </h2>
        </div>

        <div className="failure-reason">
          <h3>🧭 Navigation Interrompue</h3>
          <p className="reason-text">
            Votre voyage nécessite une navigation plus attentive et réfléchie.
          </p>
          <p className="reason-detail">
            {failureReason ||
              `Taux de réussite: ${Math.round(
                stats.successRate * 100
              )}% (minimum requis: 50%)`}
          </p>
        </div>

        <div className="failure-stats">
          <h3>📊 Votre Carnet de Bord</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">
                {Math.round(stats.successRate * 100)}%
              </div>
              <div className="stat-label">Précision de navigation</div>
              <div
                className={`stat-status ${
                  stats.successRate >= 0.5 ? "success" : "failure"
                }`}
              >
                {stats.successRate >= 0.5 ? "Satisfaisante" : "À améliorer"}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚓</div>
              <div className="stat-value">{completed.length}</div>
              <div className="stat-label">Destinations atteintes</div>
              <div className="stat-detail">Magnifiques découvertes !</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-value">{failed.length}</div>
              <div className="stat-label">Escales manquées</div>
              <div className="stat-detail">1 tentative épuisée</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🌊</div>
              <div className="stat-value">{stats.wrongAnswers}</div>
              <div className="stat-label">Erreurs de navigation</div>
              <div className="stat-detail">
                sur {stats.totalAttempts} tentatives
              </div>
            </div>
          </div>
        </div>

        {/* Détail des destinations */}
        <div className="destinations-breakdown">
          <h3>🗺️ Journal de votre voyage</h3>

          {completed.length > 0 && (
            <div className="destinations-section success">
              <h4>⚓ Destinations conquises ({completed.length})</h4>
              <div className="destinations-list">
                {completed.map((enigmaId) => {
                  const enigma = ENIGMAS.find((e) => e.id === enigmaId);
                  return enigma ? (
                    <div key={enigmaId} className="destination-item success">
                      <span className="destination-flag">{enigma.flag}</span>
                      <span className="destination-title">{enigma.title}</span>
                      <small className="destination-note">
                        Carte postale obtenue
                      </small>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {failed.length > 0 && (
            <div className="destinations-section failure">
              <h4>⚠️ Escales manquées ({failed.length})</h4>
              <div className="destinations-list">
                {failed.map((enigmaId) => {
                  const enigma = ENIGMAS.find((e) => e.id === enigmaId);
                  return enigma ? (
                    <div key={enigmaId} className="destination-item failure">
                      <span className="destination-flag">{enigma.flag}</span>
                      <span className="destination-title">{enigma.title}</span>
                      <small className="destination-note">
                        Navigation interrompue
                      </small>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="failure-advice">
          <h3>🧭 Conseils du Capitaine</h3>
          <div className="advice-content">
            <p>
              <strong>
                ⚓ "Un bon marin prend le temps d'étudier les cartes avant de
                naviguer !"
              </strong>
            </p>
            <ul className="advice-list">
              <li>📚 Étudiez attentivement chaque destination</li>
              <li>🤔 Prenez le temps de réfléchir avant de répondre</li>
              <li>🔍 Observez bien les indices dans les paysages</li>
              <li>🌍 Utilisez vos connaissances sur les merveilles du monde</li>
              <li>⚓ La patience est la vertu du vrai navigateur !</li>
              <li>🎯 Privilégiez la précision à la rapidité</li>
              <li>🧭 Laissez-vous guider par votre instinct de marin</li>
            </ul>
          </div>
        </div>

        {/* Section partage WhatsApp */}
        <div className="whatsapp-section">
          <h3>📱 Partager votre aventure</h3>
          <div className="whatsapp-content">
            <div className="whatsapp-info">
              <h4>Rejoignez le groupe WhatsApp</h4>
              <p>
                Cliquez sur le bouton ci-dessous pour rejoindre le groupe
                WhatsApp d'Alison :
              </p>
              <a
                href="https://chat.whatsapp.com/JxcN2zllWGu2Nd3kYevVzB"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-join-btn"
              >
                👥 Rejoindre le groupe WhatsApp
              </a>
            </div>

            <div className="whatsapp-share">
              <h4>Partagez votre aventure</h4>
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

        <div className="failure-actions">
          <button className="btn btn-primary btn-large" onClick={onRestart}>
            ⛵ Recommencer la Navigation
          </button>
        </div>

        {showCamera && (
          <Camera
            ref={cameraRef}
            onCapture={handlePhotoCapture}
            onClose={handleCloseCamera}
            isMobile={isMobile}
          />
        )}

        {showPhotoNotification && lastPhotoData && (
          <PhotoNotification
            photoData={lastPhotoData}
            onClose={handleClosePhotoNotification}
          />
        )}

        <div className="failure-footer">
          <p className="encouragement">
            Un vrai marin ne renonce jamais ! Reprenez la mer et montrez que
            vous savez naviguer avec sagesse et élégance !
          </p>
          <div className="game-rules-reminder">
            <small>
              📋 Rappel : Il faut au moins 50% de précision pour atteindre la
              destination finale du Capitaine Alison
            </small>
          </div>
          <div className="maritime-quote">
            <em>"La mer c'est chouette" - Capitaine Alison</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailurePage;
