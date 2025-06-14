import React, { useState, useEffect } from "react";
import "./SharedPhotoGallery.css";

const SharedPhotoGallery = ({ photos, onClose, currentPlayer }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [votes, setVotes] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [sortBy, setSortBy] = useState("recent"); // recent, popular, player
  const [filterBy, setFilterBy] = useState("all"); // all, player-name

  // Charger les votes depuis le localStorage
  useEffect(() => {
    const savedVotes = localStorage.getItem("photoVotes");
    const savedUserVotes = localStorage.getItem(`userVotes_${currentPlayer?.name}`);
    
    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }
    if (savedUserVotes) {
      setUserVotes(JSON.parse(savedUserVotes));
    }
  }, [currentPlayer]);

  // Sauvegarder les votes
  const saveVotes = (newVotes, newUserVotes) => {
    localStorage.setItem("photoVotes", JSON.stringify(newVotes));
    localStorage.setItem(`userVotes_${currentPlayer?.name}`, JSON.stringify(newUserVotes));
  };

  // Voter pour une photo
  const voteForPhoto = (photoId) => {
    if (!currentPlayer) return;
    
    const newUserVotes = { ...userVotes };
    const newVotes = { ...votes };
    
    // Si l'utilisateur a déjà voté pour cette photo, retirer le vote
    if (newUserVotes[photoId]) {
      delete newUserVotes[photoId];
      newVotes[photoId] = (newVotes[photoId] || 1) - 1;
      if (newVotes[photoId] <= 0) {
        delete newVotes[photoId];
      }
    } else {
      // Ajouter le vote
      newUserVotes[photoId] = true;
      newVotes[photoId] = (newVotes[photoId] || 0) + 1;
    }
    
    setUserVotes(newUserVotes);
    setVotes(newVotes);
    saveVotes(newVotes, newUserVotes);
  };

  // Obtenir le nombre de votes pour une photo
  const getVoteCount = (photoId) => {
    return votes[photoId] || 0;
  };

  // Vérifier si l'utilisateur a voté pour une photo
  const hasUserVoted = (photoId) => {
    return !!userVotes[photoId];
  };

  // Trier les photos
  const sortedPhotos = [...photos].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return getVoteCount(b.id) - getVoteCount(a.id);
      case "player":
        return a.playerName?.localeCompare(b.playerName || "") || 0;
      case "recent":
      default:
        return b.timestamp - a.timestamp;
    }
  });

  // Filtrer les photos
  const filteredPhotos = sortedPhotos.filter(photo => {
    if (filterBy === "all") return true;
    return photo.playerName === filterBy;
  });

  // Obtenir la liste des joueurs uniques
  const uniquePlayers = [...new Set(photos.map(p => p.playerName).filter(Boolean))];

  const downloadPhoto = (photo) => {
    const link = document.createElement("a");
    link.href = photo.dataUrl;
    link.download = `${photo.playerName || 'photo'}_${photo.enigmaId}_${photo.filename}`;
    link.click();
  };

  const downloadAllPhotos = () => {
    filteredPhotos.forEach((photo, index) => {
      setTimeout(() => {
        downloadPhoto(photo);
      }, index * 500);
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

  // Obtenir les photos les plus populaires
  const getTopPhotos = () => {
    return [...photos]
      .sort((a, b) => getVoteCount(b.id) - getVoteCount(a.id))
      .slice(0, 3)
      .filter(photo => getVoteCount(photo.id) > 0);
  };

  const topPhotos = getTopPhotos();

  return (
    <div className="shared-gallery-overlay">
      <div className="shared-gallery-container">
        <div className="gallery-header">
          <h2>🏆 Galerie Photo Commune</h2>
          <div className="gallery-stats">
            <span>📸 {photos.length} photos</span>
            <span>👥 {uniquePlayers.length} participants</span>
            <span>❤️ {Object.values(votes).reduce((sum, count) => sum + count, 0)} votes</span>
          </div>
          <div className="gallery-actions">
            {filteredPhotos.length > 0 && (
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

        {/* Section des photos les plus populaires */}
        {topPhotos.length > 0 && (
          <div className="top-photos-section">
            <h3>🌟 Photos les plus populaires</h3>
            <div className="top-photos-grid">
              {topPhotos.map((photo, index) => (
                <div key={photo.id} className={`top-photo-item rank-${index + 1}`}>
                  <div className="rank-badge">{index + 1}</div>
                  <img
                    src={photo.dataUrl}
                    alt={`Top photo ${index + 1}`}
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="top-photo-info">
                    <span className="votes-count">❤️ {getVoteCount(photo.id)}</span>
                    <span className="player-name">{photo.playerName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contrôles de tri et filtrage */}
        <div className="gallery-controls">
          <div className="sort-controls">
            <label>Trier par :</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">📅 Plus récent</option>
              <option value="popular">❤️ Plus populaire</option>
              <option value="player">👤 Par joueur</option>
            </select>
          </div>
          <div className="filter-controls">
            <label>Filtrer :</label>
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <option value="all">Tous les joueurs</option>
              {uniquePlayers.map(player => (
                <option key={player} value={player}>{player}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="gallery-content">
          {filteredPhotos.length === 0 ? (
            <div className="gallery-empty">
              <span className="empty-icon">📷</span>
              <p>Aucune photo trouvée</p>
              <p className="empty-subtitle">
                {filterBy !== "all" 
                  ? `Aucune photo de ${filterBy} pour le moment`
                  : "Les photos apparaîtront ici au fur et à mesure du jeu"
                }
              </p>
            </div>
          ) : (
            <div className="shared-gallery-grid">
              {filteredPhotos.map((photo, index) => (
                <div key={photo.id || index} className="shared-gallery-item">
                  <div className="photo-container">
                    <img
                      src={photo.dataUrl}
                      alt={`Photo ${photo.enigmaId}`}
                      onClick={() => setSelectedPhoto(photo)}
                      className="gallery-photo"
                    />
                    <div className="photo-overlay">
                      <span className="photo-title">{photo.enigmaId}</span>
                      <span className="photo-player">👤 {photo.playerName || 'Anonyme'}</span>
                      <span className="photo-date">
                        {formatDate(photo.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="photo-actions">
                    <button
                      onClick={() => voteForPhoto(photo.id || `${photo.enigmaId}_${photo.timestamp}`)}
                      className={`vote-btn ${hasUserVoted(photo.id || `${photo.enigmaId}_${photo.timestamp}`) ? 'voted' : ''}`}
                      title={hasUserVoted(photo.id || `${photo.enigmaId}_${photo.timestamp}`) ? "Retirer le vote" : "Voter pour cette photo"}
                      disabled={!currentPlayer}
                    >
                      ❤️ {getVoteCount(photo.id || `${photo.enigmaId}_${photo.timestamp}`)}
                    </button>
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
                <div className="modal-title-section">
                  <h3>{selectedPhoto.enigmaId}</h3>
                  <span className="modal-player">📸 Par {selectedPhoto.playerName || 'Anonyme'}</span>
                </div>
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
                <div className="modal-details">
                  <p>📅 {formatDate(selectedPhoto.timestamp)}</p>
                  <div className="modal-vote-section">
                    <button
                      onClick={() => voteForPhoto(selectedPhoto.id || `${selectedPhoto.enigmaId}_${selectedPhoto.timestamp}`)}
                      className={`modal-vote-btn ${hasUserVoted(selectedPhoto.id || `${selectedPhoto.enigmaId}_${selectedPhoto.timestamp}`) ? 'voted' : ''}`}
                      disabled={!currentPlayer}
                    >
                      ❤️ {getVoteCount(selectedPhoto.id || `${selectedPhoto.enigmaId}_${selectedPhoto.timestamp}`)} votes
                    </button>
                  </div>
                </div>
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

export default SharedPhotoGallery;