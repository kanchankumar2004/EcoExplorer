import React from 'react';
import './Button.css';

/**
 * Reusable Button component for the UI library.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button label or nested elements
 * @param {('primary'|'secondary'|'danger')} [props.variant='primary'] - Visual variant
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Button size
 * @param {boolean} [props.loading=false] - If true, displays loading spinner and disables click
 * @param {boolean} [props.disabled=false] - Disables interaction
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 * @param {string} [props.className=''] - Additional custom CSS classes
 * @param {function} [props.onClick] - Click event handler
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`ui-btn ui-btn-${variant} ui-btn-${size} ${loading ? 'ui-btn-loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <>
          <span className="ui-btn-spinner"></span>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
