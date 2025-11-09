import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import './MainLayout.css';

function MainLayout() {
  const location = useLocation();
  
  // 하단 네비게이션을 숨길 경로들
  const hideNavPaths = ['/users/login', '/users/register', '/test'];
  const shouldHideNav = hideNavPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="main-layout">
      <main className="main-content">
        <Outlet />
      </main>
      {!shouldHideNav && <BottomNav />}
    </div>
  );
}

export default MainLayout;
