import { useEffect, useRef, useState } from 'react';
import MapMarker from './MapMarker';
import './GoogleMap.css';

function GoogleMap({ latitude, longitude, placeName, nearbyPlaces = [] }) {
  const ref = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);

  useEffect(() => {
    if (ref.current && latitude && longitude) {
      const initialMap = new window.google.maps.Map(ref.current, {
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom: 14,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID || 'DEMO_MAP_ID', // Map ID 필요
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
      });

      setGoogleMap(initialMap);
    }
  }, [latitude, longitude]);

  return (
    <div ref={ref} id="map" className="google-map">
      {googleMap && latitude && longitude ? (
        <>
          {/* 메인 관광지 마커 (빨간색) */}
          <MapMarker 
            map={googleMap} 
            latitude={latitude} 
            longitude={longitude} 
            placeName={placeName}
            isMain={true}
          />
          {/* 주변 관광지 마커들 (파란색) */}
          {nearbyPlaces.map((place) => (
            <MapMarker
              key={place.placeId}
              map={googleMap}
              latitude={place.latitude}
              longitude={place.longitude}
              placeName={place.name}
              isMain={false}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}

export default GoogleMap;
