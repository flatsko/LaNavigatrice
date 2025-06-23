import React from "react";
import { GAME_RULES } from "../../../utils/scoring";

const EnigmaHeader = ({
  enigma,
  onClose,
  attempts,
  successRate,
  isSuccess,
}) => (
  <div className="enigma-header">
    <button className="enigma-close-btn" onClick={onClose}>
      ✕
    </button>
    <h2 className="enigma-title">{enigma.title}</h2>
    {!isSuccess && (
      <div className="enigma-progress">
        <div className="attempt-counter">
          <span
            className={`attempts ${
              attempts >= GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA ? "exhausted" : ""
            }`}
          >
            🎯 Tentatives : {attempts}/{GAME_RULES.MAX_ATTEMPTS_PER_ENIGMA}
          </span>
        </div>
        <div className="success-rate">
          <span className={`rate ${successRate < 50 ? "warning" : "good"}`}>
            📊 Réussite : {successRate}%
          </span>
        </div>
      </div>
    )}
  </div>
);

export default EnigmaHeader;
