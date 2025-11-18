import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './mypage_modify.css';
import backIcon from '../../../assets/back_icon.svg';
import defaultProfile from '../../../assets/default_profile.png';

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

const MyPageModify = () => {
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState({
    username: '',
    nickname: '',
    name: '',
    profileImage: null,
    travelStyle: null
  });
  const [profileImage, setProfileImage] = useState(null);
  
  // 닉네임 중복확인 상태
  const [nicknameCheck, setNicknameCheck] = useState({
    checked: false,
    available: false,
    message: ''
  });

  // 사용자 정보 불러오기
  useEffect(() => {
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
            setProfileImage(result.data.profileImage || null);
          }
        }
      } catch (error) {
        console.error('프로필 조회 에러:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e) => {
    setUserProfile(prev => ({ ...prev, nickname: e.target.value }));
    setNicknameCheck({ checked: false, available: false, message: '' });
  };

  // 닉네임 중복확인
  const checkNickname = async () => {
    if (!userProfile.nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/check-nickname?nickname=${userProfile.nickname}`, 
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        console.error('예상치 못한 응답 형식:', result);
        throw new Error(result.message || '서버 응답 형식이 올바르지 않습니다.');
      }
      
      const isAvailable = !result.data.duplicate;
      
      setNicknameCheck({
        checked: true,
        available: isAvailable,
        message: result.data.message || (isAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.')
      });
    } catch (error) {
      console.error('닉네임 중복확인 에러:', error);
      alert(error.message || '중복확인 중 오류가 발생했습니다.');
      setNicknameCheck({
        checked: false,
        available: false,
        message: ''
      });
    }
  };

  // 완료 버튼 클릭
  const handleComplete = async () => {
    if (!userProfile.nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (!nicknameCheck.checked || !nicknameCheck.available) {
      alert('닉네임 중복확인을 해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/nickname`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nickname: userProfile.nickname })
      });

      if (response.ok) {
        alert('프로필이 수정되었습니다.');
        navigate('/mypage');
      } else {
        throw new Error('프로필 수정 실패');
      }
    } catch (error) {
      console.error('프로필 수정 에러:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="modify-page">
      <div className="modify-wrapper">
        {/* 헤더 */}
        <div className="modify-header">
          <button className="modify-back-btn" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
          <h1 className="modify-title">프로필설정</h1>
          <button className="complete-btn" onClick={handleComplete}>
            완료
          </button>
        </div>

        {/* 프로필 이미지 */}
        <div className="profile-section">
          <div className="profile-image-wrapper">
            <img 
              src={
                userProfile.travelStyle && travelStyleMap[userProfile.travelStyle]
                  ? travelStyleMap[userProfile.travelStyle]
                  : profileImage || defaultProfile
              } 
              alt="프로필" 
              className="profile-img" 
            />
          </div>
        </div>

        {/* 닉네임 입력 */}
        <div className="form-group">
          <label className="form-label">닉네임</label>
          <div className="input-with-button">
            <input
              type="text"
              name="nickname"
              className="form-input"
              placeholder="닉네임 입력"
              value={userProfile.nickname}
              onChange={handleNicknameChange}
            />
            <button
              type="button"
              className={`check-btn ${userProfile.nickname ? 'active' : ''}`}
              onClick={checkNickname}
              disabled={!userProfile.nickname}
            >
              중복확인
            </button>
          </div>
          {nicknameCheck.checked && (
            <p className={`validation-message ${nicknameCheck.available ? 'success' : 'error'}`}>
              {nicknameCheck.available ? nicknameCheck.message : `*${nicknameCheck.message}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPageModify;
