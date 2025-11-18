import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../../components/common';
import LikeHeart from '../../../components/LikeHeart/LikeHeart.jsx';
import './magazine_list.css';
import official1 from '../../../assets/official/공식광고1.svg';
import official2 from '../../../assets/official/공식광고2.svg';
import official3 from '../../../assets/official/공식광고3.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MagazineList = () => {
  const navigate = useNavigate();
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [officialIndex, setOfficialIndex] = useState(0);
  const officialAds = [official1, official2, official3];

  useEffect(() => {
    const timer = setInterval(() => {
      setOfficialIndex((prev) => (prev + 1) % officialAds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [officialAds.length]);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/magazines?size=30`, { method: 'GET', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setMagazines(data.data?.magazines || []);
        }
      } catch (e) {
        console.error('매거진 로드 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const toggleLike = async (e, magazineId, isLiked) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_BASE_URL}/api/magazines/${magazineId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ data: !isLiked })
      });
      if (response.ok) {
        setMagazines((prev) => prev.map(m => m.magazineId === magazineId ? { ...m, isLiked: !isLiked } : m));
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const openDetail = (mag) => navigate(`/magazine/${mag.magazineId}`);

  if (loading) return <div className="maglist-container"><div className="maglist-loading">로딩 중...</div></div>;

  return (
    <div className="maglist-container">
      <header className="maglist-header">
        <BackButton onClick={() => navigate(-1)} />
        <h1>여행 매거진</h1>
      </header>

      {/* 공식 광고 */}
      <section className="maglist-ad">
        <div className="official-ad-carousel">
          <div className="official-ad-track" style={{ transform: `translateX(-${officialIndex * 304}px)` }}>
            {officialAds.map((src, i) => (
              <div key={i} className="official-ad-slide"><img src={src} alt={`공식 광고 ${i+1}`} /></div>
            ))}
          </div>
          <div className="official-ad-indicator">{officialIndex + 1} / {officialAds.length}</div>
        </div>
      </section>

      {/* 매거진 2열 그리드 */}
      {magazines.length > 0 ? (
        <section className="maglist-grid">
          {magazines.map((mag) => (
            <article key={mag.magazineId} className="maglist-card" onClick={() => openDetail(mag)}>
              <div className="maglist-image">
                <img src={mag.thumbnail} alt={mag.title} />
                <LikeHeart
                  isLiked={mag.isLiked}
                  onToggle={(e) => toggleLike(e, mag.magazineId, mag.isLiked)}
                  className="maglist-heart overlay"
                  size={22}
                  containerSize={36}
                />
                <div className="maglist-overlay">
                  <p className="maglist-summary">{mag.summary}</p>
                  <h3 className="maglist-title">{mag.title}</h3>
                </div>
              </div>
              {mag.tags?.length > 0 && (
                <div className="maglist-tags">
                  {mag.tags.map(t => <span key={t.tagId} className="maglist-tag">#{t.name}</span>)}
                </div>
              )}
            </article>
          ))}
        </section>
      ) : (
        <div className="maglist-empty">등록된 매거진이 없습니다.</div>
      )}
    </div>
  );
};

export default MagazineList;
