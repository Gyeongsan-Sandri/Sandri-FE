import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './route_list.css';
import searchIcon from '../../../assets/myroute_icon/검색.svg';
import cameraIcon from '../../../assets/myroute_icon/camera.svg';
import publicIcon from '../../../assets/myroute_icon/공개.svg';
import privateIcon from '../../../assets/myroute_icon/비공개.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 카테고리 목록
const CATEGORIES = [
  '자연/힐링',
  '역사/전통',
  '문화/체험',
  '식도락'
];

function RouteList() {
  const navigate = useNavigate();
  const [myRoutes, setMyRoutes] = useState([]);
  const [hotRoutes, setHotRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    tags: [],
    isPublic: true,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [creating, setCreating] = useState(false);

  // MY 루트 & HOT 루트 목록 조회
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // MY 루트 조회
        const myResponse = await fetch(`${API_BASE_URL}/api/routes/my`, {
          method: 'GET',
          credentials: 'include',
        });

        if (myResponse.ok) {
          const result = await myResponse.json();
          if (result.success && result.data) {
            setMyRoutes(result.data);
          }
        }

        // HOT 루트 조회 (공개 루트 목록)
        const hotResponse = await fetch(`${API_BASE_URL}/api/routes/hot`, {
          method: 'GET',
          credentials: 'include',
        });

        if (hotResponse.ok) {
          const result = await hotResponse.json();
          if (result.success && result.data) {
            setHotRoutes(result.data);
          }
        }
      } catch (error) {
        console.error('루트 목록 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // 루트 클릭 시 상세 페이지로 이동
  const handleRouteClick = (routeId) => {
    navigate(`/routes/${routeId}`);
  };

  // 새 루트 추가 버튼 클릭
  const handleAddRoute = () => {
    setShowBottomSheet(true);
  };

  // 바텀시트 닫기
  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false);
    // 폼 초기화
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      tags: [],
      isPublic: true,
      image: null
    });
    setImagePreview(null);
  };

  // 입력값 변경
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 태그 선택/해제
  const handleTagToggle = (tag) => {
    setFormData(prev => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  // 이미지 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 루트 생성
  const handleCreateRoute = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      alert('루트 이름을 입력해주세요.');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert('여행 일정을 선택해주세요.');
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('종료일은 시작일 이후여야 합니다.');
      return;
    }

    setCreating(true);

    try {
      // 이미지 URL 발급
      let imageUrl = null;
      if (formData.image) {
        // 파일 정보로 URL 발급 요청
        const fileInfo = {
          files: [
            {
              fileName: formData.image.name,
              contentType: formData.image.type,
              order: 0
            }
          ]
        };
        
        const urlResponse = await fetch(`${API_BASE_URL}/api/me/files`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fileInfo)
        });
        
        if (urlResponse.ok) {
          const urlResult = await urlResponse.json();
          if (urlResult.success && urlResult.data && urlResult.data.presignedUrls && urlResult.data.presignedUrls.length > 0) {
            const presignedUrl = urlResult.data.presignedUrls[0].presignedUrl;
            const finalUrl = urlResult.data.presignedUrls[0].finalUrl;
            
            // Presigned URL로 실제 파일 업로드
            if (presignedUrl) {
              const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                body: formData.image,
                headers: {'Content-Type': formData.image.type}
              });
              
              if (uploadResponse.ok) {
                // 업로드 성공 시 최종 URL 저장
                imageUrl = finalUrl;
              } else {
                const resText = await uploadResponse.text();
                console.log(uploadResponse.status, resText);
              }
            }
          }
        }
      }

      // 루트 생성 요청
      const routePayload = {
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        locations: [], // 초기에는 빈 배열
        public: formData.isPublic,
        imageUrl: imageUrl
      };

      // 태그가 있으면 추가
      if (formData.tags.length > 0) {
        routePayload.tags = formData.tags;
      }

      // 이미지 URL이 있으면 추가
      if (imageUrl) {
        routePayload.imageUrl = imageUrl;
      }

      const response = await fetch(`${API_BASE_URL}/api/routes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routePayload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          alert('루트가 생성되었습니다!');
          handleCloseBottomSheet();
          // 루트 목록 새로고침
          const routesResponse = await fetch(`${API_BASE_URL}/api/routes/my`, {
            method: 'GET',
            credentials: 'include',
          });
          if (routesResponse.ok) {
            const routesResult = await routesResponse.json();
            if (routesResult.success && routesResult.data) {
              setMyRoutes(routesResult.data);
            }
          }
        } else {
          alert('루트 생성에 실패했습니다.');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || '루트 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('루트 생성 에러:', error);
      alert('루트 생성 중 오류가 발생했습니다.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="route-list-loading">로딩 중...</div>;
  }

  return (
    <div className="route-list-page">
      {/* 헤더 */}
      <div className="route-list-header">
        <div className="search-container">
          <img src={searchIcon} alt="검색" className="search-icon" />
          <input 
            type="text" 
            placeholder="검색" 
            className="search-input"
          />
        </div>
      </div>

      {/* 타이틀 */}
      <div className="route-list-title-section">
        <h1 className="route-list-title">MY 루트</h1>
      </div>

      {/* MY 루트 목록 */}
      <div className="route-list-container">
        {myRoutes.length === 0 ? (
          <div className="empty-state">
            <p>아직 생성된 루트가 없습니다.</p>
          </div>
        ) : (
          myRoutes.map((route) => (
            <div 
              key={route.id} 
              className="route-item"
              onClick={() => handleRouteClick(route.id)}
            >
              <div className="route-item-content">
                <h3 className="route-item-title">{route.title}</h3>
                <p className="route-item-date">
                  {route.startDate} - {route.endDate}
                </p>
                {route.public && <span className="route-badge">공개</span>}
                {!route.public && <span className="route-badge private">비공개</span>}
              </div>
            </div>
          ))
        )}

        {/* 새 루트 추가 항목 */}
        <div className="route-item add-new" onClick={handleAddRoute}>
          <div className="route-item-content">
            <span className="add-icon">+</span>
            <span className="add-text">새 루트 추가</span>
          </div>
        </div>
      </div>

      {/* HOT 루트 섹션 */}
      <div className="hot-routes-section">
        <h2 className="section-title">지금 HOT한 루트</h2>
        <div className="hot-routes-list">
          {hotRoutes.map((route) => (
            <div 
              key={route.routeId || route.id}
              className="hot-route-card"
              onClick={() => handleRouteClick(route.routeId || route.id)}
            >
              <div className="hot-thumb">
                <img 
                  src={route.imageUrl || 'https://placehold.co/120x120'} 
                  alt={route.title}
                />
                {typeof route.rank === 'number' && (
                  <div className={`hot-rank rank-${route.rank}`}>{route.rank}</div>
                )}
              </div>
              <div className="hot-info">
                <h3 className="hot-title">{route.title}</h3>
                <p className="hot-date">{route.startDate} - {route.endDate}</p>
                <div className="hot-meta">
                  <span className="hot-creator">by {route.creatorNickname || route.creatorName || '알 수 없음'}</span>
                  {typeof route.recentLikes === 'number' && (
                    <span className="hot-badge">HOT</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 루트 생성 바텀시트 */}
      {showBottomSheet && (
        <>
          <div className="bottomsheet-overlay" onClick={handleCloseBottomSheet} />
          <div className="bottomsheet">
            <div className="bottomsheet-header">
              <h2>새 루트 추가</h2>
              <button className="close-btn" onClick={handleCloseBottomSheet}>×</button>
            </div>

            <div className="bottomsheet-content">
              {/* 사진 업로드 */}
              <div className="form-group photo-upload">
                <label htmlFor="photo-input" className="photo-upload-label">
                  {imagePreview ? (
                    <img src={imagePreview} alt="미리보기" className="preview-image" />
                  ) : (
                    <div className="photo-placeholder">
                      <img src={cameraIcon} alt="카메라" className="camera-icon" />
                    </div>
                  )}
                </label>
                <input 
                  id="photo-input"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* 루트 이름 */}
              <div className="form-group">
                <label className="form-label">루트 이름</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="루트 이름을 입력하세요"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  maxLength={50}
                />
              </div>

              {/* 여행 일정 */}
              <div className="form-group">
                <label className="form-label">여행 일정</label>
                <div className="date-inputs">
                  <input 
                    type="date"
                    className="form-input date-input"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                  <span className="date-separator">-</span>
                  <input 
                    type="date"
                    className="form-input date-input"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={formData.startDate}
                  />
                </div>
              </div>

              {/* 태그 */}
              <div className="form-group">
                <label className="form-label">태그</label>
                <div className="tags-container">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      className={`tag-btn ${formData.tags.includes(category) ? 'selected' : ''}`}
                      onClick={() => handleTagToggle(category)}
                    >
                      #{category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 공개 범위 */}
              <div className="form-group">
                <label className="form-label">공개 범위</label>
                <div className="visibility-options">
                  <button
                    className={`visibility-btn ${formData.isPublic ? 'selected' : ''}`}
                    onClick={() => handleInputChange('isPublic', true)}
                  >
                    <img src={publicIcon} alt="공개" className="visibility-icon" />
                    <span>공개</span>
                  </button>
                  <button
                    className={`visibility-btn ${!formData.isPublic ? 'selected' : ''}`}
                    onClick={() => handleInputChange('isPublic', false)}
                  >
                    <img src={privateIcon} alt="비공개" className="visibility-icon" />
                    <span>비공개</span>
                  </button>
                </div>
              </div>

              {/* 생성 버튼 */}
              <button 
                className="create-route-btn"
                onClick={handleCreateRoute}
                disabled={creating}
              >
                {creating ? '생성 중...' : '생성'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RouteList;
