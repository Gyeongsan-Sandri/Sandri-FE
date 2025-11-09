import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './mypage_travel_list.css';

import backIcon from '../../../assets/back_icon.svg';
import reviewPencilIcon from '../../../assets/review.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MyPageTravelList() {
  const navigate = useNavigate();
  const [visitedPlaces, setVisitedPlaces] = useState([]);

  // 방문한 모든 여행지 조회
  const fetchAllVisitedPlaces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/visited-places`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setVisitedPlaces(result.data);
        }
      } else {
        console.error('방문한 여행지 조회 실패');
      }
    } catch (error) {
      console.error('방문한 여행지 조회 에러:', error);
    }
  };

  useEffect(() => {
    fetchAllVisitedPlaces();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReviewWrite = (placeId) => {
    navigate(`/places/${placeId}/reviews`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  return (
    <div className="travel-list-page">
      <div className="travel-list-wrapper">
        
        {/* 헤더 */}
        <header className="travel-list-header">
          <button className="back-btn" onClick={handleBack}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
          <h1 className="travel-list-title">내 여행</h1>
          <div className="header-spacer"></div>
        </header>

        {/* 방문한 기록 섹션 */}
        <section className="visited-section">
          <h2 className="section-title">방문한 기록</h2>
          
          {visitedPlaces.length > 0 ? (
            <div className="visited-list">
              {visitedPlaces.map((place) => (
                <div key={place.userVisitedPlaceId} className="visited-item">
                  <div className="visit-date">
                    {formatDate(place.visitDate)} {getDayOfWeek(place.visitDate)}
                  </div>
                  <h3 className="place-name">{place.placeName}</h3>
                  
                  <div className="place-card">
                    <img 
                      src={place.placeThumbnailUrl || 'https://via.placeholder.com/240x160'} 
                      alt={place.placeName}
                      className="place-image"
                    />
                    
                    {!place.hasReview && (
                      <button 
                        className="review-write-btn"
                        onClick={() => handleReviewWrite(place.placeId)}
                      >
                        <span className="review-icon">
                          <img src={reviewPencilIcon} alt="리뷰쓰기" />
                        </span>
                        리뷰쓰기
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-visits-message">
              <p>아직 방문한 여행지가 없습니다.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default MyPageTravelList;
