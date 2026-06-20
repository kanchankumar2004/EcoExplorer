import React from 'react';
import './Loader.css';

/**
 * Reusable Loader/Spinner component for showing loading states.
 * 
 * @param {Object} props - Component props
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Loader size
 * @param {string} [props.text] - Optional text displayed below or next to the loader
 * @param {('spinner'|'pulse')} [props.variant='spinner'] - Visual loader variant
 */
const Loader = ({ size = 'md', text, variant = 'spinner' }) => {
  return (
    <div className={`ui-loader-container ui-loader-${variant}-container`}>
      {variant === 'spinner' ? (
        <div className={`ui-loader-spinner ui-loader-spinner-${size}`} />
      ) : (
        <div className={`ui-loader-pulse-dots ui-loader-pulse-dots-${size}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {text && <span className={`ui-loader-text ui-loader-text-${size}`}>{text}</span>}
    </div>
  );
};

export default Loader;
