import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import sandriLogo from '../../../assets/sandri_logo.svg';
import eyeOpen from '../../../assets/eye.svg';
import eyeOff from '../../../assets/eye-off.svg';
import backIcon from '../../../assets/back_icon.svg';
import welcome from '../../../assets/welcome.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    birthDate: '',
    gender: '',
    location: '',
    referrerUsername: ''
  });

  // 생년월일 입력 데이터 
  const [birthInputs, setBirthInputs] = useState({
    birthDate: '',
    genderNum: ''
  });

  // 아이디 중복확인 상태
  const [usernameCheck, setUsernameCheck] = useState({
    checked: false,
    available: false,
    message: ''
  });

  // 닉네임 중복확인 상태
  const [nicknameCheck, setNicknameCheck] = useState({
    checked: false,
    available: false,
    message: ''
  });

  // 비밀번호 일치 여부
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 아이디 변경 시 중복확인 초기화
    if (name === 'username') {
      setUsernameCheck({ checked: false, available: false, message: '' });
    }
    
    // 닉네임 변경 시 중복확인 초기화
    if (name === 'nickname') {
      setNicknameCheck({ checked: false, available: false, message: '' });
    }

    // 비밀번호 일치 여부 실시간 확인
    if (name === 'password' || name === 'confirmPassword') {
      const pwd = name === 'password' ? value : formData.password;
      const confirmPwd = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordMatch(pwd === confirmPwd || confirmPwd === '');
    }
  };

  // 생년월일/성별 입력 핸들러
  const handleBirthInputChange = (field, value) => {
    if (!/^\d*$/.test(value)) return; 

    if (field === 'birthDate') {
      if (value.length > 6) return; 
      setBirthInputs(prev => ({ ...prev, birthDate: value }));
      
      if (value.length === 6 && birthInputs.genderNum) {
        const genderNum = birthInputs.genderNum;
        const century = ['1', '2'].includes(genderNum) ? '19' : '20';
        const year = `${century}${value.substring(0, 2)}`;
        const month = value.substring(2, 4);
        const day = value.substring(4, 6);
        setFormData(prev => ({ ...prev, birthDate: `${year}-${month}-${day}` }));
      }
    } 
    
    else if (field === 'genderNum') {
      if (value.length > 1) return; 
      setBirthInputs(prev => ({ ...prev, genderNum: value }));
      
      if (value) {
        const genderValue = ['1', '3'].includes(value) ? 'MALE' : 
                           ['2', '4'].includes(value) ? 'FEMALE' : '';
        setFormData(prev => ({ ...prev, gender: genderValue }));

        if (birthInputs.birthDate.length === 6) {
          const century = ['1', '2'].includes(value) ? '19' : '20';
          const year = `${century}${birthInputs.birthDate.substring(0, 2)}`;
          const month = birthInputs.birthDate.substring(2, 4);
          const day = birthInputs.birthDate.substring(4, 6);
          setFormData(prev => ({ ...prev, birthDate: `${year}-${month}-${day}` }));
        }
      }
    }
  };

  // 아이디 중복확인
  const checkUsername = async () => {
    if (!formData.username) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/check-username?username=${formData.username}`, 
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      // HTTP 상태 코드 확인
      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        console.error('예상치 못한 응답 형식:', result);
        throw new Error(result.message || '서버 응답 형식이 올바르지 않습니다.');
      }
      
      const isAvailable = !result.data.duplicate;
      
      setUsernameCheck({
        checked: true,
        available: isAvailable,
        message: result.data.message || (isAvailable ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.')
      });
    } catch (error) {
      console.error('아이디 중복확인 에러:', error);
      alert(error.message || '중복확인 중 오류가 발생했습니다.');
      setUsernameCheck({
        checked: false,
        available: false,
        message: ''
      });
    }
  };

  // 닉네임 중복확인
  const checkNickname = async () => {
    if (!formData.nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/check-nickname?nickname=${formData.nickname}`, 
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      // HTTP 상태 코드 확인
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

  // 뒤로가기
  const handleGoBack = () => {
    if (currentStep === 1) {
      navigate('/users/login');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // 다음
  const handleNext = () => {
    if (!formData.name || !formData.username || !formData.password || !formData.confirmPassword) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (!usernameCheck.checked || !usernameCheck.available) {
      alert('아이디 중복확인을 해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setCurrentStep(2);
  };

  const handleSignupComplete = async () => {
    if (!formData.nickname || !formData.birthDate || !formData.gender || !formData.location) {
      alert('필수 입력 항목을 모두 입력해주세요.');
      return;
    }

    if (!nicknameCheck.checked || !nicknameCheck.available) {
      alert('닉네임 중복확인을 해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const requestData = {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        nickname: formData.nickname,
        birthDate: formData.birthDate,
        gender: formData.gender,
        location: formData.location,
        referrerUsername: formData.referrerUsername || null
      };
      
      console.log('회원가입 요청 데이터:', requestData);

      const signupResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      // 회원가입 실패 처리
      if (!signupResponse.ok) {
        let errorMessage = '회원가입에 실패했습니다.';
        try {
          const errorData = await signupResponse.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `회원가입 실패 (상태 코드: ${signupResponse.status})`;
        }
        throw new Error(errorMessage);
      }

      try {
        const signupData = await signupResponse.json();
        console.log('회원가입 성공:', signupData);
      } catch {
        console.log('회원가입 성공 (응답 없음)');
      }

      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (loginResponse.ok) {
        console.log('자동 로그인 성공');
      }

      // 3. 환영 화면으로 이동
      setCurrentStep(3);
      
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert(error.message || '회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  const handleTest = () => {
    navigate('/test');
  };

  const handleStartService = () => {
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  // 비밀번호 입력 필드 
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
        aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
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

  // Step 1
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
          <div className="input-with-button">
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="아이디 입력"
              value={formData.username}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className={`check-btn ${formData.username ? 'active' : ''}`}
              onClick={checkUsername}
              disabled={!formData.username}
            >
              중복확인
            </button>
          </div>
          {usernameCheck.checked && (
            <p className={`validation-message ${usernameCheck.available ? 'success' : 'error'}`}>
              {usernameCheck.available ? usernameCheck.message : `*${usernameCheck.message}`}
            </p>
          )}
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
          {renderPasswordInput('confirmPassword', '비밀번호 재확인 입력', showPasswordConfirm, togglePasswordConfirmVisibility)}
          {formData.confirmPassword && !passwordMatch && (
            <p className="validation-message error">*비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <button 
          type="button"
          className={`next-btn ${formData.name && formData.username && formData.password && formData.confirmPassword ? 'active' : ''}`}
          onClick={handleNext}
          disabled={!formData.name || !formData.username || !formData.password || !formData.confirmPassword}
        >
          다음
        </button>
      </form>
    </>
  );

  // Step 2
  const renderStep2 = () => (
    <>
      <h2>함께 하는 경산 루트</h2>
      <h3>서비스 이용을 위해 회원가입해 주세요</h3>
      
      <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">
            닉네임<span className="required-mark">*</span>
          </label>
          <div className="input-with-button">
            <input
              type="text"
              name="nickname"
              className="form-input"
              placeholder="닉네임 입력"
              value={formData.nickname}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className={`check-btn ${formData.nickname ? 'active' : ''}`}
              onClick={checkNickname}
              disabled={!formData.nickname}
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
            name="referrerUsername"
            className="form-input"
            placeholder="추천인 아이디 입력 (선택사항)"
            value={formData.referrerUsername}
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

  // Step 3
  const renderStep3 = () => (
    <div className="welcome-container">
      <h1 className="welcome-title">{formData.name}님 환영합니다!</h1>
      <p className="welcome-subtitle">
        당신의 성향을 바탕으로<br />
        좋은 여행 루트를 찾아드려요.
      </p>
      
      <div className="welcome-illustration">
        <img src={welcome} alt="Welcome Illustration" className="welcome-image" />
      </div>
      
      <button className="start-btn" onClick={handleTest}>
        성향 테스트하러 가기
      </button>

      <button className="later-link" onClick={handleStartService}>
        나중에 할게요
      </button>
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
