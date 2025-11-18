import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';
import backIcon from '../../../assets/back_icon.svg';

const BackButton = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      className={`back-button ${className}`}
      onClick={handleClick}
      aria-label="뒤로가기"
    >
      <img src={backIcon} alt="뒤로가기" />
    </button>
  );
};

export default BackButton;
