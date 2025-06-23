import React from 'react';
const AnswerOptions = ({ options, selectedAnswer, onSelect, disabled }) => (
  <div className="enigma-answers">
    <h4>Choisissez votre réponse :</h4>
    <div className="answer-options">
      {options.map(({ id, text }) => (
        <button
          key={id}
          className={`answer-option ${selectedAnswer === id ? 'selected' : ''}`}
          onClick={() => onSelect(id)}
          disabled={disabled}
        >
          {text}
        </button>
      ))}
    </div>
  </div>
);

export default AnswerOptions;