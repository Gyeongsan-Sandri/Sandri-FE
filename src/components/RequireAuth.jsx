import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function RequireAuth() {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error('인증 확인 에러:', error);
        setIsLoggedIn(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return null; 
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
