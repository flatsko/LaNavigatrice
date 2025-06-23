import React from 'react';
const EnigmaQuestion = ({ question }) => (
  <div className="enigma-question">
    <h3>{question.title}</h3>
    <p>{question.text}</p>
  </div>
);

export default EnigmaQuestion;