import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './test.css';

import backIcon from '../../../assets/back_icon.svg';
import testStartImg from '../../../assets/test_start.svg';
import q1Img from '../../../assets/test_question_img/Q1.png';
import q2Img from '../../../assets/test_question_img/Q2.png';
import q3Img from '../../../assets/test_question_img/Q3.png';
import q4Img from '../../../assets/test_question_img/Q4.png';
import q5Img from '../../../assets/test_question_img/Q5.png';
import q6Img from '../../../assets/test_question_img/Q6.png';
import q7Img from '../../../assets/test_question_img/Q7.png';

// 결과 이미지들 import
import adventureImg from '../../../assets/test_result_img/adventure.png';
import fairyImg from '../../../assets/test_result_img/fairy.png';
import hotplaceImg from '../../../assets/test_result_img/hotplace.png';
import localImg from '../../../assets/test_result_img/native.png';
import plannerImg from '../../../assets/test_result_img/plan.png';
import turtleImg from '../../../assets/test_result_img/turtle.png';
import walkerImg from '../../../assets/test_result_img/walk.png';
import galleryImg from '../../../assets/test_result_img/gallery.png';

// 결과 설명 텍스트(raw) 임포트
// 결과 설명 텍스트 하드코딩
const RESULT_TEXTS = {
  adventure: `쉬는 건 집에서!
여행은 발이 부르트도록 해야 제맛.

여행을 통해 진짜 삶의 활력을 느끼는 타입이에요.
관광지를 구경만 하는 게 아니라, 직접 부딪치고 경험하며 현지의 공기를 온몸으로 느끼는걸 좋아하죠. 시장 구석의 작은 분식집부터 지역 주민만 아는 명소까지, 로컬 감성을 탐험하듯 즐기는 여행자예요.

계획표가 빽빽하더라도 괜찮아요. 몸은 고되어도 마음은 뿌듯하니까요.
여행의 진짜 묘미는 발로 뛰는 시간에 있다고 믿는 열정 만렙 스타일입니다.`,
  fairy: `내 여행 앨범은 곧 작품집!
따스한 햇살 아래 카페 창가 자리에 앉아,
커피 한 잔과 함께 하루를 천천히 음미해요.
지도보다 발이 먼저 움직이고,
계획표보다 분위기가 더 중요하죠.

어딜 가도 카메라를 꺼내 들어 찰칵-
앨범 한 켠이 작품으로 채워져요.

빡빡한 일정 대신 여유로운 '쉼'을
여행의 주제로 삼는 당신!
아마 여행이 끝나도 그 순간의 공기와 온도를
오래도록 기억할 거예요. 🌸`,
  hotplace: `여행의 하이라이트는 사진 속 한 컷!

핫플 헌터는 어디서든 감각적이고 인기 있는 장소를 찾아내는 능력을 가진 타입이에요.
트렌디한 카페, 예쁜 포토존, 유명 전시회나 공연장 등,
SNS에서 본 핫플이라면 놓치지 않죠.

하루 일정을 꼼꼼히 계획하고, 각 장소의 감성을 완벽히 담아내는 데 집중해야 하죠.
단순한 방문이 아니라 나만의 여행 앨범을 완성해가는 과정에서 행복을 느끼는 타입이에요.
여행은 나를 표현하는 하나의 콘텐츠라고 생각하죠.`,
  local: `관광도 좋지만, 진짜는 골목길에  있다.

현지인은 빠르게 돌아보는 여행보다는, '그것에서 살아보는 듯한 여행'을 선호하는 타입이에요.
새벽 시장에서 현지 음식을 맛보고, 낯선 골목의 벽화와 사람들 속을 느긋하게 걸으며 시간을 보내는 걸 좋아하죠.
가이드북보다 주민의 추천이 더 믿음직하고, 계획보다는 감각으로 움직이죠.

그 도시의 공기를 내 속에 담는 것.
현지인은 진짜 여행의 맛을 아는 여유로운 여행자예요.`,
  planner: `여행은 준비 70%, 실행 30%.

철저 플래너는 완벽한 여행을 위해 사전에 모든 것을 세세하게 계획하는 타입이에요.

맛집 예약부터 입장 시간, 이동 동선까지 꼼곰하게 정리해야 마음이 놓이죠. 미술관, 전통 체험, 박물관처럼 실내 중심의 일정을 빽빽하게 채워 넣습니다.
즉흥적인 변화보다 예측 가능한 일정에서 안정감을 느끼는 편이에요.

여행의 즐거움은 계획한대로 완벽히 실현되는 순간에 있다고 믿는 스타일입니다.`,
  turtle: `여행도 결국은 힐링이 우선!

여행은 마라톤이 아니라, 아주 길고 달콤한 낮잠 같아야 한다고 생각하는 당신!

당신의 여행 가방 속에는 빡빡한 일정 대신 느긋함과 여유만 가득합니다.
분주하게 돌아다니기보다 숙소 근처 맛집을 탐방하고,
카페에서 책을 읽거나 음악을 들으며 천천히 시간을 보내는 걸 좋아해요.
빠르게 움직이기보단, 느린 속도로 현지의 공기와 정취를 온전히 느끼며 머무르는 걸 즐겨요.`,
  walker: `산책가 설명 텍스트가 여기에 들어갑니다.
파일을 업데이트해주세요.`,
  gallery: `내 일정은 곧 아트 전시회.

갤러리피플은 감성을 에너지로 삼는 예술형 여행자에요.
전시회, 독립서점, 카페투어, 맛집까지 하루를 알차게 채우며
새로운 영감과 감정의 자극을 찾아다닙니다.

여행을 기록의 시간으로 여겨
사진, 글, 영상 등 자신만의 방식으로 그날의 감정을 남기죠.

감각적인 취향과 디테일한 일정 구성에 강한 자신감을 가진 타입니다.`,
};

function Test() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [nickname, setNickname] = useState('사용자');
  const [resultDescription, setResultDescription] = useState('');
  const [recommendedSpots, setRecommendedSpots] = useState([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState(false);
  const [spotsError, setSpotsError] = useState('');

  // 질문 데이터
  const questions = [
    {
      id: 1,
      title: '여행지에 도착한 후 나는?',
      image: q1Img,
      options: [
        { text: '와! 액티비티 뭐 있어? 패러글라이딩/서핑부터 찾아본다', value: 'outdoor' },
        { text: '일단 조용한 카페에 들어가서 풍경부터 감상한다', value: 'indoor' }
      ]
    },
    {
      id: 2,
      title: '처음 보는 여행지 사람들에게 나는?',
      image: q2Img,
      options: [
        { text: '내가 먼저 말 걸고 금방 친구가 된다', value: 'outdoor' },
        { text: '보통 친구가 먼저 말 걸고 나는 옆에서 살포시 맞장구친다', value: 'indoor' }
      ]
    },
    {
      id: 3,
      title: '나에게 자유시간 5시간이 생겼다!',
      image: q3Img,
      options: [
        { text: '근처 호수에서 자전거를 타거나 산책하며 돌아다닌다', value: 'outdoor' },
        { text: '숙소/카페에서 편하게 쉰다', value: 'indoor' }
      ]
    },
    {
      id: 4,
      title: '하루 일정을 짤 때는 나는?',
      image: q4Img,
      options: [
        { text: '아침부터 밤까지 알차게! 스케줄 꽉 채운다', value: 'tight' },
        { text: '몇 군데만 정해두고 나머지는 여유롭게 즐긴다', value: 'relaxed' }
      ]
    },
    {
      id: 5,
      title: '여행에서 꼭 하고 싶은건?',
      image: q5Img,
      options: [
        { text: '시장에서 로컬 음식을 맛보며 현지 vibe 느끼기', value: 'local' },
        { text: '인생샷 명소를 찾아다니며 감성 충전하기', value: 'aesthetic' }
      ]
    },
    {
      id: 6,
      title: '여행 중 식사 스타일은?',
      image: q6Img,
      options: [
        { text: '로컬 맛집 탐방! 현지인들 가는 곳에서 먹어야 제맛', value: 'local' },
        { text: '분위기/인테리어 좋은 감성 카페/레스토랑 선호', value: 'aesthetic' }
      ]
    },
    {
      id: 7,
      title: '여행을 기록할 때 나는?',
      image: q7Img,
      options: [
        { text: '순간에 집중! 눈으로 보고 마음에 담는다', value: 'local' },
        { text: '사진·영상·글까지 꼼꼼히 남겨 SNS에 올린다', value: 'aesthetic' }
      ]
    }
  ];

  const resultMapping = {
    'outdoor-tight-local': { type: '모험왕', image: adventureImg, text: RESULT_TEXTS.adventure, apiType: 'ADVENTURER' },
    'indoor-relaxed-aesthetic': { type: '감성요정', image: fairyImg, text: RESULT_TEXTS.fairy, apiType: 'SENSITIVE_FAIRY' },
    'outdoor-tight-aesthetic': { type: '핫플 헌터', image: hotplaceImg, text: RESULT_TEXTS.hotplace, apiType: 'HOTSPOT_HUNTER' },
    'outdoor-relaxed-local': { type: '현지인', image: localImg, text: RESULT_TEXTS.local, apiType: 'LOCAL' },
    'indoor-tight-local': { type: '철저 플래너', image: plannerImg, text: RESULT_TEXTS.planner, apiType: 'THOROUGH_PLANNER' },
    'indoor-relaxed-local': { type: '힐링 거북이', image: turtleImg, text: RESULT_TEXTS.turtle, apiType: 'HEALING_TURTLE' },
    'outdoor-relaxed-aesthetic': { type: '산책가', image: walkerImg, text: RESULT_TEXTS.walker, apiType: 'WALKER' },
    'indoor-tight-aesthetic': { type: '갤러리피플', image: galleryImg, text: RESULT_TEXTS.gallery, apiType: 'GALLERY_PEOPLE' }
  };

  const calculateResult = (userAnswers) => {
    const outdoorCount = userAnswers.slice(0, 3).filter(a => a === 'outdoor').length;
    const category1 = outdoorCount >= 2 ? 'outdoor' : 'indoor';

    const category2 = userAnswers[3];

    const localCount = userAnswers.slice(4, 7).filter(a => a === 'local').length;
    const category3 = localCount >= 2 ? 'local' : 'aesthetic';

    const resultKey = `${category1}-${category2}-${category3}`;

    return resultMapping[resultKey];
  };

  const sendResultToBackend = async (resultType) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/travel-style`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          travelStyle: resultType
        })
      });
      
      if (!response.ok) {
        console.error('결과 전송 실패');
      }
    } catch (error) {
      console.error('결과 전송 에러:', error);
    }
  };

  // 여행스타일별 추천 관광지 조회
  const fetchRecommendedSpots = async (travelStyle) => {
    setIsLoadingSpots(true);
    setSpotsError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/travel-style/${travelStyle}/places`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('추천 관광지 호출 실패');
      }
      const result = await response.json();
      if (result && result.success && Array.isArray(result.data)) {
        setRecommendedSpots(result.data);
      } else {
        setRecommendedSpots([]);
      }
    } catch (error) {
      console.error('추천 관광지 조회 에러:', error);
      setSpotsError('추천 관광지를 불러오지 못했어요.');
      setRecommendedSpots([]);
    } finally {
      setIsLoadingSpots(false);
    }
  };

  // 사용자 프로필 조회하여 닉네임 가져오기
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.nickname) {
          setNickname(result.data.nickname);
        }
      }
    } catch (error) {
      console.error('프로필 조회 에러:', error);
    }
  };

  // 컴포넌트 마운트 시 닉네임 가져오기
  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (step === 9) {
      const result = calculateResult(answers);
      sendResultToBackend(result.apiType);
      
      // 결과 설명 텍스트는 번들 시점에 raw로 임포트된 문자열 사용
      setResultDescription(result.text || '');

      // 추천 관광지 호출
      fetchRecommendedSpots(result.apiType);
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const renderStart = () => {
    return (
      <div className="test-container">
        <button className="back-button" onClick={() => window.history.back()}>
          <img src={backIcon} alt="뒤로가기" className="back-icon" />
        </button>
        <div className="test-content">
          <h1 className="test-title">
            <span className="highlight">{nickname}님</span>의 여행 스타일을<br />
            알려주세요
          </h1>
          <p className="test-subtitle">약 2분 정도 소요돼요</p>
          <div className="test-image-container">
            <img src={testStartImg} alt="테스트 시작" className="test-start-image" />
          </div>
          <button className="test-start-button" onClick={() => setStep(1)}>
            테스트 시작
          </button>
        </div>
      </div>
    );
  };

  const renderQuestion = () => {
    const currentQuestion = questions[step - 1];
    const progress = (step / questions.length) * 100;
    
    return (
      <div className="test-container">
        <button className="back-button" onClick={() => step === 1 ? setStep(0) : setStep(step - 1)}>
          <img src={backIcon} alt="뒤로가기" className="back-icon" />
        </button>
        <div className="progress-info">
          <span className="progress-text">{step}/{questions.length}</span>
        </div>
        <div className="test-progress-bar">
          <div className="test-progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="test-content">
          <h2 className="question-title">{currentQuestion.title}</h2>
          <div className="question-image-container">
            <img src={currentQuestion.image} alt={`질문 ${step}`} className="question-image" />
          </div>
          <div className="answer-options">
            {currentQuestion.options.map((option, index) => (
              <button 
                key={index}
                className="answer-button"
                onClick={() => handleAnswer(option.value)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const result = calculateResult(answers);
    
    return (
      <div className="test-container result-scrollable">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={backIcon} alt="뒤로가기" className="back-icon" />
        </button>
        <div className="test-content">
          <h3 className="result-subtitle">성향 테스트가 끝났어요!</h3>
          <h1 className="result-title">
            <span className="highlight">{nickname}님</span>은 <span className="highlight">{result.type}</span>
          </h1>
          <div className="result-image-container">
            <img src={result.image} alt="결과 이미지" className="question-image" />
          </div>
          <div className="result-description">
            <p style={{ whiteSpace: 'pre-line' }}>{resultDescription || '결과 설명을 불러오는 중...'}</p>
          </div>

          {/* 추천 관광지 섹션 */}
          <div className="recommended-section">
            <h2 className="recommended-title">
              <span className="highlight">{result.type}</span>에게 맞는 맞춤 관광지!
            </h2>
            <div className="tourspot-scroll-container">
              {isLoadingSpots && (
                <div className="tourspot-card">
                  <div className="tourspot-placeholder">불러오는 중...</div>
                </div>
              )}
              {!isLoadingSpots && spotsError && (
                <div className="tourspot-card">
                  <div className="tourspot-placeholder">{spotsError}</div>
                </div>
              )}
              {!isLoadingSpots && !spotsError && recommendedSpots.length === 0 && (
                <div className="tourspot-card">
                  <div className="tourspot-placeholder">추천 데이터가 없어요</div>
                </div>
              )}
              {!isLoadingSpots && !spotsError && recommendedSpots.length > 0 && (
                recommendedSpots.slice(0, 3).map((spot) => (
                  <div key={spot.placeId} className="tourspot-card">
                    {spot.thumbnailUrl ? (
                      <img src={spot.thumbnailUrl} alt={spot.name} className="tourspot-image" />
                    ) : (
                      <div className="tourspot-placeholder">이미지 없음</div>
                    )}
                    <p className="tourspot-name">{spot.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 답변 처리
  const handleAnswer = (answerValue) => {
    const newAnswers = [...answers, answerValue];
    setAnswers(newAnswers);
    
    if (step === questions.length) {
      setStep(9);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="test-page">
      {step === 0 && renderStart()}
      {step >= 1 && step <= 8 && renderQuestion()}
      {step === 9 && renderResult()}
    </div>
  );
}

export default Test;
