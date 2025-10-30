import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import sandriLogo from '../../../assets/sandri_logo.svg';
import eyeOpen from '../../../assets/eye.svg';
import eyeOff from '../../../assets/eye-off.svg';
import backIcon from '../../../assets/back_icon.svg';

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

  const [birthInputs, setBirthInputs] = useState({
    birthDate: '',
    genderNum: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBirthInputChange = (field, value) => {
    if (!/^\d*$/.test(value)) return;

    if (field === 'birthDate') {
      if (value.length > 6) return;
      setBirthInputs(prev => ({ ...prev, birthDate: value }));
      
      if (value.length === 6) {
        setFormData(prev => ({ ...prev, birthDate: `20${value}` }));
      }
    } else if (field === 'genderNum') {
      if (value.length > 1) return;
      setBirthInputs(prev => ({ ...prev, genderNum: value }));
      
      if (value) {
        const genderValue = ['1', '3'].includes(value) ? 'M' : ['2', '4'].includes(value) ? 'F' : '';
        setFormData(prev => ({ ...prev, gender: genderValue }));
      }
    }
  };

  const handleGoBack = () => {
    if (currentStep === 1) {
      navigate('/auth/login');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!formData.name || !formData.userId || !formData.password || !formData.passwordConfirm) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSignupComplete = async () => {
    if (!formData.nickname || !formData.birthDate || !formData.gender || !formData.location) {
      alert('필수 입력 항목을 모두 입력해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const signupResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          userId: formData.userId,
          password: formData.password,
          nickname: formData.nickname,
          birthDate: formData.birthDate,
          gender: formData.gender,
          location: formData.location,
          referralId: formData.referralId || null
        })
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      const signupData = await signupResponse.json();
      console.log('회원가입 성공:', signupData);

      const loginResponse = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.userId,
          userPassword: formData.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        
        if (loginData.token) {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('user', JSON.stringify({
            userId: formData.userId,
            name: formData.name,
            nickname: formData.nickname
          }));
        }
      }

      setCurrentStep(3);
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert(error.message || '회원가입 처리 중 오류가 발생했습니다.');
    }

    setCurrentStep(3);
  };

  const handleStartService = () => {
    navigate('/user/home');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };


  const renderPasswordInput = (name, placeholder, show, toggleShow) => (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? "text" : "password"}
        name={name}
        className="form-input"
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleInputChange}
        style={{ paddingRight: '50px' }}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={toggleShow}
        aria-label={show ? "비밀번호 보기" : "비밀번호 숨기기"}
      >
        <img
          src={show ? eyeOpen : eyeOff}
          alt="toggle password visibility"
          className="eye-icon"
          draggable={false}
        />
      </button>
    </div>
  );

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
          {renderPasswordInput('password', '비밀번호 입력', showPassword, togglePasswordVisibility)}
        </div>

        <div className="form-group">
          <label className="form-label">
            비밀번호 재확인<span className="required-mark">*</span>
          </label>
          {renderPasswordInput('passwordConfirm', '비밀번호 재확인 입력', showPasswordConfirm, togglePasswordConfirmVisibility)}
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
            <div className="birth-inputs">
              <input
                type="text"
                className="birth-full"
                placeholder="YYMMDD"
                value={birthInputs.birthDate}
                onChange={(e) => handleBirthInputChange('birthDate', e.target.value)}
                maxLength="6"
                inputMode="numeric"
              />
              <span className="birth-separator">-</span>
              <input
                type="text"
                className="birth-segment gender-segment"
                placeholder="0"
                value={birthInputs.genderNum}
                onChange={(e) => handleBirthInputChange('genderNum', e.target.value)}
                maxLength="1"
                inputMode="numeric"
              />
              <div className="gender-dots">
                <span className="dot">•</span>
                <span className="dot">•</span>
                <span className="dot">•</span>
                <span className="dot">•</span>
                <span className="dot">•</span>
                <span className="dot">•</span>
              </div>
            </div>
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

  const renderStep3 = () => (
    <div className="welcome-container">
      <h1 className="welcome-title">{formData.name}님 환영합니다!</h1>
      <p className="welcome-subtitle">
        당신의 성향을 바탕으로<br />
        좋은 여행 루트를 찾아드려요.
      </p>
      
      <div className="welcome-illustration">🎉</div>
      
      <button className="start-btn" onClick={handleStartService}>
        성향 테스트하러 가기
      </button>

      <a className="later-link" href="/main">나중에 할게요</a> {/* 메인 페이지로 이동 */}
    </div>
  );

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        {currentStep !== 3 && (
          <div className="header">
            <button
              className="back-btn"
              type="button"
              aria-label="뒤로가기"
              onClick={handleGoBack}
            >
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <img src={sandriLogo} alt="Sandri Logo" className="logo" />
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Signup;
