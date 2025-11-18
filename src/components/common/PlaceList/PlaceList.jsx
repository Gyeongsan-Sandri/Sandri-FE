import React from 'react';
import PlaceCard from '../PlaceCard/PlaceCard';
import './PlaceList.css';

const PlaceList = ({ 
  places = [],
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  onLike,
  onCardClick,
  className = ""
}) => {
  if (!places || places.length === 0) {
    return (
      <div className="place-list-empty">
        <p>등록된 장소가 없습니다.</p>
      </div>
    );
  }

  return (
    <div 
      className={`place-list ${className}`}
      style={{
        '--columns-mobile': columns.mobile,
        '--columns-tablet': columns.tablet,
        '--columns-desktop': columns.desktop
      }}
    >
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          onLike={onLike}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default PlaceList;
