import React, { useState, useEffect } from 'react';
import { THEMES, getCurrentTheme, saveTheme, applyThemeVariables } from '../../data/themes';
import './ThemeSelector.css';

const ThemeSelector = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Appliquer le thème au chargement
    applyThemeVariables(currentTheme);
  }, []);

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    saveTheme(theme.id.toUpperCase());
    applyThemeVariables(theme);
    setIsOpen(false);
    
    // Notifier le parent du changement de thème
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  return (
    <div className="theme-selector">
      <button 
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Changer de thème"
      >
        <span className="theme-icon">{currentTheme.texts.shipIcon}</span>
        <span className="theme-name">{currentTheme.name}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          {Object.values(THEMES).map((theme) => (
            <button
              key={theme.id}
              className={`theme-option ${currentTheme.id === theme.id ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme)}
            >
              <span className="theme-option-icon">{theme.texts.shipIcon}</span>
              <div className="theme-option-content">
                <span className="theme-option-name">{theme.name}</span>
                <span className="theme-option-description">{theme.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;