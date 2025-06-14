import React from "react";
import { calculateDetailedStats } from "../../utils/scoring";
import { ENIGMAS } from "../../data/enigmas";
import "../../styles/failure.css";

const FailurePage = ({
  player,
  onRestart,
  onViewLeaderboard,
  failureReason,
}) => {
  const stats = calculateDetailedStats(player);
  const completed = player?.completed || [];
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
              <div className="stat-detail">3 tentatives épuisées</div>
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

        <div className="failure-actions">
          <button className="btn btn-primary btn-large" onClick={onRestart}>
            ⛵ Reprendre la Navigation
          </button>
        </div>

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
