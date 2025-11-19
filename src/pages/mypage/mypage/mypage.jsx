import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './mypage.css';

import defaultProfile from '../../../assets/default_profile.png';
import testImg from '../../../assets/test.svg';
import settingIcon from '../../../assets/setting.svg';
import headsetIcon from '../../../assets/headset.svg';
import noiceIcon from '../../../assets/notice.svg';
import logo from '../../../assets/sandri_logo.svg';
import nextIcon from '../../../assets/next.svg';

// 여행 스타일 이미지 import
import adventureImg from '../../../assets/test_result_img/adventure.png';
import fairyImg from '../../../assets/test_result_img/fairy.png';
import hotplaceImg from '../../../assets/test_result_img/hotplace.png';
import planImg from '../../../assets/test_result_img/plan.png';
import localImg from '../../../assets/test_result_img/native.png';
import turtleImg from '../../../assets/test_result_img/turtle.png';
import galleryImg from '../../../assets/test_result_img/gallery.png';
import walkImg from '../../../assets/test_result_img/walk.png';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 여행 스타일 매핑
const travelStyleMap = {
  'ADVENTURER': adventureImg,
  'SENSITIVE_FAIRY': fairyImg,
  'THOROUGH_PLANNER': planImg,
  'LOCAL': localImg,
  'HOTSPOT_HUNTER': hotplaceImg,
  'HEALING_TURTLE': turtleImg,
  'GALLERY_PEOPLE': galleryImg,
  'WALKER': walkImg
};

function MyPage() {
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState({
    username: '',
    nickname: '',
    name: '',
    profileImage: null,
    travelStyle: null
  });
  const [reviewCount, setReviewCount] = useState(0);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  // const [points, setPoints] = useState(0);

  // 사용자 프로필 조회
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setUserProfile({
            username: result.data.username || '',
            nickname: result.data.nickname || '',
            name: result.data.name || '',
            profileImage: result.data.profileImage || null,
            travelStyle: result.data.travelStyle || null
          });
        }
      } else {
        console.error('프로필 조회 실패');
      }
    } catch (error) {
      console.error('프로필 조회 에러:', error);
    }
  };

  // 리뷰 목록 조회
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/me/reviews`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setReviewCount(data.length || 0);
      }
    } catch (error) {
      console.error('리뷰 조회 에러:', error);
    }
  };

  // 방문한 여행지 조회 (최근 2개)
  const fetchVisitedPlaces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/visited-places`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // 최근 2개만 가져오기
        setVisitedPlaces(data.slice(0, 2));
      }
    } catch (error) {
      console.error('방문한 여행지 조회 에러:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchReviews();
    fetchVisitedPlaces();
  }, []);

  const handleProfileEdit = () => {
    navigate('/mypage/modify');
  };

  const handleTestClick = () => {
    navigate('/test');
  };

  const handleReviewClick = () => {
    navigate('/mypage/reviews');
  };

  const handlePointStoreClick = () => {
    navigate('/mypage/point-shop');
  };

  const handleTravelListClick = () => {
    navigate('/mypage/travel-list');
  };

  const handleSettingClick = () => {
    console.log('설정 페이지로 이동');
  };

  const handleNoticeClick = () => {
    console.log('공지사항 페이지로 이동');
  };

  const handleCustomerServiceClick = () => {
    console.log('고객센터 페이지로 이동');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      navigate('/users/login');
    }
  };

  return (
    <div className="mypage-container">
      <div className="mypage-content">
        
        {/* 로고 헤더 */}
        <div className="mypage-header">
          <img src={logo} alt="Sandri" className="mypage-logo" />
        </div>

        {/* 프로필 섹션 */}
        <section className="profile-section">
          <div className="profile-left">
            <div className="profile-image-container">
              <img 
                src={
                  userProfile.travelStyle && travelStyleMap[userProfile.travelStyle]
                    ? travelStyleMap[userProfile.travelStyle]
                    : userProfile.profileImage || defaultProfile
                } 
                alt="프로필" 
                className="profile-image" 
              />
            </div>
            <div className="profile-info">
              <h2 className="user-name">{userProfile.nickname || '???'}님</h2>
              <button className="profile-edit-btn" onClick={handleProfileEdit}>
                프로필 수정
              </button>
            </div>
          </div>
        </section>

        {/* 내 여행 섹션 */}
        <section className="my-travel-section">
          <div className="travel-header">
            <h3 className="travel-title">내 여행</h3>
            <img 
              src={nextIcon} 
              alt="더보기" 
              className="travel-arrow-icon" 
              onClick={handleTravelListClick}
            />
          </div>
          <div className="travel-cards">
            {visitedPlaces.length > 0 ? (
              visitedPlaces.map((place) => (
                <div 
                  key={place.id} 
                  className="travel-card" 
                  onClick={() => navigate(`/places/${place.id}/reviews`)}
                >
                  <img 
                    src={place.image || 'https://via.placeholder.com/150x100'} 
                    alt={place.name} 
                    className="travel-image" 
                  />
                  <div className="travel-info">
                    <h4 className="travel-name">{place.name}</h4>
                    <p className="travel-review">리뷰쓰기</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-travel-message">아직 방문한 여행지가 없습니다.</p>
            )}
          </div>
        </section>

        {/* 내 포인트 섹션 */}
        <section className="points-section">
          <div className="points-header" onClick={() => console.log('포인트 상세')}>
            <h3 className="points-title">내 포인트</h3>
            <div className="points-right">
              <span className="points-value">{/* points.toLocaleString() */}0 P</span>
            </div>
          </div>
          <div className="points-store" onClick={handlePointStoreClick}>
            <button className="points-store-text">포인트 스토어 가기</button>
          </div>
        </section>

        {/* 내 리뷰 섹션 */}
        <section className="review-section">
          <div className="review-card" onClick={handleReviewClick}>
            <h3 className="review-title">내 리뷰</h3>
            <div className="review-right">
              <span className="review-count">{reviewCount}</span>
              <img src={nextIcon} alt="더보기" className="review-arrow-icon" />
            </div>
          </div>
        </section>

        {/* 취향 테스트 섹션 */}
        <section className="test-section">
          <img 
            src={testImg}
            alt="취향 테스트" 
            className="test-image" 
            onClick={handleTestClick} 
          />
        </section>

        {/* 하단 메뉴 섹션 */}
        <section className="menu-section">
          <div className="menu-item" onClick={handleSettingClick}>
            <img src={settingIcon} alt="앱 설정" className="menu-icon" />
            <span className="menu-text">앱 설정</span>
          </div>
          
          <div className="menu-item" onClick={handleNoticeClick}>
            <img src={noiceIcon} alt="공지사항" className="menu-icon" />
            <span className="menu-text">공지사항</span>
          </div>

          <div className="menu-item" onClick={handleCustomerServiceClick}>
            <img src={headsetIcon} alt="고객센터" className="menu-icon" />
            <span className="menu-text">고객센터</span>
          </div>

          <div className="menu-item logout-item" onClick={handleLogout}>
            <span className="menu-text logout-text">로그아웃</span>
          </div>
        </section>

      </div>
    </div>
  );
}

export default MyPage;
