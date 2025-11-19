import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import './MainLayout.css';

function MainLayout() {
  const location = useLocation();
  const hideNavPaths = ['/users/login', '/users/register', '/test'];
  const baseHide = hideNavPaths.some(path => location.pathname.startsWith(path));
  const isRouteDetail = /^\/routes\/(?!list$|search$).+/.test(location.pathname);
  const shouldHideNav = baseHide || isRouteDetail;
  const useFrame = !isRouteDetail;

  return (
    <div className="main-layout">
      <main className="main-content">
        {useFrame ? (
          <div className="content-frame">
            <Outlet />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      {!shouldHideNav && <BottomNav />}
    </div>
  );
}

export default MainLayout;
