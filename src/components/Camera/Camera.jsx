import React, { useRef, useState, useEffect } from "react";
import "./Camera.css";

const Camera = ({ onCapture, onClose, enigmaTitle }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // AJOUT: Utiliser une ref pour le stream
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [cameraFacing, setCameraFacing] = useState("environment"); // AJOUT: État pour la caméra

  useEffect(() => {
    console.log("📸 Camera component mounted for:", enigmaTitle);

    // AJOUT: Forcer la position et empêcher le scroll
    document.body.classList.add("camera-open");
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    // AJOUT: Scroll vers le haut pour s'assurer que la caméra est visible
    window.scrollTo(0, 0);

    startCamera();

    return () => {
      console.log("📸 Camera component unmounting");
      // AJOUT: Restaurer le scroll
      document.body.classList.remove("camera-open");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      stopCamera();
    };
  }, [enigmaTitle, cameraFacing]); // AJOUT: Redémarrer quand cameraFacing change

  // AJOUT: Gérer la touche Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsReady(false);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia non supporté");
      }

      // MODIFICATION: Contraintes similaires à QRScanner
      const constraints = [
        // Configuration premium
        {
          video: {
            facingMode: { exact: cameraFacing },
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            focusMode: "continuous",
            exposureMode: "continuous",
          },
        },
        // Configuration standard
        {
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        // Fallback sans facingMode exact
        {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        // Dernière chance
        { video: true },
      ];

      let stream = null;

      for (const constraint of constraints) {
        try {
          console.log("🎥 Tentative caméra avec:", constraint);
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          console.log("✅ Stream obtenu avec:", constraint);
          break;
        } catch (err) {
          console.log("❌ Échec avec:", constraint, err.name);
          continue;
        }
      }

      if (!stream) {
        throw new Error("Impossible d'obtenir le stream caméra");
      }

      streamRef.current = stream; // MODIFICATION: Utiliser la ref

      // Analyser les capacités de la caméra
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings ? track.getSettings() : {};
      console.log("📹 Paramètres caméra:", settings);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;

        videoRef.current.onloadedmetadata = () => {
          console.log("📐 Métadonnées chargées:", {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
            facing: cameraFacing,
          });
        };

        try {
          await videoRef.current.play();
          console.log("▶️ Lecture vidéo démarrée");

          const checkVideoReady = () => {
            if (
              videoRef.current &&
              videoRef.current.videoWidth > 0 &&
              videoRef.current.videoHeight > 0 &&
              videoRef.current.readyState >= 3
            ) {
              console.log("✅ Vidéo prête pour capture");
              setIsReady(true);
            } else {
              console.log("⏳ Vidéo pas encore prête, nouvelle tentative...");
              setTimeout(checkVideoReady, 500);
            }
          };

          setTimeout(checkVideoReady, 200);
        } catch (playError) {
          console.error("❌ Erreur lecture vidéo:", playError);
          setError("Cliquez pour démarrer la caméra");
        }
      }
    } catch (err) {
      console.error("❌ Erreur caméra complète:", err);
      handleCameraError(err);
    }
  };

  // NOUVELLE FONCTION: Gestion des erreurs (similaire à QRScanner)
  const handleCameraError = (err) => {
    let errorMessage = "Erreur caméra";

    switch (err.name) {
      case "NotAllowedError":
        errorMessage = "Permission caméra refusée";
        break;
      case "NotFoundError":
        errorMessage = "Caméra non trouvée";
        break;
      case "OverconstrainedError":
        errorMessage = `Caméra ${
          cameraFacing === "environment" ? "arrière" : "frontale"
        } non compatible`;
        break;
      default:
        errorMessage = err.message || "Erreur inconnue";
    }

    setError(errorMessage);
    setIsReady(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      // MODIFICATION: Utiliser la ref
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsReady(false);
  };

  // MODIFICATION: Nouvelle logique de changement de caméra (similaire à QRScanner)
  const switchCamera = () => {
    const newFacing = cameraFacing === "environment" ? "user" : "environment";
    console.log(`🔄 Changement caméra: ${cameraFacing} → ${newFacing}`);
    setCameraFacing(newFacing);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Définir la taille du canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // AJOUT: Appliquer un miroir pour la caméra frontale
    if (cameraFacing === "user") {
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0);
      context.scale(-1, 1); // Remettre à l'état normal
    } else {
      // Dessiner normalement pour la caméra arrière
      context.drawImage(video, 0, 0);
    }

    // Convertir en blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const photoData = {
            blob,
            dataUrl: canvas.toDataURL("image/jpeg", 0.8),
            timestamp: new Date().toISOString(),
            enigmaId: enigmaTitle,
            filename: `photo_${enigmaTitle}_${Date.now()}.jpg`,
            cameraFacing, // AJOUT: Inclure l'info de la caméra
          };
          onCapture(photoData);
        }
      },
      "image/jpeg",
      0.8
    );
  };

  // AJOUT: Fonction pour forcer le démarrage
  const forceStart = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsReady(true);
        setError(null);
      } catch (err) {
        setError("Impossible de démarrer la vidéo");
      }
    }
  };

  // AJOUT: Fonction pour fermer proprement
  const handleClose = () => {
    console.log("📸 Fermeture caméra demandée");
    // AJOUT: Restaurer le scroll avant de fermer
    document.body.classList.remove("camera-open");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.height = "";
    onClose();
  };

  if (error) {
    return (
      <div
        className="camera-fullscreen-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          backgroundColor: "rgba(0, 0, 0, 0.95)",
        }}
      >
        <div className="camera-error">
          <div className="error-icon">📷</div>
          <h4>{error}</h4>
          <div className="error-actions">
            <button onClick={forceStart} className="camera-btn primary">
              🔄 Réessayer
            </button>
            <button onClick={switchCamera} className="camera-btn secondary">
              🔄 Changer caméra (
              {cameraFacing === "environment" ? "→ Frontale" : "→ Arrière"})
            </button>
            <button onClick={handleClose} className="camera-btn secondary">
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="camera-fullscreen-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
      }}
    >
      <div className="camera-header">
        <h3>📸 Photo souvenir - {enigmaTitle}</h3>
        <div className="camera-info">
          <span className="camera-indicator">
            {cameraFacing === "environment" ? "📷 Arrière" : "🤳 Frontale"}
          </span>
        </div>
        <button onClick={handleClose} className="camera-close">
          ✕
        </button>
      </div>

      <div className="camera-viewport">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`camera-video ${cameraFacing}`}
          style={{
            // AJOUT: Miroir pour caméra frontale dans l'aperçu
            transform: cameraFacing === "user" ? "scaleX(-1)" : "none",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {!isReady && (
          <div className="camera-loading">
            <div className="loading-spinner"></div>
            <p>
              {cameraFacing === "environment"
                ? "Chargement caméra arrière..."
                : "Chargement caméra frontale..."}
            </p>
            <button className="force-start-btn" onClick={forceStart}>
              🎥 Démarrer manuellement
            </button>
          </div>
        )}
      </div>

      <div className="camera-controls">
        <button onClick={switchCamera} className="camera-btn secondary">
          🔄 {cameraFacing === "environment" ? "Frontale" : "Arrière"}
        </button>
        <button
          onClick={capturePhoto}
          className="camera-btn primary"
          disabled={!isReady}
        >
          📸 Capturer
        </button>
        <button onClick={handleClose} className="camera-btn secondary">
          Annuler
        </button>
      </div>
    </div>
  );
};

export default Camera;
