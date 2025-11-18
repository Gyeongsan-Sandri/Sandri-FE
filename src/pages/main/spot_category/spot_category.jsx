import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlaceList, BackButton } from '../../../components/common';
import './spot_category.css';
import official1 from '../../../assets/official/공식광고1.svg';
import official2 from '../../../assets/official/공식광고2.svg';
import official3 from '../../../assets/official/공식광고3.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CATEGORIES = [
  { id: 'nature', name: '자연/힐링', value: '자연/힐링' },
  { id: 'history', name: '역사/전통', value: '역사/전통' },
  { id: 'culture', name: '문화/체험', value: '문화/체험' },
  { id: 'food', name: '식도락', value: '식도락' }
];

const SpotCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('nature');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const [officialIndex, setOfficialIndex] = useState(0);
  const officialAds = [official1, official2, official3];

  useEffect(() => {
    if (location.state?.category) {
      const matchedCategory = CATEGORIES.find(cat => cat.value === location.state.category);
      if (matchedCategory) {
        setActiveCategory(matchedCategory.id);
        fetchPlacesByCategory(matchedCategory.value, 1, true);
        return;
      }
    }
    fetchPlacesByCategory(CATEGORIES[0].value, 1, true);
  }, [location.state]);

  // 공식 광고 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setOfficialIndex((prev) => (prev + 1) % officialAds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [officialAds.length]);

  const fetchPlacesByCategory = async (categoryValue, pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const encodedCategory = encodeURIComponent(categoryValue);
      const response = await fetch(
        `${API_BASE_URL}/api/places?category=${encodedCategory}&page=${pageNum}&size=${pageSize}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // API 응답 데이터를 PlaceCard 형식에 맞게 변환
          const formattedPlaces = data.data.map(place => ({
            id: place.placeId,
            image: place.officialPhotos?.[0]?.photoUrl || place.thumbnailUrl || 'https://placehold.co/400x300',
            name: place.name,
            address: place.address,
            tags: [
              place.groupName && place.groupName,
              place.categoryName && place.categoryName
            ].filter(Boolean),
            isLiked: place.isLiked || false
          }));
          
          if (reset) {
            setPlaces(formattedPlaces);
          } else {
            setPlaces(prev => [...prev, ...formattedPlaces]);
          }
          
          setHasMore(formattedPlaces.length === pageSize);
          setPage(pageNum);
        }
      }
    } catch (error) {
      console.error('장소 목록 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category.id);
    setPage(1);
    setHasMore(true);
    fetchPlacesByCategory(category.value, 1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const currentCategory = CATEGORIES.find(cat => cat.id === activeCategory);
      fetchPlacesByCategory(currentCategory.value, page + 1, false);
    }
  };

  const handleLike = async (placeId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/favorites/PLACE/${placeId}`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      if (response.ok) {
        // 로컬 상태 업데이트
        setPlaces(prev => prev.map(place =>
          place.id === placeId
            ? { ...place, isLiked: !place.isLiked }
            : place
        ));
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleCardClick = (place) => {
    navigate(`/places/${place.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="spot-category-container">
      {/* 헤더 */}
      <header className="spot-category-header">
        <BackButton onClick={handleBack} />
        <h1>{CATEGORIES.find(cat => cat.id === activeCategory)?.name || '자연/힐링'}</h1>
      </header>

      {/* 카테고리 탭 */}
      <div className="category-tabs">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 공식 광고 캐러셀 */}
      <section className="spot-official-ad">
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

      {/* 장소 목록 */}
      <div className="spot-content">
        {loading && page === 1 ? (
          <div className="loading-message">로딩 중...</div>
        ) : (
          <>
            <PlaceList
              places={places}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
              onLike={handleLike}
              onCardClick={handleCardClick}
            />
            
            {/* 더보기 버튼 */}
            {hasMore && places.length > 0 && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn" 
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? '로딩 중...' : '더보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SpotCategory;
