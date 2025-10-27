import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

// assets 폴더에서 이미지들을 import
import sandriLogo from '../../../assets/sandri_logo.svg';
import kakaoLogo from '../../../assets/kakao.svg';
import naverLogo from '../../../assets/naver_logo.svg';
import appleLogo from '../../../assets/apple.svg';
import eyeOpen from '../../../assets/eye.svg';
import eyeOff from '../../../assets/eye-off.svg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    userPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userName || !formData.userPassword) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try { // fetch는 나중에 링크 수정
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const data = await response.json();
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('비밀번호 또는 아이디가 일치하지 않습니다.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('토큰이 존재하지 않습니다.');
      return;
    }
    navigate('/mypage'); // 마이페이지 만들면 거기로 이동
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSignUp = () => {
    navigate('/auth/signup');
  };

  const handleKakaoLogin = () => {
    console.log('카카오 로그인 구현중');
  };

  const handleNaverLogin = () => {
    console.log('네이버 로그인 구현중');
  };

  const handleAppleLogin = () => {
    console.log('애플 로그인 구현중');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
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

        <h2>함께 하는 경산 루트</h2>
        <h3>서비스 이용을 위해 로그인해주세요</h3>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName" className="form-label">
              아이디
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              className="form-input"
              placeholder="아이디, 혹은 휴대폰 번호 입력" // 일단 디자인이 이렇게 나와서 이렇게 함
              value={formData.userName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="userPassword" className="form-label">
              비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="userPassword"
                name="userPassword"
                className="form-input"
                placeholder="비밀번호 입력"
                value={formData.userPassword}
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
                  src={showPassword ? eyeOpen : eyeOff}
                  alt="toggle password visibility"
                  className="eye-icon"
                  draggable={false}
                />
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="links">
            <button
              type="button"
              onClick={handleSignUp}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: 'inherit'
              }}
            >
              회원가입
            </button>
            <span>|</span>
            <a href="/user/find-password">ID/PW찾기</a>
          </div>

          <hr className="divider" />

          <div className="social-login" aria-label="소셜 로그인">
            <img
              src={kakaoLogo}
              alt="카카오 로그인"
              onClick={handleKakaoLogin}
            />
            <img
              src={naverLogo}
              alt="네이버 로그인"
              onClick={handleNaverLogin}
            />
            <img
              src={appleLogo}
              alt="애플 로그인"
              onClick={handleAppleLogin}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;