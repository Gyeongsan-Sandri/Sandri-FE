import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login/login';
import Signup from './pages/auth/signup/signup';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 기본 경로는 로그인 페이지로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          
          {/* 인증 관련 라우트 */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          
          {/* 404 페이지 - 추후 추가 */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
