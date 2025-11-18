import { useEffect, useRef } from 'react';

function MapMarker({ map, latitude, longitude, placeName, isMain = true, order = null }) {
  const markerRef = useRef(null);
  const markerElementRef = useRef(null);

  useEffect(() => {
    if (!map || !latitude || !longitude) return;

    if (!markerElementRef.current) {
      const pinElement = document.createElement('div');
      
      if (order !== null) {
        pinElement.style.width = '32px';
        pinElement.style.height = '32px';
        pinElement.style.backgroundColor = '#4CAF50';
        pinElement.style.borderRadius = '50%';
        pinElement.style.border = '3px solid white';
        pinElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        pinElement.style.display = 'flex';
        pinElement.style.alignItems = 'center';
        pinElement.style.justifyContent = 'center';
        pinElement.style.color = 'white';
        pinElement.style.fontWeight = 'bold';
        pinElement.style.fontSize = '14px';
        pinElement.textContent = order.toString();
      } else {
        pinElement.style.width = '30px';
        pinElement.style.height = '30px';
        pinElement.style.backgroundColor = isMain ? '#FF5252' : '#2196F3';
        pinElement.style.borderRadius = '50% 50% 50% 0';
        pinElement.style.transform = 'rotate(-45deg)';
        pinElement.style.border = '2px solid white';
        pinElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
      }
      
      markerElementRef.current = pinElement;
    }

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: {
        lat: latitude,
        lng: longitude,
      },
      map,
      title: placeName || '관광지',
      content: markerElementRef.current,
    });

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [map, latitude, longitude, placeName, isMain, order]);

  return null;
}

export default MapMarker;
