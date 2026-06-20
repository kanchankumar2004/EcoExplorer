import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Reusable modal dialog component.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Determines if the modal is shown
 * @param {function} props.onClose - Callback triggered when closing the modal
 * @param {string} [props.title] - Optional modal title
 * @param {React.ReactNode} props.children - Modal content body
 * @param {React.ReactNode} [props.footer] - Optional modal footer action buttons
 */
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className="ui-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="ui-modal-header">
          {title && <h3 className="ui-modal-title">{title}</h3>}
          <button className="ui-modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        
        <div className="ui-modal-body">
          {children}
        </div>

        {footer && (
          <div className="ui-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
