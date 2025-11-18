import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './mypage_pointshop.css';

import backIcon from '../../../assets/back_icon.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MyPagePointShop() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: 구매, 1: 결제내역, 2: 사용내역
  const [userPoints, setUserPoints] = useState(200); // 보유 포인트
  const [couponCount, setCouponCount] = useState(0); // 쿠폰 개수
  const [purchaseList, setPurchaseList] = useState([]); // 구매 가능한 쿠폰 목록
  const [paymentHistory, setPaymentHistory] = useState([]); // 결제 내역
  const [usageHistory, setUsageHistory] = useState([]); // 사용 내역

  // 사용자 포인트 조회
  const fetchUserPoints = async () => {
    try {
      // TODO: API 엔드포인트 연결
      // const response = await fetch(`${API_BASE_URL}/api/user/points`, {
      //   method: 'GET',
      //   credentials: 'include',
      // });
      // if (response.ok) {
      //   const result = await response.json();
      //   if (result.success && result.data) {
      //     setUserPoints(result.data.points || 0);
      //   }
      // }
    } catch (error) {
      console.error('포인트 조회 에러:', error);
    }
  };

  // 쿠폰 개수 조회
  const fetchCouponCount = async () => {
    try {
      // TODO: API 엔드포인트 연결
      // const response = await fetch(`${API_BASE_URL}/api/user/coupons/count`, {
      //   method: 'GET',
      //   credentials: 'include',
      // });
      // if (response.ok) {
      //   const result = await response.json();
      //   if (result.success && result.data) {
      //     setCouponCount(result.data.count || 0);
      //   }
      // }
    } catch (error) {
      console.error('쿠폰 개수 조회 에러:', error);
    }
  };

  // 구매 가능한 쿠폰 목록 조회
  const fetchPurchaseList = async () => {
    try {
      // TODO: API 엔드포인트 연결
      // const response = await fetch(`${API_BASE_URL}/api/coupons/available`, {
      //   method: 'GET',
      //   credentials: 'include',
      // });
      // if (response.ok) {
      //   const result = await response.json();
      //   if (result.success && result.data) {
      //     setPurchaseList(result.data);
      //   }
      // }
      
      // 임시 데이터
      setPurchaseList([
        { id: 1, name: '쿠폰', price: '5,000', points: 100 },
        { id: 2, name: '쿠폰', price: '5,000', points: 100 },
        { id: 3, name: '쿠폰', price: '10,000', points: 200 },
        { id: 4, name: '쿠폰', price: '10,000', points: 200 },
        { id: 5, name: '쿠폰', price: '15,000', points: 300 },
        { id: 6, name: '쿠폰', price: '15,000', points: 300 },
      ]);
    } catch (error) {
      console.error('구매 목록 조회 에러:', error);
    }
  };

  // 결제 내역 조회
  const fetchPaymentHistory = async () => {
    try {
      // TODO: API 엔드포인트 연결
      // const response = await fetch(`${API_BASE_URL}/api/user/payments`, {
      //   method: 'GET',
      //   credentials: 'include',
      // });
      // if (response.ok) {
      //   const result = await response.json();
      //   if (result.success && result.data) {
      //     setPaymentHistory(result.data);
      //   }
      // }
    } catch (error) {
      console.error('결제 내역 조회 에러:', error);
    }
  };

  // 사용 내역 조회
  const fetchUsageHistory = async () => {
    try {
      // TODO: API 엔드포인트 연결
      // const response = await fetch(`${API_BASE_URL}/api/user/coupons/usage`, {
      //   method: 'GET',
      //   credentials: 'include',
      // });
      // if (response.ok) {
      //   const result = await response.json();
      //   if (result.success && result.data) {
      //     setUsageHistory(result.data);
      //   }
      // }
    } catch (error) {
      console.error('사용 내역 조회 에러:', error);
    }
  };

  useEffect(() => {
    fetchUserPoints();
    fetchCouponCount();
    fetchPurchaseList();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      fetchPaymentHistory();
    } else if (activeTab === 2) {
      fetchUsageHistory();
    }
  }, [activeTab]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handlePurchase = async (couponId, points) => {
    if (userPoints < points) {
      alert('포인트가 부족합니다.');
      return;
    }

    try {
      alert('구매 기능은 준비 중입니다.');
    } catch (error) {
      console.error('구매 에러:', error);
      alert('구매 중 오류가 발생했습니다.');
    }
  };

  const renderContent = () => {
    if (activeTab === 0) {
      // 구매 탭
      return (
        <div className="coupon-list">
          {purchaseList.length > 0 ? (
            purchaseList.map((coupon) => (
              <div key={coupon.id} className="coupon-item">
                <div className="coupon-badge">
                  <span className="coupon-badge-text">쿠폰</span>
                </div>
                <div className="coupon-info">
                  <div className="coupon-price">{coupon.price}원</div>
                </div>
                <button
                  className="coupon-points"
                  onClick={() => handlePurchase(coupon.id, coupon.points)}
                >
                  {coupon.points} P
                </button>
              </div>
            ))
          ) : (
            <div className="no-coupons-message">
              <p>구매 가능한 쿠폰이 없습니다.</p>
            </div>
          )}
        </div>
      );
    } else if (activeTab === 1) {
      // 결제내역 탭
      return (
        <div className="coupon-list">
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment) => (
              <div key={payment.id} className="coupon-item">
                <div className="coupon-badge disabled">
                  <span className="coupon-badge-text">쿠폰</span>
                </div>
                <div className="coupon-info">
                  <div className="coupon-price">{payment.name || '쿠폰'}</div>
                  <div className="coupon-date">{payment.purchaseDate}</div>
                </div>
                <div className="coupon-points" style={{ cursor: 'default' }}>{payment.points} P</div>
              </div>
            ))
          ) : (
            <div className="no-coupons-message">
              <p>결제 내역이 없습니다.</p>
            </div>
          )}
        </div>
      );
    } else {
      // 사용내역 탭
      return (
        <div className="coupon-list">
          {usageHistory.length > 0 ? (
            usageHistory.map((usage) => (
              <div key={usage.id} className="coupon-item">
                <div className="coupon-badge disabled">
                  <span className="coupon-badge-text">쿠폰</span>
                </div>
                <div className="coupon-info">
                  <div className="coupon-price">{usage.name || '쿠폰'}</div>
                  <div className="coupon-date">{usage.usedDate}</div>
                </div>
                <div className="coupon-points" style={{ cursor: 'default' }}>사용완료</div>
              </div>
            ))
          ) : (
            <div className="no-coupons-message">
              <p>사용 내역이 없습니다.</p>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="pointshop-page">
      <div className="pointshop-wrapper">
        
        {/* 헤더 */}
        <header className="pointshop-header">
          <button className="back-btn" onClick={handleBack}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
          <h1 className="pointshop-title">포인트 상점</h1>
          <div className="header-spacer"></div>
        </header>

        {/* 상단 카드 섹션 */}
        <section className="top-cards-section">
          <div className="top-card">
            <div className="top-card-label">보유 코인</div>
            <div className="top-card-value">
              <span className="coin-amount">{userPoints}</span>
              <div className="coin-icon"></div>
            </div>
          </div>
          <div className="top-card">
            <div className="top-card-label">쿠폰함</div>
            <div className="top-card-value">
              <span className="coupon-amount">{couponCount}</span>
            </div>
          </div>
        </section>

        {/* 탭 메뉴 */}
        <section className="tabs-section">
          <div className="tabs-container">
            <button
              className={`tab-item ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => handleTabClick(0)}
            >
              구매
            </button>
            <button
              className={`tab-item ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => handleTabClick(1)}
            >
              결제내역
            </button>
            <button
              className={`tab-item ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => handleTabClick(2)}
            >
              사용내역
            </button>
            <div className={`tab-indicator tab-${activeTab}`}></div>
          </div>
        </section>

        {/* 쿠폰 리스트 섹션 */}
        <section className="coupon-list-section">
          {renderContent()}
        </section>

      </div>
    </div>
  );
}

export default MyPagePointShop;

