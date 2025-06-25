import React from 'react';
const EnigmaFeedback = ({ feedback }) => {
  // Toujours afficher quelque chose, même sans feedback
  const displayFeedback = feedback || {
    type: 'neutral',
    message: '💭 Prenez votre temps pour réfléchir...'
  };

  return (
    <div className={`enigma-feedback ${displayFeedback.type}`}>
      {displayFeedback.message.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      {displayFeedback.funFact && (
        <div className="fun-fact">
          <h3>Le saviez-vous ?</h3>
          <p>{displayFeedback.funFact}</p>
        </div>
      )}
    </div>
  );
};

export default EnigmaFeedback;