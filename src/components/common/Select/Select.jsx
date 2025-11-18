import React from 'react';
import './Select.css';

const Select = ({ 
  label, 
  required, 
  name,
  value, 
  onChange, 
  options = [],
  placeholder = "선택해주세요",
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <div className="select-group">
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <select
        name={name}
        className={`select-field ${className}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
