import React from 'react';
import './Hero.css';

const Hero = ({ title, subtitle, backgroundImage }) => {
  return (
    <div 
      className="hero"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #2d5016 0%, #7fd051 100%)'
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default Hero;
