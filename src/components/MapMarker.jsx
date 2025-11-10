import { useEffect, useRef } from 'react';

function MapMarker({ map, latitude, longitude, placeName, isMain = true }) {
  const markerRef = useRef(null);
  const markerElementRef = useRef(null);

  useEffect(() => {
    if (!map || !latitude || !longitude) return;

    // 마커 핀 엘리먼트 생성
    if (!markerElementRef.current) {
      const pinElement = document.createElement('div');
      pinElement.style.width = '30px';
      pinElement.style.height = '30px';
      pinElement.style.backgroundColor = isMain ? '#FF5252' : '#2196F3'; // 메인은 빨간색, 주변은 파란색
      pinElement.style.borderRadius = '50% 50% 50% 0';
      pinElement.style.transform = 'rotate(-45deg)';
      pinElement.style.border = '2px solid white';
      pinElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
      markerElementRef.current = pinElement;
    }

    // AdvancedMarkerElement 생성
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

    // cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [map, latitude, longitude, placeName, isMain]);

  return null;
}

export default MapMarker;
