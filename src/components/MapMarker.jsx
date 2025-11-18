import { useEffect, useRef } from 'react';

function MapMarker({ map, latitude, longitude, placeName, isMain = true, order = null, variant = 'default', active = false, onClick = null }) {
  const markerRef = useRef(null);
  const markerElementRef = useRef(null);

  useEffect(() => {
    if (!map || !latitude || !longitude) return;

    if (!markerElementRef.current) {
      const pinElement = document.createElement('div');
      
      if (variant === 'route') {
        // Route pins: blue by default, red when active
        pinElement.style.width = '30px';
        pinElement.style.height = '30px';
        pinElement.style.backgroundColor = active ? '#EF4444' : '#3B82F6';
        pinElement.style.borderRadius = '50% 50% 50% 0';
        pinElement.style.transform = 'rotate(-45deg)';
        pinElement.style.border = '2px solid white';
        pinElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
      } else if (order !== null) {
        // Numbered circle marker
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
        // Default pin
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

    // Update color on active change for route variant
    if (markerElementRef.current && variant === 'route') {
      markerElementRef.current.style.backgroundColor = active ? '#EF4444' : '#3B82F6';
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

    if (onClick) {
      // AdvancedMarkerElement click event
      markerRef.current.addListener('gmp-click', onClick);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [map, latitude, longitude, placeName, isMain, order, variant, active, onClick]);

  return null;
}

export default MapMarker;
