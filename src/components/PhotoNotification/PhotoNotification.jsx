import React, { useEffect, useState } from "react";
import "./PhotoNotification.css";

const PhotoNotification = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre la fin de l'animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`photo-notification ${type} ${
        isVisible ? "visible" : "hidden"
      }`}
    >
      <div className="notification-content">
        <span className="notification-icon">
          {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
        </span>
        <span className="notification-message">{message}</span>
        <button
          className="notification-close"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default PhotoNotification;
