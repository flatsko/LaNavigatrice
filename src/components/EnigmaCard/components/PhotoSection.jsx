import React from 'react';
const PhotoSection = ({ isMobile, isSuccess, photoTaken, onTakePhoto, onContinue, photoPrompt }) => {
  if (isMobile) {
    return (
      <div className={`photo-section ${isSuccess ? '' : 'failure'}`}>
        <div className="photo-prompt">
          <h4>📸 Moment Souvenir</h4>
          <p>{photoPrompt || (isSuccess ? 'Immortalisez ce moment avec une photo de groupe !' : 'Même si cette énigme n\'a pas été résolue, immortalisez ce moment !')}</p>
          <div className="photo-actions">
            {!photoTaken ? (
              <>
                <button onClick={onTakePhoto} className="photo-btn primary">📸 Prendre une photo</button>
                <button onClick={onContinue} className="photo-btn secondary">Continuer sans photo</button>
              </>
            ) : (
              <div className="photo-taken">
                <span className="photo-success">✅ Photo prise !</span>
                <p>Fermeture automatique...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`desktop-photo-section ${isSuccess ? '' : 'failure'}`}>
      <div className="desktop-photo-prompt">
        <h4>📱 Photos Souvenirs</h4>
        <p>Pour prendre des photos souvenirs, utilisez votre téléphone portable !</p>
        <p className="desktop-photo-hint">💡 Scannez le QR code de cette énigme avec votre téléphone pour accéder à la fonctionnalité photo.</p>
        <button onClick={onContinue} className="photo-btn primary desktop-continue">Continuer l'aventure</button>
      </div>
    </div>
  );
};

export default PhotoSection;