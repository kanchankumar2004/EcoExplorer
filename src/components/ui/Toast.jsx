import React, { useEffect } from 'react';
import './Toast.css';

/**
 * Reusable notification Toast component.
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display inside toast
 * @param {('success'|'error'|'info')} [props.type='success'] - Toast type
 * @param {function} props.onClose - Callback triggered when closing toast
 * @param {number} [props.duration=3000] - Duration in ms before toast auto-dismisses
 */
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div className={`ui-toast ui-toast-${type}`} role="alert">
      <span className="ui-toast-icon">{getIcon()}</span>
      <span className="ui-toast-message">{message}</span>
      <button className="ui-toast-close-btn" onClick={onClose} aria-label="Close notification">
        &times;
      </button>
      <div 
        className="ui-toast-progress" 
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export default Toast;
