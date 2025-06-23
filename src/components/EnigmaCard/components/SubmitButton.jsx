import React from 'react';
const SubmitButton = ({ onClick, disabled, isSubmitting }) => (
  <div className="enigma-actions">
    <button
      className="submit-btn"
      onClick={onClick}
      disabled={disabled}
    >
      {isSubmitting ? '⏳ Validation...' : '🔍 Valider'}
    </button>
  </div>
);

export default SubmitButton;