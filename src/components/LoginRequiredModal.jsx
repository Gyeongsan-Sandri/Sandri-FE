import { useNavigate } from 'react-router-dom';
import './LoginRequiredModal.css';

function LoginRequiredModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate('/users/login');
  };

  return (
    <div className="login-required-modal-overlay" onClick={onClose}>
      <div className="login-required-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-required-modal-body">
          <p className="login-required-modal-message">로그인이 필요한 서비스입니다.</p>
        </div>
        <div className="login-required-modal-buttons">
          <button className="login-required-modal-btn cancel" onClick={onClose}>
            취소
          </button>
          <button className="login-required-modal-btn login" onClick={handleLogin}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;
