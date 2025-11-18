import { useEffect, useRef, useState } from 'react';
import MapMarker from './MapMarker';
import './GoogleMap.css';

function GoogleMap({ 
  latitude, 
  longitude, 
  placeName, 
  nearbyPlaces = [],
  center,
  routeLocations = []
}) {
  const ref = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);

  useEffect(() => {
    const mapCenter = center || (latitude && longitude ? { lat: latitude, lng: longitude } : null);
    
    if (ref.current && mapCenter) {
      const initialMap = new window.google.maps.Map(ref.current, {
        center: mapCenter,
        zoom: routeLocations.length > 0 ? 13 : 14,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID || 'DEMO_MAP_ID',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
      });

      setGoogleMap(initialMap);
    }
  }, [latitude, longitude, center, routeLocations.length]);

  // 루트 라인 그리기
  useEffect(() => {
    if (googleMap && routeLocations.length > 1) {
      const path = routeLocations.map(loc => ({ lat: loc.lat, lng: loc.lng }));
      
      new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#4CAF50',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: googleMap,
      });

      // 모든 마커가 보이도록 bounds 조정
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      googleMap.fitBounds(bounds);
    }
  }, [googleMap, routeLocations]);

  return (
    <div ref={ref} id="map" className="google-map">
      {googleMap && (
        <>
          {/* 루트 모드 */}
          {routeLocations.length > 0 && routeLocations.map((location, index) => (
            <MapMarker
              key={index}
              map={googleMap}
              latitude={location.lat}
              longitude={location.lng}
              placeName={location.name}
              isMain={false}
              order={location.order || index + 1}
            />
          ))}
          
          {/* 관광지 상세 모드 */}
          {!routeLocations.length && latitude && longitude && (
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
          )}
        </>
      )}
    </div>
  );
}

export default GoogleMap;
