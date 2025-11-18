import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './route.css';
import backIcon from '../../../assets/back_icon.svg';
import shareIcon from '../../../assets/myroute_icon/공유.svg';
import editIcon from '../../../assets/myroute_icon/편집.svg';
import deleteIcon from '../../../assets/myroute_icon/삭제.svg';
import memoIcon from '../../../assets/myroute_icon/메모.svg';
import addIcon from '../../../assets/myroute_icon/추가.svg';
import searchIcon from '../../../assets/myroute_icon/검색.svg';
import companionIcon from '../../../assets/myroute_icon/일행추가.svg';
import exploreIcon from '../../../assets/myroute_icon/주변탐색.svg';
import busIcon from '../../../assets/myroute_icon/버스예약.svg';
import publicIcon from '../../../assets/myroute_icon/공개.svg';
import privateIcon from '../../../assets/myroute_icon/비공개.svg';
import trashIcon from '../../../assets/myroute_icon/휴지통.svg';
import defaultProfile from '../../../assets/default_profile.png';
import GoogleMapContainer from '../../../components/GoogleMapContainer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MyRoute() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [companions, setCompanions] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedCompanions, setSelectedCompanions] = useState([]);
  const [memoText, setMemoText] = useState('');

  // 루트 상세 정보 조회
  useEffect(() => {
    const fetchRouteDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setRouteData(result.data);
          }
        } else {
          console.error('루트 상세 조회 실패');
        }
      } catch (error) {
        console.error('루트 상세 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchRouteDetail();
    }
  }, [routeId]);

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 장소 추가
  const handleAddPlace = () => {
    navigate(`/route/${routeId}/add-place`);
  };

  // 바텀시트 토글
  const toggleBottomSheet = () => {
    setShowBottomSheet(!showBottomSheet);
  };

  // 공유 모달 열기
  const handleShare = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}/share`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setShareData(result.data);
          setShowShareModal(true);
        }
      }
    } catch (error) {
      console.error('공유 링크 생성 에러:', error);
      alert('공유 링크 생성에 실패했습니다.');
    }
  };

  // 일행 목록 조회
  const fetchCompanions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}/participants`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCompanions(result.data);
        }
      }
    } catch (error) {
      console.error('일행 목록 조회 에러:', error);
    }
  };

  // 일행 추가 모달 열기
  const handleOpenCompanionModal = async () => {
    await fetchCompanions();
    setShowCompanionModal(true);
    setDeleteMode(false);
    setSelectedCompanions([]);
  };

  // 일행 삭제 모드 토글
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedCompanions([]);
  };

  // 일행 선택/해제
  const toggleCompanionSelection = (userId) => {
    setSelectedCompanions(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // 일행 삭제
  const handleDeleteCompanions = async () => {
    if (selectedCompanions.length === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}/participants`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds: selectedCompanions })
      });

      if (response.ok) {
        alert('일행이 삭제되었습니다.');
        await fetchCompanions();
        setDeleteMode(false);
        setSelectedCompanions([]);
      }
    } catch (error) {
      console.error('일행 삭제 에러:', error);
      alert('일행 삭제에 실패했습니다.');
    }
  };

  // 일행 추가
  const handleAddCompanion = async (shareCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}/participants`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shareCode })
      });

      if (response.ok) {
        alert('일행이 추가되었습니다.');
        await fetchCompanions();
      }
    } catch (error) {
      console.error('일행 추가 에러:', error);
      alert('일행 추가에 실패했습니다.');
    }
  };

  // 루트 삭제
  const handleDeleteRoute = async () => {
    if (!confirm('정말 이 루트를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('루트가 삭제되었습니다.');
        navigate('/routes');
      }
    } catch (error) {
      console.error('루트 삭제 에러:', error);
      alert('루트 삭제에 실패했습니다.');
    }
  };

  // 메모 생성 (임시)
  const handleCreateMemo = async (placeId) => {
    const memo = prompt('메모를 입력하세요:');
    if (!memo) return;

    // TODO: 실제 API 연동
    console.log('메모 생성:', { placeId, memo });
    alert('메모가 저장되었습니다. (임시)');
  };

  if (loading) {
    return <div className="myroute-loading">로딩 중...</div>;
  }

  if (!routeData) {
    return <div className="myroute-error">루트를 찾을 수 없습니다.</div>;
  }

  // 현재 선택된 날짜의 장소들
  const currentDayPlaces = routeData.days?.find(day => day.dayNumber === selectedDay)?.places || [];

  // 지도에 표시할 위치들
  const mapLocations = currentDayPlaces.map(place => ({
    lat: place.latitude,
    lng: place.longitude,
    name: place.name,
    order: place.order
  }));

  return (
    <div className="myroute-page">
      {/* 헤더 */}
      <div className="myroute-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBack}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
          
          {/* 일행 프로필 */}
          <div className="companions-profiles" onClick={handleOpenCompanionModal}>
            {routeData.companions?.slice(0, 3).map((companion, index) => (
              <img 
                key={companion.userId || index}
                src={companion.profileImage || defaultProfile}
                alt={companion.nickname || '일행'}
                className="companion-profile"
                style={{ zIndex: 3 - index }}
              />
            ))}
          </div>
        </div>

        <div className="header-actions">
          <button className="header-icon-btn" onClick={handleShare}>
            <img src={shareIcon} alt="공유" />
          </button>
          <button className="header-icon-btn" onClick={() => navigate(`/route/${routeId}/edit`)}>
            <img src={editIcon} alt="편집" />
          </button>
          <button className="header-icon-btn" onClick={handleDeleteRoute}>
            <img src={deleteIcon} alt="삭제" />
          </button>
        </div>
      </div>

      {/* 지도 */}
      <div className="myroute-map-container">
        <GoogleMapContainer 
          center={mapLocations[0] || { lat: 37.5665, lng: 126.9780 }}
          routeLocations={mapLocations}
        />
        
        {/* 주변 탐색 버튼 */}
        <button className="explore-nearby-btn">
          <img src={exploreIcon} alt="주변 탐색" className="btn-icon" />
          주변 탐색
        </button>

        {/* 바텀시트 토글 버튼 */}
        <button className="toggle-sheet-btn" onClick={toggleBottomSheet}>
          {showBottomSheet ? '▼' : '▲'}
        </button>
      </div>

      {/* 루트 정보 바텀시트 */}
      <div className={`route-bottomsheet ${showBottomSheet ? 'open' : ''}`}>
        <div className="bottomsheet-handle" onClick={toggleBottomSheet}>
          <div className="handle-bar"></div>
        </div>

        <div className="bottomsheet-content-wrapper">
          {/* 타이틀 및 날짜 */}
          <div className="route-title-section">
            <div className="title-row">
              <h1 className="route-title">{routeData.name}</h1>
              <div className="route-visibility">
                <img 
                  src={routeData.isPublic ? publicIcon : privateIcon} 
                  alt={routeData.isPublic ? '공개' : '비공개'}
                  className="visibility-icon"
                />
                <span>{routeData.isPublic ? '공개' : '비공개'}</span>
              </div>
            </div>
            
            <p className="route-date">
              {routeData.startDate} - {routeData.endDate}
            </p>

            {/* 태그 */}
            {routeData.tags && routeData.tags.length > 0 && (
              <div className="route-category-tags">
                {routeData.tags.map((tag, index) => (
                  <span key={index} className="category-tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* 일정 추가 버튼 */}
          <div className="schedule-actions">
            <button className="schedule-action-btn" onClick={handleOpenCompanionModal}>
              <img src={companionIcon} alt="일행 추가" className="btn-icon" />
              일행 추가
            </button>
            <button className="schedule-action-btn">
              <img src={busIcon} alt="버스예약" className="btn-icon" />
              버스/기차 예매
            </button>
          </div>

          {/* DAY 선택 */}
          <div className="day-selector">
            {routeData.days?.map((day) => (
              <button
                key={day.dayNumber}
                className={`day-btn ${selectedDay === day.dayNumber ? 'active' : ''}`}
                onClick={() => setSelectedDay(day.dayNumber)}
              >
                DAY {day.dayNumber}
              </button>
            ))}
          </div>

          {/* 장소 목록 */}
          <div className="places-list">
            {currentDayPlaces.length === 0 ? (
              <div className="empty-places">
                <p>아직 추가된 장소가 없습니다.</p>
              </div>
            ) : (
              currentDayPlaces.map((place, index) => (
                <div key={place.placeId || index} className="place-item">
                  <div className="place-number">{place.order || index + 1}</div>
                  
                  <div className="place-content">
                    <div className="place-image">
                      <img 
                        src={place.thumbnailUrl || 'https://via.placeholder.com/80'} 
                        alt={place.name}
                      />
                    </div>
                    
                    <div className="place-info">
                      <h4 className="place-name">{place.name}</h4>
                      <p className="place-address">{place.address}</p>
                    </div>

                    <button 
                      className="memo-btn" 
                      onClick={() => handleCreateMemo(place.placeId)}
                      title="메모 추가"
                    >
                      <img src={memoIcon} alt="메모" />
                    </button>
                  </div>

                  {place.memo && (
                    <div className="place-memo">
                      <img src={memoIcon} alt="메모" className="memo-icon" />
                      <p>{place.memo}</p>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* 장소 추가 버튼 */}
            <button className="add-place-btn" onClick={handleAddPlace}>
              <img src={addIcon} alt="추가" />
              장소 추가
            </button>
          </div>
        </div>
      </div>

      {/* 공유 모달 */}
      {showShareModal && shareData && (
        <>
          <div className="modal-overlay" onClick={() => setShowShareModal(false)} />
          <div className="share-modal">
            <div className="modal-header">
              <h2>루트 공유</h2>
              <button className="modal-close-btn" onClick={() => setShowShareModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="qr-code-container">
                <img src={shareData.qrCodeUrl} alt="QR 코드" className="qr-code" />
              </div>
              <div className="share-link-container">
                <input 
                  type="text" 
                  value={shareData.shareUrl} 
                  readOnly 
                  className="share-link-input"
                  onClick={(e) => e.target.select()}
                />
                <button 
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(shareData.shareUrl);
                    alert('링크가 복사되었습니다!');
                  }}
                >
                  복사
                </button>
              </div>
              <p className="share-code">공유 코드: {shareData.shareCode}</p>
            </div>
          </div>
        </>
      )}

      {/* 일행 관리 모달 */}
      {showCompanionModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowCompanionModal(false)} />
          <div className="companion-modal">
            <div className="modal-header">
              <h2>일행 관리</h2>
              <button className="modal-close-btn" onClick={() => setShowCompanionModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="companion-list">
                {companions.map((companion) => (
                  <div key={companion.userId} className="companion-item">
                    {deleteMode && (
                      <input
                        type="checkbox"
                        checked={selectedCompanions.includes(companion.userId)}
                        onChange={() => toggleCompanionSelection(companion.userId)}
                        className="companion-checkbox"
                      />
                    )}
                    <img 
                      src={companion.profileImage || defaultProfile} 
                      alt={companion.nickname}
                      className="companion-avatar"
                    />
                    <span className="companion-name">{companion.nickname || companion.name}</span>
                  </div>
                ))}
              </div>
              <div className="companion-actions">
                {deleteMode ? (
                  <>
                    <button 
                      className="cancel-btn" 
                      onClick={toggleDeleteMode}
                    >
                      취소
                    </button>
                    <button 
                      className="delete-confirm-btn" 
                      onClick={handleDeleteCompanions}
                      disabled={selectedCompanions.length === 0}
                    >
                      삭제하기
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="delete-mode-btn" 
                      onClick={toggleDeleteMode}
                    >
                      <img src={trashIcon} alt="삭제" />
                      일행 삭제
                    </button>
                    <button 
                      className="add-companion-btn" 
                      onClick={() => {
                        const code = prompt('공유 코드를 입력하세요:');
                        if (code) handleAddCompanion(code);
                      }}
                    >
                      <img src={companionIcon} alt="추가" />
                      일행 추가
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MyRoute;
