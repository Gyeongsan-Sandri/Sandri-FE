import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoginRequiredModal from './LoginRequiredModal';

function RequireAuth() {
  const [showModal, setShowModal] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      setShowModal(true);
    }
  }, [isLoggedIn, location.pathname]);

  const handleCloseModal = () => {
    setShowModal(false);
    setShouldRedirect(true);
  };

  if (!isLoggedIn && shouldRedirect) {
    return <Navigate to="/mypage" replace />;
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginRequiredModal isOpen={showModal} onClose={handleCloseModal} />
      </>
    );
  }

  return <Outlet />;
}

export default RequireAuth;
