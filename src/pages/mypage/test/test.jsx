import { useState, useEffect } from 'react';
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

function Test() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [nickname] = useState('사용자'); // 나중에 실제 닉네임으로 교체
  const [resultDescription, setResultDescription] = useState('');

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
    'outdoor-tight-local': { type: '모험왕', image: adventureImg, file: '../../../public/adventure.txt' },
    'indoor-relaxed-aesthetic': { type: '감성요정', image: fairyImg, file: '../../../public/fairy.txt' },
    'outdoor-tight-aesthetic': { type: '핫플 헌터', image: hotplaceImg, file: '../../../public/hotplace.txt' },
    'outdoor-relaxed-local': { type: '현지인', image: localImg, file: '../../../public/local.txt' },
    'indoor-tight-local': { type: '철저 플래너', image: plannerImg, file: '../../../public/planner.txt' },
    'indoor-relaxed-local': { type: '힐링 거북이', image: turtleImg, file: '../../../public/turtle.txt' },
    'outdoor-relaxed-aesthetic': { type: '산책가', image: walkerImg, file: '../../../public/walker.txt' },
    'indoor-tight-aesthetic': { type: '갤러리피플', image: galleryImg, file: '../../../public/gallery.txt' }
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

  const sendResultToBackend = async (resultType, userAnswers) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/travel-style`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: nickname,
          resultType: resultType,
          answers: userAnswers,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        console.error('결과 전송 실패');
      }
    } catch (error) {
      console.error('결과 전송 에러:', error);
    }
  };

  useEffect(() => {
    if (step === 9) {
      const result = calculateResult(answers);
      sendResultToBackend(result.type, answers);
      
      // 결과 설명 텍스트 로드
      fetch(`/${result.file}`)
        .then(response => response.text())
        .then(text => setResultDescription(text))
        .catch(error => {
          console.error('결과 설명 로드 실패:', error);
          setResultDescription('결과 설명을 불러올 수 없습니다.');
        });
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
    
    const tourSpots = [
      { id: 1, name: 'tourspot1' },
      { id: 2, name: 'tourspot2' },
      { id: 3, name: 'tourspot3' },
      { id: 4, name: 'tourspot4' },
    ];
    
    return (
      <div className="test-container result-scrollable">
        <button className="back-button" onClick={() => setStep(0)}>
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
              {tourSpots.map(spot => (
                <div key={spot.id} className="tourspot-card">
                  <div className="tourspot-placeholder">
                    이미지 준비중
                  </div>
                  <p className="tourspot-name">{spot.name}</p>
                </div>
              ))}
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
