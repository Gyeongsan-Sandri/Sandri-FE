import React from 'react';
import './PlaceCard.css';

const PlaceCard = ({ 
  place,
  onLike,
  onCardClick
}) => {
  const {
    id,
    image,
    name,
    address,
    tags = [],
    isLiked = false
  } = place;

  const handleLikeClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    if (onLike) {
      onLike(id);
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(place);
    }
  };

  return (
    <div className="place-card" onClick={handleCardClick}>
      <div className="place-card-image">
        <img src={image} alt={name} />
        <button 
          className={`place-card-like ${isLiked ? 'liked' : ''}`}
          onClick={handleLikeClick}
          aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill={isLiked ? '#FF6B6B' : 'none'} 
            stroke={isLiked ? '#FF6B6B' : 'white'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      
      <div className="place-card-content">
        <h3 className="place-card-name">{name}</h3>
        <p className="place-card-address">{address}</p>
        
        {tags.length > 0 && (
          <div className="place-card-tags">
            {tags.map((tag, index) => (
              <span key={index} className="place-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
