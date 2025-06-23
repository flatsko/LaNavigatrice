import React from 'react';
const EnigmaImage = ({ image, alt, isSuccess }) => {
  if (!image) return null;

  return (
    <div className="enigma-image-container">
      <img
        src={image}
        alt={alt}
        className={`enigma-image ${isSuccess ? 'success-image' : ''}`}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    </div>
  );
};

export default EnigmaImage;