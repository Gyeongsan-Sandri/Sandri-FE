import { Status, Wrapper } from '@googlemaps/react-wrapper';
import GoogleMap from './GoogleMap';

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div>로딩중...</div>;
    case Status.FAILURE:
      return <div>지도를 불러올 수 없습니다.</div>;
    case Status.SUCCESS:
      return <GoogleMap />;
    default:
      return <div>에러 발생</div>;
  }
};

function GoogleMapContainer({ 
  latitude, 
  longitude, 
  placeName, 
  nearbyPlaces = [],
  center,
  routeLocations = [] 
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>Google Maps API Key가 설정되지 않았습니다.</div>;
  }

  return (
    <Wrapper
      apiKey={apiKey}
      render={render}
      libraries={['marker']}
    >
      <GoogleMap 
        latitude={latitude} 
        longitude={longitude} 
        placeName={placeName}
        nearbyPlaces={nearbyPlaces}
        center={center}
        routeLocations={routeLocations}
      />
    </Wrapper>
  );
}

export default GoogleMapContainer;
