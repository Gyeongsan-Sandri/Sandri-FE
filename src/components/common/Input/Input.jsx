import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  required, 
  type = "text", 
  name,
  placeholder, 
  value, 
  onChange, 
  error,
  success,
  showButton,
  buttonText = "확인",
  onButtonClick,
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div className={showButton ? "input-with-button" : ""}>
        <input
          type={type}
          name={name}
          className={`input-field ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {showButton && (
          <button 
            type="button"
            className={`check-btn ${value ? 'active' : ''}`}
            onClick={onButtonClick}
            disabled={!value}
          >
            {buttonText}
          </button>
        )}
      </div>
      {error && <p className="validation-message error">*{error}</p>}
      {success && <p className="validation-message success">{success}</p>}
    </div>
  );
};

export default Input;
