import React, { useState } from "react";

const Welcome = ({ onStart }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="ship-illustration">⚓</div>
        <h1 className="welcome-title">
          Le Trésor Littéraire du
          <br />
          <span className="captain-name">Capitaine Alison</span>
        </h1>

        <p className="welcome-subtitle">
          Embarquez pour une aventure à travers le monde !<br />
          Résolvez les énigmes et découvrez sa destination secrète...
        </p>

        <form onSubmit={handleSubmit} className="name-form">
          <div className="input-group">
            <label>Nom du navigateur :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez votre nom"
              className="name-input"
              required
            />
          </div>
          <button type="submit" className="start-button">
            🧭 Commencer l'Aventure
          </button>
        </form>

        <div className="floating-elements">
          <div className="wave wave-1">〜</div>
          <div className="wave wave-2">〜〜</div>
          <div className="compass">🧭</div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
