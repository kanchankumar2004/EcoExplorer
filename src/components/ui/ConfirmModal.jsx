import React from 'react';
import './ConfirmModal.css';

/**
 * Reusable Confirmation Dialog component for destructive or sensitive actions.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {string} [props.title='Are you sure?'] - Confirmation title
 * @param {string} props.message - Descriptive warning message
 * @param {string} [props.confirmText='Confirm'] - Text for confirm button
 * @param {string} [props.cancelText='Cancel'] - Text for cancel button
 * @param {('danger'|'warning')} [props.variant='danger'] - Confirm button style variant
 * @param {string} [props.icon='⚠️'] - Modal header icon emoji
 * @param {function} props.onConfirm - Callback when user confirms action
 * @param {function} props.onCancel - Callback when user cancels
 */
const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon = '⚠️',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
        {icon && <div className="confirm-modal-icon">{icon}</div>}
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button type="button" className="confirm-btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={variant === 'warning' ? 'confirm-btn-warning' : 'confirm-btn-danger'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
