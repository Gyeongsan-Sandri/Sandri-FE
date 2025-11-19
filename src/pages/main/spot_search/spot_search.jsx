import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './spot_search.css';
import { BackButton } from '../../../components/common';
import searchIcon from '../../../assets/search.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SpotSearch = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [hasNext, setHasNext] = useState(false);

  // 최근 검색어 조회
  const fetchRecentSearches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/me/recent-searches`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setRecentSearches(data.data);
        }
      }
    } catch (error) {
      console.error('최근 검색어 조회 실패:', error);
    }
  };

  // 인기 검색어 조회
  const fetchPopularSearches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/popular-searches`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPopularSearches(data.data);
        }
      }
    } catch (error) {
      console.error('인기 검색어 조회 실패:', error);
    }
  };

  // 카테고리 목록 조회
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data);
        }
      }
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchRecentSearches(),
        fetchPopularSearches(),
        fetchCategories()
      ]);
    };
    loadData();
  }, []);

  // 최근 검색어 추가
  const addRecentSearch = async (keyword) => {
    try {
      await fetch(`${API_BASE_URL}/api/me/recent-searches`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyword: keyword,
          searchType: 'PLACE'
        })
      });
    } catch (error) {
      console.error('최근 검색어 추가 실패:', error);
    }
  };

  // 최근 검색어 삭제
  const deleteRecentSearch = async (searchId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/me/recent-searches/${searchId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchRecentSearches();
      }
    } catch (error) {
      console.error('최근 검색어 삭제 실패:', error);
    }
  };

  // 모든 최근 검색어 삭제
  const deleteAllRecentSearches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/me/recent-searches/all`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setRecentSearches([]);
      }
    } catch (error) {
      console.error('모든 최근 검색어 삭제 실패:', error);
    }
  };

  // 검색 실행
  const handleSearch = async (keyword = searchKeyword, mode = 'reset') => {
    if (!keyword.trim()) return;

    setIsSearching(true);
    try {
      // 새 검색 시작 시 최근 검색어에 추가
      if (mode === 'reset') {
        await addRecentSearch(keyword);
      }

      // 장소 검색 (페이지/사이즈 포함)
      const nextPage = mode === 'reset' ? 1 : page;
      const params = new URLSearchParams();
      params.append('keyword', keyword);
      if (selectedFilters.length > 0) {
        selectedFilters.forEach(filter => params.append('category', filter));
      }
      params.append('page', String(nextPage));
      params.append('size', String(size));

      const response = await fetch(`${API_BASE_URL}/api/places/search?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const list = data.data.places || [];
          setSearchResults(prev => (mode === 'reset' ? list : [...prev, ...list]));
          setHasSearched(true);
          setHasNext(Boolean(data.data.hasNext));
          setPage(nextPage + 1);
          if (mode === 'reset') {
            await fetchRecentSearches();
          }
        }
      }
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 입력
  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 엔터 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (keyword) => {
    setSearchKeyword(keyword);
    setPage(1);
    handleSearch(keyword, 'reset');
  };

  // 인기 검색어 클릭
  const handlePopularSearchClick = (keyword) => {
    setSearchKeyword(keyword);
    setPage(1);
    handleSearch(keyword, 'reset');
  };

  // 필터 제거
  const removeFilter = (filter) => {
    setSelectedFilters(prev => prev.filter(f => f !== filter));
  };

  // 모든 필터 제거
  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="spot-search-container">
      {/* 헤더 */}
      <header className="search-header">
        <BackButton onClick={handleBack} />
        <h1>검색</h1>
      </header>

      {/* 검색창 */}
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="관광지를 검색해 보세요"
          value={searchKeyword}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button className="search-btn" onClick={() => handleSearch()}>
          <img src={searchIcon} alt="검색" />
        </button>
      </div>

      {/* 검색 결과 */}
      {hasSearched && (
        <div className="search-results-section">
          <div className="section-header">
            <h2>검색 결과</h2>
            <button className="clear-search-btn" onClick={() => {
              setHasSearched(false);
              setSearchResults([]);
              setSearchKeyword('');
              setPage(1);
              setHasNext(false);
            }}>
              ×
            </button>
          </div>
          
          {isSearching && searchResults.length === 0 ? (
            <div className="search-loading">검색 중...</div>
          ) : searchResults.length > 0 ? (
            <div className="search-results-grid">
              {searchResults.map((place) => (
                <div 
                  key={place.placeId} 
                  className="search-result-card"
                  onClick={() => navigate(`/places/${place.placeId}`)}
                >
                  <div className="result-image">
                    <img 
                      src={place.thumbnailUrl || 'https://placehold.co/300x200'} 
                      alt={place.name} 
                    />
                  </div>
                  <div className="result-info">
                    <h3>{place.name}</h3>
                    <p className="result-address">{place.address}</p>
                    {place.categoryName && (
                      <span className="result-category">#{place.categoryName}</span>
                    )}
                  </div>
                </div>
              ))}
              {hasNext && (
                <div className="load-more-container" style={{ marginTop: '8px' }}>
                  <button 
                    className="load-more-btn" 
                    onClick={() => handleSearch(searchKeyword, 'append')} 
                    disabled={isSearching}
                  >
                    {isSearching ? '로딩 중...' : '더보기'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-message">검색 결과가 없습니다.</div>
          )}
        </div>
      )}

      {/* 검색 전 화면 */}
      {!hasSearched && (
        <>
      {/* 최근 검색어 */}
      {selectedFilters.length > 0 && (
        <div className="filters-section">
          <div className="section-header">
            <h2>최근 검색어</h2>
            <button className="clear-all-btn" onClick={clearAllFilters}>
              전체 삭제
            </button>
          </div>
          <div className="filter-chips">
            {selectedFilters.map((filter, index) => (
              <div key={index} className="filter-chip">
                <span>{filter}</span>
                <button onClick={() => removeFilter(filter)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 최근 검색어 */}
      <div className="recent-searches-section">
        <div className="section-header">
          <h2>최근 검색어</h2>
          <button className="clear-all-btn" onClick={deleteAllRecentSearches}>
            전체 삭제
          </button>
        </div>
        {recentSearches.length > 0 ? (
          <div className="recent-chip-list">
            {recentSearches.map((search, index) => (
              <div
                key={search.id || `${search.keyword}-${index}`}
                className="recent-chip"
                onClick={() => handleRecentSearchClick(search.keyword)}
              >
                <span className="recent-chip-text">{search.keyword}</span>
                <button
                  className="recent-chip-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (search.id) {
                      deleteRecentSearch(search.id);
                    } else {
                      // fallback: 로컬에서 제거
                      setRecentSearches((prev) => prev.filter((s, i) => i !== index));
                    }
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">최근 검색어가 없습니다.</p>
        )}
      </div>

      {/* 인기 검색어 */}
      <div className="popular-searches-section">
        <div className="section-header">
          <h2>인기 검색어</h2>
        </div>
        {popularSearches.length > 0 ? (
          <ul className="search-list">
            {popularSearches.map((search, index) => (
              <li key={search.id || index} className="search-item">
                <div className="search-item-content" onClick={() => handlePopularSearchClick(search.keyword)}>
                  <span className="search-rank">{index + 1}</span>
                  <span className="search-keyword">{search.keyword}</span>
                </div>
                <span className={`trend-icon ${search.trend || 'up'}`}>
                  {search.trend === 'up' ? '▲' : search.trend === 'down' ? '▼' : '-'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">인기 검색어가 없습니다.</p>
        )}
      </div>

      {/* 추천 카테고리 */}
      <div className="categories-section">
        <h2>추천 카테고리</h2>
        <div className="category-grid">
          {categories.slice(0, 4).map((category, index) => (
            <button
              key={category.id || index}
              className="category-btn"
              onClick={() => navigate('/spot/categories', { state: { category: category.name } })}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default SpotSearch;
