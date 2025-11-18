import React from 'react';
import './Button.css';

const Button = ({ 
  children,
  variant = "primary", // primary, secondary, outline
  size = "medium", // small, medium, large
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
