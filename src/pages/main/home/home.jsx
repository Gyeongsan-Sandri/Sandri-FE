import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import sandriLogo from '../../../assets/sandri_logo.svg';
import searchIcon from '../../../assets/search.svg';
import nextIcon from '../../../assets/next.svg';
import LikeHeart from '../../../components/LikeHeart/LikeHeart.jsx';
import official1 from '../../../assets/official/공식광고1.svg';
import official2 from '../../../assets/official/공식광고2.svg';
import official3 from '../../../assets/official/공식광고3.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const navigate = useNavigate();
  // 메인 공식 광고는 로컬 이미지를 사용
  const [magazines, setMagazines] = useState([]);
  const [todayRoutes, setTodayRoutes] = useState([]);
  const [hotPlaces, setHotPlaces] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [officialIndex, setOfficialIndex] = useState(0);
  const officialAds = [official1, official2, official3];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 사용자 정보 가져오기
      const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserInfo(userData.data);
      }

      // (사용 안 함) 서버 광고 배너는 로컬 캐러셀로 대체

      // 매거진 가져오기
      const magazineResponse = await fetch(`${API_BASE_URL}/api/magazines?size=9`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (magazineResponse.ok) {
        const magazineData = await magazineResponse.json();
        setMagazines(magazineData.data?.magazines || []);
      }

      // HOT 관광지 가져오기 
      const hotPlacesResponse = await fetch(`${API_BASE_URL}/api/places/hot`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (hotPlacesResponse.ok) {
        const hotPlacesData = await hotPlacesResponse.json();
        if (hotPlacesData.success && hotPlacesData.data) {
          setHotPlaces(hotPlacesData.data);
        }
      }

      // 오늘 방문 예정인 장소 가져오기
      const visitResponse = await fetch(`${API_BASE_URL}/api/me/visits/places`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (visitResponse.ok) {
        const visitData = await visitResponse.json();
        if (visitData.success && visitData.data) {
          setTodayRoutes(visitData.data);
        }
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 공식 광고 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setOfficialIndex((prev) => (prev + 1) % officialAds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [officialAds.length]);

  const handleSearchClick = () => {
    navigate('/spot/search');
  };

  const handleMagazineClick = (magazine) => {
    navigate(`/magazine/${magazine.magazineId}`);
  };

  // 매거진 좋아요 토글
  const toggleMagazineLike = async (e, magazineId, isLiked) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_BASE_URL}/api/magazines/${magazineId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ data: !isLiked })
      });

      if (response.ok) {
        // 매거진 목록 업데이트
        setMagazines(prevMagazines =>
          prevMagazines.map(mag =>
            mag.magazineId === magazineId
              ? { ...mag, isLiked: !isLiked }
              : mag
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // 카테고리 버튼 클릭
  const handleCategoryClick = (categoryName) => {
    navigate('/spot/categories', { state: { category: categoryName } });
  };

  // 현재 위치와 장소 위치 비교 (GPS 오차 고려: 100m 이내)
  const isWithinRange = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // 지구 반지름 (m)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c; // 미터 단위
    return distance <= 100; // 100m 이내면 true
  };

  // 방문 확정하기
  const handleConfirmVisit = async (place) => {
    try {
      // 1. 현재 위치 가져오기
      if (!navigator.geolocation) {
        alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLat = position.coords.latitude;
          const currentLon = position.coords.longitude;

          // 2. 사용자 위치 업데이트
          try {
            await fetch(`${API_BASE_URL}/api/user/location`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                latitude: currentLat,
                longitude: currentLon
              })
            });
          } catch (err) {
            console.error('위치 업데이트 실패:', err);
          }

          // 3. 장소와의 거리 확인
          if (!isWithinRange(currentLat, currentLon, place.latitude, place.longitude)) {
            alert(`장소로부터 너무 멀리 떨어져 있습니다.\n${place.name} 근처에서 다시 시도해주세요.`);
            return;
          }

          // 4. 방문 장소 저장
          const visitResponse = await fetch(`${API_BASE_URL}/api/user/visited-places`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              placeId: place.placeId,
              visitedAt: new Date().toISOString()
            })
          });

          if (visitResponse.ok) {
            alert(`${place.name} 방문이 확정되었습니다!`);
            // 루트 목록 새로고침
            fetchData();
          } else {
            const errorData = await visitResponse.json();
            alert(errorData.message || '방문 확정에 실패했습니다.');
          }
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          alert('위치 정보를 가져올 수 없습니다. 위치 서비스를 활성화해주세요.');
        },
        {
          enableHighAccuracy: true, // 고정확도 모드
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (error) {
      console.error('방문 확정 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-wrapper">
        {/* 상단 헤더 */}
        <header className="home-header">
          <img src={sandriLogo} alt="Sandri Logo" className="home-logo" />
          <button className="home-search-btn" onClick={handleSearchClick}>
            <img src={searchIcon} alt="검색" />
          </button>
        </header>

      {/* 1. 공식 광고 */}
      <section className="home-section official-ad-section">
        <div className="official-ad-carousel">
          <div
            className="official-ad-track"
            style={{ transform: `translateX(-${officialIndex * 304}px)` }}
          >
            {officialAds.map((src, idx) => (
              <div key={idx} className="official-ad-slide">
                <img src={src} alt={`공식 광고 ${idx + 1}`} />
              </div>
            ))}
          </div>
          <div className="official-ad-indicator">{officialIndex + 1} / {officialAds.length}</div>
        </div>
      </section>

      {/* 2. 매거진 추천 섹션 */}
      <section className="home-section magazine-section">
        <div className="section-header">
          <h2>{userInfo?.nickname || '사용자'}님, 이런 곳은 어떠세요?</h2>
          <button className="section-more" onClick={() => navigate('/magazine')}>
            <img src={nextIcon} alt="더보기" />
          </button>
        </div>
        
        {/* 매거진 목록 */}
        {magazines.length > 0 ? (
          <div className="magazine-grid">
            {magazines.map((magazine) => (
              <div 
                key={magazine.magazineId} 
                className="magazine-card"
                onClick={() => handleMagazineClick(magazine)}
              >
                <div className="magazine-image">
                  <img src={magazine.thumbnail} alt={magazine.title} />
                  <LikeHeart
                    isLiked={magazine.isLiked}
                    onToggle={(e) => toggleMagazineLike(e, magazine.magazineId, magazine.isLiked)}
                    className="magazine-heart-btn overlay"
                    size={22}
                    containerSize={36}
                  />
                  <div className="magazine-text-overlay">
                    <p className="magazine-summary">{magazine.summary}</p>
                    <h3 className="magazine-overlay-title">{magazine.title}</h3>
                  </div>
                  {magazine.tags && magazine.tags.length > 0 && (
                    <div className="magazine-tags">
                      {magazine.tags.map((tag) => (
                        <span key={tag.tagId} className="magazine-tag">#{tag.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-message">아직 등록된 매거진이 없습니다.</div>
        )}
      </section>

      {/* 3. 오늘의 일정 */}
      {todayRoutes.length > 0 && (
        <section className="home-section today-schedule-section">
          <div className="section-header">
            <h2>오늘의 일정</h2>
          </div>
          <div className="today-schedule-slider">
            {todayRoutes.map((visit, index) => (
              <div key={index} className="today-schedule-card">
                <div className="today-schedule-image">
                  <img 
                    src={visit.placeInfo.thumbnail || 'https://placehold.co/300x200'} 
                    alt={visit.placeInfo.placeName} 
                  />
                </div>
                <div className="today-schedule-info">
                  <div className="visit-order-badge">{visit.visitOrder}/{visit.totalPlaceCount}</div>
                  <h3>{visit.placeInfo.placeName}</h3>
                  <p className="today-schedule-address">{visit.placeInfo.address}</p>
                  <button 
                    className="visit-confirm-btn"
                    onClick={() => handleConfirmVisit(visit.placeInfo)}
                  >
                    방문 확정하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 카테고리 선택 */}
      <section className="home-section category-section">
        <div className="category-grid">
          <button className="category-btn" onClick={() => handleCategoryClick('자연/힐링')}>
            자연/힐링
          </button>
          <button className="category-btn" onClick={() => handleCategoryClick('역사/전통')}>
            역사/전통
          </button>
          <button className="category-btn" onClick={() => handleCategoryClick('문화/체험')}>
            문화/체험
          </button>
          <button className="category-btn" onClick={() => handleCategoryClick('식도락')}>
            식도락
          </button>
        </div>
      </section>

      {/* 5. HOT 관광지 */}
      {hotPlaces.length > 0 && (
        <section className="home-section hot-places-section">
          <div className="section-header">
            <h2>HOT 관광지</h2>
          </div>
          
          {/* 1등 - 큰 카드 */}
          {hotPlaces[0] && (
            <div 
              className="hot-place-main"
              onClick={() => navigate(`/places/${hotPlaces[0].placeId}`)}
            >
              <div className="hot-place-number">{hotPlaces[0].rank}</div>
              <img 
                src={hotPlaces[0].thumbnailUrl || 'https://placehold.co/400x300'} 
                alt={hotPlaces[0].name} 
              />
              <div className="hot-place-info">
                <h3>{hotPlaces[0].name}</h3>
                <div className="hot-place-tags">
                  {hotPlaces[0].categoryName && <span>#{hotPlaces[0].categoryName}</span>}
                </div>
              </div>
            </div>
          )}

          { /* 리스트 형식 */}
          <div className="hot-places-list">
            {hotPlaces.slice(1, 5).map((place) => (
              <div 
                key={place.placeId}
                className="hot-place-item"
                onClick={() => navigate(`/places/${place.placeId}`)}
              >
                <div className="hot-place-number">{place.rank}</div>
                <img 
                  src={place.thumbnailUrl || 'https://placehold.co/100x100'} 
                  alt={place.name} 
                />
                <div className="hot-place-item-info">
                  <h4>{place.name}</h4>
                  <div className="hot-place-tags">
                    {place.categoryName && <span>#{place.categoryName}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
};

export default Home;
