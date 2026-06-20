import React from 'react';
import './Input.css';

/**
 * Reusable text Input component for the UI library.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.label] - Optional floating or normal text label
 * @param {string} [props.error] - Optional validation error message
 * @param {React.ReactNode} [props.icon] - Optional icon element to display inside input
 * @param {string} [props.type='text'] - Input type (text, password, email, etc.)
 * @param {string|number} props.value - Input value
 * @param {function} props.onChange - Input change handler
 * @param {string} [props.placeholder=''] - Placeholder text
 * @param {boolean} [props.disabled=false] - Disables interaction
 * @param {string} [props.className=''] - Additional custom CSS classes
 */
const Input = ({
  label,
  error,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className={`ui-input-group ${error ? 'ui-input-has-error' : ''} ${className}`}>
      {label && <label className="ui-input-label">{label}</label>}
      <div className="ui-input-wrapper">
        {icon && <span className="ui-input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`ui-input-field ${icon ? 'ui-input-with-icon' : ''}`}
          {...rest}
        />
      </div>
      {error && <span className="ui-input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
