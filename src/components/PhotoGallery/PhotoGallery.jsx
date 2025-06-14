import React, { useState } from "react";
import "./PhotoGallery.css";

const PhotoGallery = ({ photos, onClose }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const downloadPhoto = (photo) => {
    const link = document.createElement("a");
    link.href = photo.dataUrl;
    link.download = photo.filename;
    link.click();
  };

  const downloadAllPhotos = () => {
    photos.forEach((photo, index) => {
      setTimeout(() => {
        downloadPhoto(photo);
      }, index * 500); // Délai entre chaque téléchargement
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="photo-gallery-overlay">
      <div className="photo-gallery-container">
        <div className="gallery-header">
          <h2>📸 Album Photo du Voyage</h2>
          <div className="gallery-actions">
            {photos.length > 0 && (
              <button
                onClick={downloadAllPhotos}
                className="gallery-btn primary"
              >
                💾 Tout télécharger
              </button>
            )}
            <button onClick={onClose} className="gallery-btn secondary">
              ✕ Fermer
            </button>
          </div>
        </div>

        <div className="gallery-content">
          {photos.length === 0 ? (
            <div className="gallery-empty">
              <span className="empty-icon">📷</span>
              <p>Aucune photo prise pour le moment</p>
              <p className="empty-subtitle">
                Les photos seront ajoutées automatiquement lors de la résolution
                des énigmes
              </p>
            </div>
          ) : (
            <div className="gallery-grid">
              {photos.map((photo, index) => (
                <div key={index} className="gallery-item">
                  <div className="photo-container">
                    <img
                      src={photo.dataUrl}
                      alt={`Photo ${photo.enigmaId}`}
                      onClick={() => setSelectedPhoto(photo)}
                      className="gallery-photo"
                    />
                    <div className="photo-overlay">
                      <span className="photo-title">{photo.enigmaId}</span>
                      <span className="photo-date">
                        {formatDate(photo.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="photo-actions">
                    <button
                      onClick={() => downloadPhoto(photo)}
                      className="photo-btn"
                      title="Télécharger"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="photo-btn"
                      title="Voir en grand"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal photo en grand */}
        {selectedPhoto && (
          <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
            <div
              className="photo-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="photo-modal-header">
                <h3>{selectedPhoto.enigmaId}</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="photo-modal-close"
                >
                  ✕
                </button>
              </div>
              <img
                src={selectedPhoto.dataUrl}
                alt={selectedPhoto.enigmaId}
                className="photo-modal-image"
              />
              <div className="photo-modal-info">
                <p>📅 {formatDate(selectedPhoto.timestamp)}</p>
                <button
                  onClick={() => downloadPhoto(selectedPhoto)}
                  className="gallery-btn primary"
                >
                  💾 Télécharger
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
