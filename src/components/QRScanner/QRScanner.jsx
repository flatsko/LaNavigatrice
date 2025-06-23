import React, { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import "../../styles/qrscanner.css";

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");
  const [detectedQR, setDetectedQR] = useState("");
  const [lastScanTime, setLastScanTime] = useState(0);
  const [focusMode, setFocusMode] = useState("continuous");
  const intervalRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [cameraFacing, focusMode]);

  const startCamera = async () => {
    try {
      setError(null);
      setCameraReady(false);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia non supporté");
      }

      // Contraintes optimisées pour la caméra arrière
      const constraints = [
        // Configuration premium pour caméra arrière
        {
          video: {
            facingMode: { exact: cameraFacing },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            focusMode: "continuous",
            exposureMode: "continuous",
            whiteBalanceMode: "continuous",
            zoom: { ideal: 1.0, max: 2.0 },
            // Paramètres spécifiques pour QR codes
            focusDistance: { ideal: 0.5, min: 0.1, max: 1.0 },
            iso: { ideal: 400, min: 100, max: 1600 },
            brightness: { ideal: 0.1, min: -0.5, max: 0.5 },
            contrast: { ideal: 1.3, min: 0.8, max: 2.0 },
            saturation: { ideal: 0.8, min: 0.5, max: 1.5 },
            sharpness: { ideal: 1.2, min: 0.8, max: 2.0 },
          },
        },
        // Configuration standard
        {
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            focusMode: "continuous",
            exposureMode: "continuous",
          },
        },
        // Configuration basique
        {
          video: {
            facingMode: cameraFacing,
            width: { ideal: 640 },
            height: { ideal: 480 },
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
      let usedConstraint = null;

      for (const constraint of constraints) {
        try {
          console.log("🎥 Tentative caméra avec:", constraint);
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          usedConstraint = constraint;
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

      streamRef.current = stream;

      // Analyser les capacités de la caméra
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      const settings = track.getSettings ? track.getSettings() : {};

      console.log("📹 Capacités caméra:", capabilities);
      console.log("⚙️ Paramètres actuels:", settings);

      // Optimiser les paramètres pour la caméra arrière
      if (cameraFacing === "environment" && track.applyConstraints) {
        try {
          const constraints = {};

          // Focus - priorité à la mise au point continue
          if (capabilities.focusMode) {
            if (capabilities.focusMode.includes("continuous")) {
              constraints.focusMode = "continuous";
            } else if (capabilities.focusMode.includes("single-shot")) {
              constraints.focusMode = "single-shot";
            }
          }

          // Distance de focus optimale pour QR codes (environ 20-30cm)
          if (capabilities.focusDistance) {
            constraints.focusDistance = {
              ideal: 0.25, // 25cm
              min: 0.1,
              max: 1.0,
            };
          }

          // Exposition
          if (capabilities.exposureMode?.includes("manual")) {
            constraints.exposureMode = "manual";
            if (capabilities.exposureTime) {
              constraints.exposureTime = {
                ideal: 0.01, // 10ms
                min: 0.005,
                max: 0.02,
              };
            }
          } else if (capabilities.exposureMode?.includes("continuous")) {
            constraints.exposureMode = "continuous";
          }

          // Balance des blancs
          if (capabilities.whiteBalanceMode?.includes("continuous")) {
            constraints.whiteBalanceMode = "continuous";
          }

          // ISO pour réduire le bruit
          if (capabilities.iso) {
            constraints.iso = {
              ideal: 200,
              min: 100,
              max: 800,
            };
          }

          // Zoom léger pour améliorer la netteté
          if (capabilities.zoom) {
            constraints.zoom = {
              ideal: Math.min(1.2, capabilities.zoom.max),
              min: 1.0,
              max: Math.min(2.0, capabilities.zoom.max),
            };
          }

          // Netteté
          if (capabilities.sharpness) {
            constraints.sharpness = {
              ideal: 0.8,
              min: 0.5,
              max: 1.0,
            };
          }

          await track.applyConstraints(constraints);
          console.log("✅ Paramètres optimisés appliqués:", constraints);

          // Attendre un peu pour que les paramètres se stabilisent
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (constraintError) {
          console.log(
            "⚠️ Impossible d'appliquer les contraintes optimisées:",
            constraintError
          );
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;

        // Événements pour la caméra arrière
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
              console.log("✅ Vidéo prête pour scan");
              setCameraReady(true);
              setIsScanning(true);

              // Délai supplémentaire pour la caméra arrière (mise au point)
              setTimeout(
                () => {
                  startScanning();
                },
                cameraFacing === "environment" ? 1000 : 500
              );
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

  const handleCameraError = (err) => {
    let errorMessage = "Erreur caméra";
    let suggestions = [];

    switch (err.name) {
      case "NotAllowedError":
        errorMessage = "Permission caméra refusée";
        suggestions = [
          "Autorisez l'accès à la caméra",
          "Vérifiez les paramètres du navigateur",
          "Rechargez la page",
        ];
        break;
      case "NotFoundError":
        errorMessage = "Caméra non trouvée";
        suggestions = [
          "Vérifiez que votre appareil a une caméra",
          "Essayez de changer de caméra",
          "Redémarrez l'application",
        ];
        break;
      case "OverconstrainedError":
        errorMessage = "Caméra arrière non compatible";
        suggestions = [
          "Votre caméra ne supporte pas les paramètres demandés",
          "Essayez la caméra frontale",
          "Utilisez un autre navigateur",
        ];
        break;
      default:
        errorMessage = err.message || "Erreur inconnue";
        suggestions = [
          "Réessayez",
          "Changez de caméra",
          "Utilisez la saisie manuelle",
        ];
    }

    setError({ message: errorMessage, suggestions });
    setCameraReady(false);
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setCameraReady(false);
  };

  // Fonction pour gérer la détection QR
  const handleQRDetection = (qrText, now, canvas) => {
    setDetectedQR(qrText);
    setLastScanTime(now);

    // Feedback visuel renforcé pour caméra arrière
    canvas.style.border = "4px solid #00ff00";
    canvas.style.boxShadow = "0 0 20px #00ff00";

    setTimeout(() => {
      if (canvas) {
        canvas.style.border = "none";
        canvas.style.boxShadow = "none";
      }
    }, 800);

    // Vibration plus forte pour caméra arrière
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // Délai plus long pour caméra arrière (éviter les faux positifs)
    const triggerDelay = cameraFacing === "environment" ? 1500 : 1000;

    setTimeout(() => {
      console.log("🚀 Déclenchement onScan avec:", qrText);
      stopCamera();
      onScan(qrText);
    }, triggerDelay);

    setIsScanning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Scan optimisé pour caméra arrière
  const startScanning = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    console.log("🔍 Démarrage scan optimisé pour", cameraFacing);

    // Fréquence adaptée selon la caméra
    const scanInterval = cameraFacing === "environment" ? 400 : 300;

    intervalRef.current = setInterval(() => {
      if (
        !videoRef.current ||
        !canvasRef.current ||
        !cameraReady ||
        !isScanning
      ) {
        return;
      }

      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (
          video.readyState < 3 ||
          video.videoWidth === 0 ||
          video.videoHeight === 0
        ) {
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dessiner l'image de base
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Amélioration de l'image pour la caméra arrière
        if (cameraFacing === "environment") {
          // Appliquer des filtres après le dessin pour la caméra arrière
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Amélioration du contraste et de la luminosité pixel par pixel
          for (let i = 0; i < data.length; i += 4) {
            // Convertir en niveaux de gris pour améliorer la détection
            const gray =
              0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

            // Appliquer un seuil adaptatif
            const threshold = gray > 128 ? 255 : 0;

            data[i] = threshold; // Rouge
            data[i + 1] = threshold; // Vert
            data[i + 2] = threshold; // Bleu
            // Alpha reste inchangé
          }

          ctx.putImageData(imageData, 0, 0);
        }

        // Obtenir les données d'image après traitement
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Essayer plusieurs approches de détection
        const scanMethods = [
          { inversionAttempts: "attemptBoth" },
          { inversionAttempts: "dontInvert" },
          { inversionAttempts: "onlyInvert" },
        ];

        // Essayer la détection avec l'image traitée
        for (const method of scanMethods) {
          const code = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            method
          );

          if (code && code.data && code.data.trim()) {
            const qrText = code.data.trim();
            const now = Date.now();

            if (qrText !== detectedQR || now - lastScanTime > 2000) {
              console.log("🎯 QR détecté avec", cameraFacing, ":", qrText);
              handleQRDetection(qrText, now, canvas);
              return;
            }
          }
        }

        // Pour la caméra arrière, essayer aussi avec une résolution réduite
        if (cameraFacing === "environment") {
          // Créer une version réduite pour améliorer la détection
          const smallCanvas = document.createElement("canvas");
          const smallCtx = smallCanvas.getContext("2d");
          const scale = 0.7; // Augmenter légèrement la taille
          smallCanvas.width = canvas.width * scale;
          smallCanvas.height = canvas.height * scale;

          // Redessiner l'image originale (sans traitement) à une taille réduite
          smallCtx.drawImage(
            video,
            0,
            0,
            smallCanvas.width,
            smallCanvas.height
          );

          const smallImageData = smallCtx.getImageData(
            0,
            0,
            smallCanvas.width,
            smallCanvas.height
          );

          // Essayer avec l'image réduite
          for (const method of scanMethods) {
            const code = jsQR(
              smallImageData.data,
              smallImageData.width,
              smallImageData.height,
              method
            );

            if (code && code.data && code.data.trim()) {
              const qrText = code.data.trim();
              const now = Date.now();

              if (qrText !== detectedQR || now - lastScanTime > 2000) {
                console.log(
                  "🎯 QR détecté (image réduite) avec",
                  cameraFacing,
                  ":",
                  qrText
                );
                handleQRDetection(qrText, now, canvas);
                return;
              }
            }
          }
        }

        for (const method of scanMethods) {
          const code = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            method
          );

          if (code && code.data && code.data.trim()) {
            const qrText = code.data.trim();
            const now = Date.now();

            if (qrText !== detectedQR || now - lastScanTime > 2000) {
              console.log(
                "🎯 QR détecté (image normale) avec",
                cameraFacing,
                ":",
                qrText
              );
              handleQRDetection(qrText, now, canvas);
              return; // Sortir de la boucle des méthodes
            }
          }
        }

        // Nettoyer l'affichage si aucun QR
        const now = Date.now();
        if (detectedQR && now - lastScanTime > 4000) {
          setDetectedQR("");
        }
      } catch (scanError) {
        console.error("❌ Erreur scan:", scanError);
      }
    }, scanInterval);
  };

  // Fonction pour forcer la mise au point (caméra arrière)
  const forceFocus = async () => {
    if (streamRef.current && cameraFacing === "environment") {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && track.applyConstraints) {
        try {
          // Forcer une nouvelle mise au point
          await track.applyConstraints({
            focusMode: "single-shot",
          });

          setTimeout(async () => {
            await track.applyConstraints({
              focusMode: "continuous",
            });
          }, 1000);

          console.log("🎯 Mise au point forcée");
        } catch (err) {
          console.log("⚠️ Impossible de forcer la mise au point:", err);
        }
      }
    }
  };

  const forceStart = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setCameraReady(true);
        setIsScanning(true);
        startScanning();
        setError(null);
      } catch (err) {
        setError("Impossible de démarrer la vidéo");
      }
    }
  };

  const switchCamera = () => {
    const newFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(newFacing);
  };

  const handleManualInput = () => {
    const code = prompt("Entrez le code du QR ou l'ID de l'énigme:");
    if (code?.trim()) {
      stopCamera();
      onScan(code.trim());
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const testScan = () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) {
      alert("❌ Caméra non prête. Attendez l'initialisation complète.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Vérifier que la vidéo a des dimensions valides
    if (!video.videoWidth || !video.videoHeight || video.readyState < 3) {
      alert(
        "❌ Vidéo non prête. Vérifiez que la caméra fonctionne correctement."
      );
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Appliquer les mêmes améliorations que le scan auto
      if (cameraFacing === "environment") {
        ctx.filter = "contrast(1.3) brightness(1.1) saturate(0.8)";
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none";

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const modes = ["attemptBoth", "onlyInvert", "dontInvert"];

      for (const mode of modes) {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: mode,
        });

        if (code && code.data) {
          console.log(`✅ QR trouvé avec mode ${mode}:`, code.data);
          alert(
            `✅ QR détecté: "${code.data}"\nMode: ${mode}\nCaméra: ${cameraFacing}`
          );
          onScan(code.data.trim());
          return;
        }
      }

      alert(
        `❌ Aucun QR détecté\nCaméra: ${cameraFacing}\nRésolution: ${canvas.width}x${canvas.height}`
      );
    } catch (error) {
      console.error("Erreur lors du test scan:", error);
      alert(`❌ Erreur lors du scan: ${error.message}`);
    }
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        {/* Bouton de fermeture repositionné en haut à droite */}
        <button className="qr-close-btn" onClick={handleClose}>
          ✕
        </button>

        <div className="scanner-header">
          <h3>🔍 Scanner le QR Code</h3>
        </div>

        <div className="scanner-content">
          {/* Indicateur de caméra active */}

          {/* Affichage du QR détecté */}
          {detectedQR && (
            <div className="qr-detected-banner">
              <div className="detected-info">
                🎯 <strong>QR détecté:</strong> {detectedQR}
              </div>
              <div className="auto-trigger-info">
                ⏱️ Validation automatique dans{" "}
                {cameraFacing === "environment" ? "1.5" : "1"} seconde...
              </div>
            </div>
          )}

          <div className="camera-container">
            {!cameraReady && !error && (
              <div className="camera-status">
                <div className="loading-spinner"></div>
                <p>
                  {cameraFacing === "environment"
                    ? "Initialisation caméra arrière..."
                    : "Initialisation caméra frontale..."}
                </p>
                <button className="force-start-btn" onClick={forceStart}>
                  🎥 Démarrer manuellement
                </button>
              </div>
            )}

            <div
              className="video-container"
              style={{ display: cameraReady ? "block" : "none" }}
            >
              <video
                ref={videoRef}
                className={`camera-video ${cameraFacing}`}
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "cover",
                  backgroundColor: "#000",
                  // Miroir pour caméra frontale seulement
                  transform: cameraFacing === "user" ? "scaleX(-1)" : "none",
                }}
              />

              <div className="scan-overlay">
                <div className={`scan-frame ${cameraFacing}`}>
                  <div className="scan-corners">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                  </div>
                </div>
                {isScanning && (
                  <div className={`scan-line ${cameraFacing}`}></div>
                )}
              </div>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            {error && (
              <div className="camera-error">
                <div className="error-icon">📷</div>
                <h4>{typeof error === "string" ? error : error.message}</h4>
                {error.suggestions && (
                  <ul className="error-suggestions">
                    {error.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                )}
                <button className="force-start-btn" onClick={forceStart}>
                  🔄 Réessayer
                </button>
              </div>
            )}
          </div>

          <div className="scanner-instructions">
            <div className="instruction-content">
              <p>
                {isScanning
                  ? `🔍 Scan automatique actif - ${
                      cameraFacing === "environment"
                        ? "Maintenez stable, éclairage suffisant requis"
                        : "Pointez vers le QR"
                    }`
                  : cameraReady
                  ? "Caméra prête - Scan automatique en cours"
                  : "Initialisation..."}
              </p>
            </div>

            <div className="scanner-actions">
              {!cameraReady && (
                <button className="force-start-btn" onClick={forceStart}>
                  🚀 Forcer démarrage
                </button>
              )}
            </div>

            {/* Contrôles de caméra et boutons principaux repositionnés en bas */}
            <div className="camera-controls-bottom">
              {/* Contrôles de caméra */}
              {cameraReady && (
                <div className="camera-controls">
                  <button className="switch-camera-btn" onClick={switchCamera}>
                    🔄 Changer caméra (
                    {cameraFacing === "environment" ? "→ Frontale" : "→ Arrière"})
                  </button>

                  {cameraFacing === "environment" && (
                    <button className="focus-btn" onClick={forceFocus}>
                      🎯 Forcer mise au point
                    </button>
                  )}
                </div>
              )}
              
              {/* Boutons principaux */}
              <div className="main-buttons">
                {cameraReady && cameraFacing === "environment" && (
                  <button className="test-scan-btn" onClick={testScan}>
                    📱 Scanner QR Code
                  </button>
                )}

                <button className="manual-input-btn" onClick={handleManualInput}>
                  📝 Saisie manuelle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
