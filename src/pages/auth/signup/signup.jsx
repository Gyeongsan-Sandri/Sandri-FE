import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

// assets 폴더에서 이미지들을 import
import sandriLogo from '../../../assets/sandri_logo.svg';
import eyeOpen from '../../../assets/eye.svg';
import eyeOff from '../../../assets/eye-off.svg';

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    birthDate: '',
    gender: '',
    location: '',
    referralId: ''
  });

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 뒤로가기
  const handleGoBack = () => {
    if (currentStep === 1) {
      navigate('/auth/login');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // 다음 단계
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 회원가입 완료
  const handleSignupComplete = () => {
    console.log('회원가입 완료:', formData);
    // 실제 회원가입 API 호출
    setCurrentStep(3); // 환영 페이지로
  };

  // 서비스 시작
  const handleStartService = () => {
    navigate('/auth/login');
  };

  // 비밀번호 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  // 1단계: 기본 정보
  const renderStep1 = () => (
    <>
      <h2>함께 하는 경산 루트</h2>
      <h3>서비스 이용을 위해 회원가입해 주세요</h3>
      
      <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">
            이름<span className="required-mark">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="이름 입력"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            아이디<span className="required-mark">*</span>
          </label>
          <input
            type="text"
            name="userId"
            className="form-input"
            placeholder="아이디 입력"
            value={formData.userId}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            비밀번호<span className="required-mark">*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-input"
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleInputChange}
              style={{ paddingRight: '50px' }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <img
                src={showPassword ? eyeOff : eyeOpen}
                alt="toggle password visibility"
                className="eye-icon"
                draggable={false}
              />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            비밀번호 재확인<span className="required-mark">*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPasswordConfirm ? "text" : "password"}
              name="passwordConfirm"
              className="form-input"
              placeholder="비밀번호 재확인 입력"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              style={{ paddingRight: '50px' }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordConfirmVisibility}
              aria-label={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <img
                src={showPasswordConfirm ? eyeOff : eyeOpen}
                alt="toggle password visibility"
                className="eye-icon"
                draggable={false}
              />
            </button>
          </div>
        </div>

        <button 
          type="button"
          className={`next-btn ${formData.name && formData.userId && formData.password && formData.passwordConfirm ? 'active' : ''}`}
          onClick={handleNext}
          disabled={!formData.name || !formData.userId || !formData.password || !formData.passwordConfirm}
        >
          다음
        </button>
      </form>
    </>
  );

  // 2단계: 추가 정보
  const renderStep2 = () => (
    <>
      <h2>함께 하는 경산 루트</h2>
      <h3>서비스 이용을 위해 회원가입해 주세요</h3>
      
      <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">
            닉네임<span className="required-mark">*</span>
          </label>
          <input
            type="text"
            name="nickname"
            className="form-input"
            placeholder="닉네임 입력"
            value={formData.nickname}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            생년월일 및 성별<span className="required-mark">*</span>
          </label>
          <div className="birth-gender-container">
            <input
              type="text"
              name="birthDate"
              className="form-input birth-input"
              placeholder="YYYYMMDD"
              value={formData.birthDate}
              onChange={handleInputChange}
              maxLength="8"
            />
            <select
              name="gender"
              className="gender-select"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">성별</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            사는 곳<span className="required-mark">*</span>
          </label>
          <div className="location-container">
            <select
              name="location"
              className="location-select"
              value={formData.location}
              onChange={handleInputChange}
            >
              <option value="">지역을 선택해주세요</option>
              <option value="seoul">서울</option>
              <option value="gyeonggi">경기/인천</option>
              <option value="gyeongsan">경산</option>
              <option value="gyeongbuk">경북</option>
              <option value="gyeongnam">경남</option>
              <option value="daegu">대구</option>
              <option value="busan">부산/울산</option>
              <option value="chungbuk">충북</option>
              <option value="chungnam">충남/대전/세종</option>
              <option value="jeonbuk">전북</option>
              <option value="jeonnam">전남/광주</option>
              <option value="gangwon">강원</option>
              <option value="jeju">제주</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="referral-label">추천인 아이디</label>
          <input
            type="text"
            name="referralId"
            className="form-input"
            placeholder="추천인 아이디 입력 (선택사항)"
            value={formData.referralId}
            onChange={handleInputChange}
          />
        </div>

        <button 
          type="button"
          className={`next-btn ${formData.nickname && formData.birthDate && formData.gender && formData.location ? 'active' : ''}`}
          onClick={handleSignupComplete}
          disabled={!formData.nickname || !formData.birthDate || !formData.gender || !formData.location}
        >
          회원가입
        </button>
      </form>
    </>
  );

  // 3단계: 환영 메시지
  const renderStep3 = () => (
    <div className="welcome-container">
      <h1 className="welcome-title">{formData.name}님 환영합니다!</h1>
      <p className="welcome-subtitle">
        당신의 성향을 바탕으로<br />
        좋은 여행 루트를 찾아드려요.
      </p>
      
      <div className="welcome-illustration">
        🎉
      </div>
      
      <button 
        className="start-btn"
        onClick={handleStartService}
      >
        서비스로 돌아가기
      </button>
      
      <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--muted)' }}>
        나중에 설정
      </p>
    </div>
  );

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        {/* 헤더 영역 - 환영 페이지에서는 숨김 */}
        {currentStep !== 3 && (
          <div className="header">
            <button
              className="back-btn"
              type="button"
              aria-label="뒤로가기"
              onClick={handleGoBack}
            >
              &lt;
            </button>
            <img
              src={sandriLogo}
              alt="Sandri Logo"
              className="logo"
            />
          </div>
        )}

        {/* 단계별 렌더링 */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Signup;
