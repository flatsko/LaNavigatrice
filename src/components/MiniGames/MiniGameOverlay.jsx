import React from 'react';
import './MiniGameOverlay.css';

const MiniGameOverlay = ({ children, onClose, isClosing = false }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`mini-game-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className="mini-game-container">
        {children}
      </div>
    </div>
  );
};

export default MiniGameOverlay;