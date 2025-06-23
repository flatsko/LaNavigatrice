import React from 'react';
const EnigmaFeedback = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className={`enigma-feedback ${feedback.type}`}>
      {feedback.message.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      {feedback.funFact && (
        <div className="fun-fact">
          <h3>Le saviez-vous ?</h3>
          <p>{feedback.funFact}</p>
        </div>
      )}
    </div>
  );
};

export default EnigmaFeedback;