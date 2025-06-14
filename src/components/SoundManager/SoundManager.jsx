import React, { useEffect, useRef } from "react";

const SoundManager = ({ gameState, onSuccess, onError, onScan }) => {
  const audioContextRef = useRef(null);
  const soundsRef = useRef({});

  useEffect(() => {
    // Initialiser le contexte audio
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    // Créer les sons synthétiques
    createSounds();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const createSounds = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Son de succès (mélodie joyeuse)
    soundsRef.current.success = () => {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // Do, Mi, Sol, Do aigu
      notes.forEach((freq, index) => {
        setTimeout(() => playTone(freq, 0.3, "sine"), index * 150);
      });
    };

    // Son d'erreur (ton descendant)
    soundsRef.current.error = () => {
      const notes = [400, 350, 300]; // Tons descendants
      notes.forEach((freq, index) => {
        setTimeout(() => playTone(freq, 0.2, "sawtooth"), index * 100);
      });
    };

    // Son de scan QR (bip électronique)
    soundsRef.current.scan = () => {
      playTone(800, 0.1, "square");
      setTimeout(() => playTone(1000, 0.1, "square"), 100);
    };

    // Ambiance marine (vagues douces)
    soundsRef.current.ambient = () => {
      // Créer un bruit blanc filtré pour simuler les vagues
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 300;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.1;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();

      // Arrêter après 30 secondes
      setTimeout(() => {
        whiteNoise.stop();
      }, 30000);
    };
  };

  const playTone = (frequency, duration, type = "sine") => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  // Écouter les événements
  useEffect(() => {
    if (onSuccess && soundsRef.current.success) {
      soundsRef.current.success();
    }
  }, [onSuccess]);

  useEffect(() => {
    if (onError && soundsRef.current.error) {
      soundsRef.current.error();
    }
  }, [onError]);

  useEffect(() => {
    if (onScan && soundsRef.current.scan) {
      soundsRef.current.scan();
    }
  }, [onScan]);

  // Ambiance selon l'état du jeu
  useEffect(() => {
    if (gameState === "playing" && soundsRef.current.ambient) {
      // Jouer l'ambiance marine de temps en temps
      const interval = setInterval(() => {
        if (Math.random() < 0.3) {
          // 30% de chance
          soundsRef.current.ambient();
        }
      }, 60000); // Toutes les minutes

      return () => clearInterval(interval);
    }
  }, [gameState]);

  return null; // Composant invisible
};

export default SoundManager;
