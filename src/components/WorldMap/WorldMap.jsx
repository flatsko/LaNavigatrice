import React, { useState, useRef } from "react";
import "../../styles/worldmap.css";

const WorldMap = ({
  completedEnigmas = [],
  failedEnigmas = [],
  enigmas = [],
  onLocationClick,
  onResetStorage,
  player = null,
}) => {
  const mapContainerRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapDimensions, setMapDimensions] = useState({
    width: 793,
    height: 793,
  });

  // Vérification de sécurité
  if (!enigmas || !Array.isArray(enigmas)) {
    console.error("WorldMap: enigmas prop is required and must be an array");
    return (
      <div className="error-message">
        Erreur: Données des destinations manquantes
      </div>
    );
  }

  const mapPoints = enigmas.map((enigma) => ({
    ...enigma,
    completed: completedEnigmas.includes(enigma.id),
    failed: failedEnigmas.includes(enigma.id),
    status: completedEnigmas.includes(enigma.id)
      ? "completed"
      : failedEnigmas.includes(enigma.id)
      ? "failed"
      : "pending",
  }));

  // Gestion du zoom avec pinch sur mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      // Single touch - pan
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Empêcher le scroll de la page

    if (e.touches.length === 1 && isDragging) {
      // Single touch - pan
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Gestion du zoom avec la molette (desktop)
  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = Math.max(
      0.8,
      Math.min(3, zoom + (e.deltaY > 0 ? -0.1 : 0.1))
    );
    setZoom(newZoom);
  };

  // Réinitialiser la vue
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Calculer la position des points en pourcentages
  const getPointPosition = (coordinates) => {
    const xPercent = (coordinates.x / 793) * 100;
    const yPercent = (coordinates.y / 793) * 100;

    return {
      x: `${xPercent}%`,
      y: `${yPercent}%`,
    };
  };

  // Gestion du clic sur une destination
  const handleDestinationClick = (enigmaId) => {
    console.log("🗺️ Clic sur destination:", enigmaId);

    if (onLocationClick) {
      onLocationClick(enigmaId);
    }
  };

  // Gestion du tooltip sur mobile
  const handlePointTouch = (point, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (hoveredPoint?.id === point.id) {
      // Si déjà sélectionné, ouvrir l'énigme
      handleDestinationClick(point.id);
      setHoveredPoint(null);
    } else {
      // Sinon, afficher le tooltip
      setHoveredPoint(point);
      const mapContainer = mapContainerRef.current;
      if (mapContainer) {
        const rect = mapContainer.getBoundingClientRect();
        const touch = event.touches[0] || event.changedTouches[0];
        const relativeX = touch.clientX - rect.left;
        const relativeY = touch.clientY - rect.top;

        // Ajuster la position pour éviter que le tooltip sorte du cadre
        const tooltipWidth = 200;
        const tooltipHeight = 80;
        const padding = 10;

        let x = relativeX + padding;
        let y = relativeY - tooltipHeight - padding;

        // Vérifier les limites horizontales
        if (x + tooltipWidth > rect.width) {
          x = relativeX - tooltipWidth - padding;
        }
        if (x < 0) {
          x = padding;
        }

        // Vérifier les limites verticales
        if (y < 0) {
          y = relativeY + padding;
        }
        if (y + tooltipHeight > rect.height) {
          y = rect.height - tooltipHeight - padding;
        }

        setTooltipPosition({ x, y });
      }
    }
  };

  // Fermer le tooltip en touchant ailleurs
  const handleMapTouch = () => {
    if (hoveredPoint) {
      setHoveredPoint(null);
    }
  };

  const handleImageLoad = (e) => {
    setMapDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
  };

  return (
    <div className="world-map-container">
      {/* Header compact pour mobile */}
      <div className="map-header">
        <h3>🗺️ Votre Voyage Maritime</h3>
        <div className="progress-indicator">
          <span className="completed-count">{completedEnigmas.length}</span>
          <span className="total-count">/{enigmas.length}</span>
          <span className="progress-label">destinations</span>
        </div>
      </div>

      {/* Contrôles simplifiés pour mobile */}
      <div className="map-controls">
        <button onClick={resetView} className="reset-view-btn">
          🎯 Centrer
        </button>
        <div className="zoom-info">Zoom: {Math.round(zoom * 100)}%</div>
      </div>

      {/* Carte du monde */}
      <div
        className="world-map"
        ref={mapContainerRef}
        onTouchStart={handleMapTouch}
      >
        <div
          className="map-container"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${
              pan.y / zoom
            }px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Image de la carte carrée */}
          <img
            src="/images/world-map.png"
            alt="Carte du monde"
            className="world-map-image"
            onLoad={handleImageLoad}
            draggable={false}
          />

          {/* Overlay pour les points d'énigmes */}
          <div className="map-overlay">
            {mapPoints.map((point) => {
              const position = getPointPosition(point.coordinates);

              return (
                <div
                  key={point.id}
                  className={`map-point ${point.status} ${
                    hoveredPoint?.id === point.id ? "selected" : ""
                  }`}
                  style={{
                    left: position.x,
                    top: position.y,
                    transform: "translate(-50%, -50%)",
                  }}
                  onTouchStart={(e) => handlePointTouch(point, e)}
                  onClick={() => handleDestinationClick(point.id)}
                >
                  {/* Point principal */}
                  <div className={`point-circle ${point.status}`}>
                    {point.completed && <span className="point-icon">✓</span>}
                    {point.failed && <span className="point-icon">✗</span>}
                    {!point.completed && !point.failed && (
                      <span className="point-icon">?</span>
                    )}
                  </div>

                  {/* Effet de pulsation pour les énigmes non résolues */}
                  {!point.completed && !point.failed && (
                    <div className="pulse-ring"></div>
                  )}

                  {/* Label du pays - toujours visible sur mobile */}
                  <div className="country-label mobile-visible">
                    <span className="country-flag">{point.flag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tooltip mobile */}
        {hoveredPoint && (
          <div
            className="map-tooltip mobile-tooltip"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              position: "absolute",
              zIndex: 1000,
            }}
          >
            <div className="tooltip-header">
              <span className="tooltip-flag">{hoveredPoint.flag}</span>
              <span className="tooltip-title">{hoveredPoint.title}</span>
            </div>
            <div className="tooltip-status">
              {hoveredPoint.status === "completed"
                ? "✅ Exploré"
                : hoveredPoint.status === "failed"
                ? "💔 Échoué"
                : "🔒 Cherchez moi"}
            </div>
          </div>
        )}
      </div>

      {/* Résumé moderne avec statistiques détaillées */}
      <div className="progress-summary modern">
        <div className="summary-card completed">
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <span className="card-number">{completedEnigmas.length}</span>
            <span className="card-label">Destinations Explorées</span>
            <div className="card-progress">
              <div
                className="progress-bar-fill completed"
                style={{
                  width: `${(completedEnigmas.length / enigmas.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="summary-card failed">
          <div className="card-icon">💔</div>
          <div className="card-content">
            <span className="card-number">{failedEnigmas.length}</span>
            <span className="card-label">Tentatives Échouées</span>
            <div className="card-progress">
              <div
                className="progress-bar-fill failed"
                style={{
                  width: `${(failedEnigmas.length / enigmas.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="summary-card remaining">
          <div className="card-icon">🗺️</div>
          <div className="card-content">
            <span className="card-number">
              {enigmas.length - completedEnigmas.length - failedEnigmas.length}
            </span>
            <span className="card-label">À Découvrir</span>
            <div className="card-progress">
              <div
                className="progress-bar-fill remaining"
                style={{
                  width: `${
                    ((enigmas.length -
                      completedEnigmas.length -
                      failedEnigmas.length) /
                      enigmas.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      {/* <div className="global-stats">
        <div className="stat-item">
          <span className="stat-label">Taux de réussite</span>
          <span className="stat-value">
            {enigmas.length > 0 ? Math.round((completedEnigmas.length / enigmas.length) * 100) : 0}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Progression totale</span>
          <span className="stat-value">
            {enigmas.length > 0 ? Math.round(((completedEnigmas.length + failedEnigmas.length) / enigmas.length) * 100) : 0}%
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default WorldMap;
