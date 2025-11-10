import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './BottomNav.css';
import LoginRequiredModal from './LoginRequiredModal';

import homeIcon from '../assets/nav_icon/home_icon.svg';
import collectionIcon from '../assets/nav_icon/collect_icon.svg';
import myRouteIcon from '../assets/nav_icon/myroute_icon.svg';
import interestIcon from '../assets/nav_icon/like_icon.svg';
import myPageIcon from '../assets/nav_icon/mypage_icon.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navItems = [
    { 
      id: 'home', 
      label: '홈', 
      path: '/', 
      icon: homeIcon,
      requiresAuth: false 
    },
    { 
      id: 'collection', 
      label: '수집', 
      path: '/collection', 
      icon: collectionIcon,
      requiresAuth: true
    },
    { 
      id: 'myroute', 
      label: 'MY 루트', 
      path: '/routes', 
      icon: myRouteIcon,
      requiresAuth: true
    },
    { 
      id: 'interest', 
      label: '관심', 
      path: '/likes', 
      icon: interestIcon,
      requiresAuth: true  
    },
    { 
      id: 'mypage', 
      label: '마이페이지', 
      path: '/mypage', 
      icon: myPageIcon,
      requiresAuth: true  
    },
  ];


  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = async (item) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });

    const isLoggedIn = response.ok;

    if (item.requiresAuth && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    navigate(item.path);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <LoginRequiredModal isOpen={showLoginModal} onClose={handleCloseModal} />
      
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
          >
            <img src={item.icon} alt={item.label} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

export default BottomNav;
