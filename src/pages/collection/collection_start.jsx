import { useNavigate } from 'react-router-dom';
import './collection_start.css';

import backIcon from '../../assets/back_icon.svg';
import sandriCollect from '../../assets/sandri_collect.svg';
import badge from '../../assets/badge.svg';

function CollectionStart() {
  const navigate = useNavigate();

  return (
    <div className="collection-page">
      <div className="collection-wrapper">
        
        {/* 헤더 */}
        <header className="collection-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
          <div className="header-spacer"></div>
        </header>

        {/* 캐릭터 섹션 */}
        <section className="character-section">
          <div className="character-image-container">
            <img src={sandriCollect} alt="산드리 캐릭터" className="character-image" />
          </div>
          
          <div className="character-info">
            <div className="character-level">Lv 2</div>
            <h1 className="character-name">신냐</h1>
            <p className="character-description">
              호기심이 많고 낙천적이에요.{'\n'}
              작지만 책임감 있는 조력자로, 누군가를 돕는 것을 좋아해요.{'\n'}
              말은 없지만 표정과 움직임으로 감정을 전하는 스타일이에요.
            </p>
          </div>
        </section>

        {/* 통계 섹션 */}
        <section className="stats-section">
          <div className="stat-item">
            <h3 className="stat-label">함께 방문한 곳</h3>
            <div className="stat-value">2곳</div>
          </div>
          <div className="stat-item">
            <div className="badge-with-label">
              <img src={badge} alt="배지" className="badge-icon" />
              <h3 className="stat-label">배지</h3>
            </div>
            <div className="stat-value">3개</div>
          </div>
        </section>

        {/* 버튼 섹션 */}
        <section className="button-section">
          <button className="new-test-btn">
            새로운 테스트
          </button>
          <button className="start-collection-btn">
            육성 하기
          </button>
        </section>

      </div>
    </div>
  );
}

export default CollectionStart;
