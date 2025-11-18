import React, { useState } from 'react';
import './PasswordInput.css';
import eyeOpen from '../../../assets/eye.svg';
import eyeOff from '../../../assets/eye-off.svg';

const PasswordInput = ({ 
  label, 
  required, 
  name,
  placeholder, 
  value, 
  onChange, 
  error,
  disabled = false,
  className = "",
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-input-group">
      {label && (
        <label className="password-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          className={`password-field ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          <img
            src={showPassword ? eyeOpen : eyeOff}
            alt="toggle password visibility"
            className="eye-icon"
            draggable={false}
          />
        </button>
      </div>
      {error && <p className="validation-message error">*{error}</p>}
    </div>
  );
};

export default PasswordInput;
