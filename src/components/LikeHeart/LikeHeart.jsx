import React from 'react';
import './LikeHeart.css';


const LikeHeart = ({
  isLiked = false,
  onToggle,
  size = 24,
  containerSize,
  className = '',
  stopPropagation = true,
  ariaLabel = '관심 토글'
}) => {
  const handleClick = (e) => {
    if (stopPropagation) e.stopPropagation();
    if (onToggle) onToggle(e, !isLiked);
  };

  return (
    <button
      type="button"
      className={`heart-btn ${className}`.trim()}
      aria-pressed={isLiked}
      aria-label={ariaLabel}
      onClick={handleClick}
      style={{
        padding: 0,
        ...(containerSize ? { width: containerSize, height: containerSize, borderRadius: '50%' } : {})
      }}
    >
      <svg
        className="heart-icon"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={isLiked ? '#FF6B6B' : 'none'}
        stroke={isLiked ? '#FF6B6B' : 'white'}
        strokeWidth="2"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default LikeHeart;
