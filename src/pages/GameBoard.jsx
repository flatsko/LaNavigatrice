import React, { useState } from "react";
import Header from "../components/Header/Header";
import QRScanner from "../components/QRScanner/QRScanner";
import WorldMap from "../components/WorldMap/WorldMap";
import EnigmaCard from "../components/EnigmaCard/EnigmaCard";
import Leaderboard from "../components/Leaderboard/Leaderboard";
import { enigmas } from "../data/enigmas";

const GameBoard = ({ playerName, completedEnigmas, onCompleteEnigma }) => {
  const [currentEnigma, setCurrentEnigma] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleQRScan = (qrData) => {
    // Format attendu: "alison-treasure-1" pour l'énigma 1
    const match = qrData.match(/alison-treasure-(\d+)/);
    if (match) {
      const enigmaId = parseInt(match[1]);
      const enigma = enigmas.find((e) => e.id === enigmaId);

      if (enigma && !completedEnigmas.includes(enigmaId)) {
        setCurrentEnigma(enigma);
        setShowScanner(false);
      }
    }
  };

  const handleEnigmaSolve = (enigmaId) => {
    onCompleteEnigma(enigmaId);
    setCurrentEnigma(null);
  };

  return (
    <div className="game-board">
      <Header
        playerName={playerName}
        progress={completedEnigmas.length}
        total={7}
        onLeaderboardClick={() => setShowLeaderboard(true)}
      />

      <WorldMap completedEnigmas={completedEnigmas} enigmas={enigmas} />

      <div className="action-buttons">
        <button className="scan-button" onClick={() => setShowScanner(true)}>
          📷 Scanner QR Code
        </button>
      </div>

      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {currentEnigma && (
        <EnigmaCard
          enigma={currentEnigma}
          onSolve={handleEnigmaSolve}
          onClose={() => setCurrentEnigma(null)}
        />
      )}

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
};

export default GameBoard;
