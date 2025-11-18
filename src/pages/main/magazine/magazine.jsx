import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './magazine.css';
import { BackButton, PlaceList } from '../../../components/common';
import likeIcon from '../../../assets/tourspots_icon/관심.svg';
import likedIcon from '../../../assets/tourspots_icon/is_like.svg';
import shareIcon from '../../../assets/share.svg';
import nextIcon from '../../../assets/next.svg';
import backIcon from '../../../assets/back_icon.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Magazine = () => {
  const { magazineId } = useParams();
  const navigate = useNavigate();
  const [magazine, setMagazine] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [showShareSheet, setShowShareSheet] = useState(false);

  // 매거진 상세 정보 가져오기
  const fetchMagazineDetail = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/magazines/${magazineId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMagazine(data.data);
          setIsLiked(data.data.isLiked);
        }
      }
    } catch (error) {
      console.error('매거진 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (magazineId) {
      fetchMagazineDetail();
      fetchPlaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magazineId]);

  // 매거진 관련 관광지 가져오기
  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/magazines/${magazineId}/places?thumbnailOnly=false&count=3`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const formatted = data.data.map(p => ({
            id: p.placeId,
            image: p.officialPhotos?.[0]?.photoUrl || p.thumbnailUrl || 'https://placehold.co/400x300',
            name: p.name,
            address: p.address,
            tags: [p.groupName, p.categoryName].filter(Boolean),
            isLiked: p.isLiked || false
          }));
          setPlaces(formatted);
        }
      }
    } catch (error) {
      console.error('관광지 조회 실패:', error);
    }
  };

  // 좋아요 토글
  const toggleLike = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/MAGAZINE/${magazineId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ data: !isLiked })
      });

      if (response.ok) {
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  // 공유하기 (바텀시트 열기)
  const handleShare = () => {
    setShowShareSheet(true);
  };

  // 링크 복사
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
    setShowShareSheet(false);
  };

  // 관광지 좋아요
  const handlePlaceLike = async (placeId) => {
    try {
      await fetch(`${API_BASE_URL}/api/favorites/PLACE/${placeId}`, {
        method: 'POST',
        credentials: 'include'
      });
      setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, isLiked: !p.isLiked } : p));
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  // 이미지 슬라이드
  const handlePrevImage = () => {
    const total = (magazine?.cards || []).slice(1).length;
    if (total <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const total = (magazine?.cards || []).slice(1).length;
    if (total <= 1) return;
    setCurrentImageIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleSearchClick = () => {
    navigate('/spot/search');
  };

  const cards = (magazine?.cards || []).slice(1); // 첫 번째 이미지 제거

  if (loading) {
    return (
      <div className="magazine-container">
        <div className="magazine-loading">로딩 중...</div>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="magazine-container">
        <div className="magazine-error">매거진을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="magazine-container">
      {/* 헤더 */}
      <header className="magazine-header">
        <BackButton onClick={() => navigate(-1)} />
        <div className="magazine-title-center">여행 매거진</div>
        <div className="header-spacer" />
      </header>

      {/* 이미지 슬라이더 - 첫 번째 카드 제외 */}
      {cards.length > 0 && (
        <div className="magazine-slider">
          <div 
            className="magazine-slider-track"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {cards.map((card, index) => (
              <div key={card.order} className="magazine-slide">
                <img src={card.cardUrl} alt={`카드 ${index + 1}`} />
              </div>
            ))}
          </div>

          {/* 슬라이드 버튼 */}
          {cards.length > 1 && (
            <>
              <button className="slider-btn prev-btn" onClick={handlePrevImage}>
                <img src={backIcon} alt="이전" />
              </button>
              <button className="slider-btn next-btn" onClick={handleNextImage}>
                <img src={nextIcon} alt="다음" />
              </button>
            </>
          )}

          {/* 인디케이터 */}
          {cards.length > 1 && (
            <div className="slider-indicators">
              {cards.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 사진 아래 액션 (오른쪽 정렬) */}
      <div className="magazine-actions">
        <button className="action-btn" onClick={handleShare}>
          <img src={shareIcon} alt="공유" />
        </button>
        <button className="action-btn" onClick={toggleLike}>
          <img src={isLiked ? likedIcon : likeIcon} alt="좋아요" />
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="magazine-content">
        {magazine.content && (
          <p className="magazine-text">{magazine.content}</p>
        )}
      </div>

      {/* 관광지 보러가기 */}
      {places.length > 0 && (
        <div className="magazine-places">
          <div className="places-header">
            <h2>관광지 보러가기</h2>
            <button className="places-more">
              <img src={nextIcon} alt="더보기" />
            </button>
          </div>
          <PlaceList places={places} onLike={handlePlaceLike} />
        </div>
      )}

      {/* 바텀 시트 */}
      {showShareSheet && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setShowShareSheet(false)} />
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>공유하기</h3>
              <button onClick={() => setShowShareSheet(false)}>✕</button>
            </div>
            <button className="bottom-sheet-item" onClick={copyLink}>
              링크 복사
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Magazine;
