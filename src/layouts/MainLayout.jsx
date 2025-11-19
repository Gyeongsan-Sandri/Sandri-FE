import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import './MainLayout.css';

function MainLayout() {
  const location = useLocation();
  
  // 하단 네비게이션을 숨길 경로들
  const hideNavPaths = ['/users/login', '/users/register', '/test'];
  const baseHide = hideNavPaths.some(path => location.pathname.startsWith(path));
  // Hide on route detail pages like /routes/:routeId (but not /routes, /routes/list, /routes/search)
  const isRouteDetail = /^\/routes\/(?!list$|search$).+/.test(location.pathname);
  const shouldHideNav = baseHide || isRouteDetail;

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
