import React from 'react';
const EnigmaFeedback = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className={`enigma-feedback ${feedback.type}`}>
      {feedback.message.split('\n').map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};

export default EnigmaFeedback;