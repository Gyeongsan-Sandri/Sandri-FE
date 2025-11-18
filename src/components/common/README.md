# 공통 컴포넌트 사용 가이드

프로젝트 전체에서 재사용 가능한 공통 UI 컴포넌트입니다.

## 📁 컴포넌트 목록

### Input, PasswordInput, Button, Select

폼 관련 기본 컴포넌트들 - 회원가입, 로그인 등에서 사용

### PlaceCard

장소 정보를 표시하는 카드 컴포넌트

```jsx
import { PlaceCard } from "../../components/common";

const place = {
  id: 1,
  image: "/images/place.jpg",
  name: "까사디플리아",
  address: "경북 경산시 남산면 박리길 246",
  tags: ["지역/캠핑", "저수지"],
  isLiked: true,
};

<PlaceCard place={place} onLike={handleLike} onCardClick={handleCardClick} />;
```

### PlaceList

장소 카드 목록을 그리드로 표시

```jsx
import { PlaceList } from '../../components/common';

// 3열 레이아웃 (기본값)
<PlaceList
  places={places}
  onLike={handleLike}
  onCardClick={handleCardClick}
/>

// 커스텀 레이아웃
<PlaceList
  places={places}
  columns={{ mobile: 1, tablet: 2, desktop: 4 }}
  onLike={handleLike}
  onCardClick={handleCardClick}
/>
```

## 🔧 유틸리티 함수

`src/utils/placeUtils.js`에서 장소 관련 함수 제공:

```jsx
import {
  fetchPlaces,
  searchPlaces,
  togglePlaceLike,
} from "../utils/placeUtils";

// 장소 목록 가져오기
const places = await fetchPlaces();

// 장소 검색
const results = await searchPlaces("경산");

// 좋아요 토글
await togglePlaceLike(placeId);
```

## 📝 완전한 사용 예시

검색 페이지나 매거진에서 사용할 수 있는 완전한 예시는 `src/pages/examples/PlaceListExample.jsx`를 참고하세요.

```jsx
import { PlaceList } from "../../components/common";
import { fetchPlaces, togglePlaceLike } from "../../utils/placeUtils";

function SearchPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    const data = await fetchPlaces();
    setPlaces(data);
  };

  const handleLike = async (placeId) => {
    await togglePlaceLike(placeId);
    // 로컬 상태 업데이트
    setPlaces((prev) =>
      prev.map((place) =>
        place.id === placeId ? { ...place, isLiked: !place.isLiked } : place
      )
    );
  };

  const handleCardClick = (place) => {
    navigate(`/tourspots/${place.id}`);
  };

  return (
    <PlaceList
      places={places}
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      onLike={handleLike}
      onCardClick={handleCardClick}
    />
  );
}
```

## 💡 장점

✅ **재사용성**: 검색, 매거진, 홈 등 어디서든 동일하게 사용  
✅ **반응형**: 모바일/태블릿/데스크톱에 맞춰 자동 조정  
✅ **커스터마이징**: 컬럼 수를 자유롭게 설정 가능  
✅ **유지보수**: 한 곳만 수정하면 모든 곳에 적용
