import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './tourspots.css';

import backIcon from '../../../assets/back_icon.svg';
import scheduleIcon from '../../../assets/tourspots_icon/일정추가.svg';
import shareIcon from '../../../assets/tourspots_icon/공유.svg';
import likeIcon from '../../../assets/tourspots_icon/관심.svg';
import likedIcon from '../../../assets/tourspots_icon/is_like.svg';
import nextIcon from '../../../assets/next.svg';
import GoogleMapContainer from '../../../components/GoogleMapContainer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TourSpots = () => {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    
    const [placeData, setPlaceData] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reviewTotalCount, setReviewTotalCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reviewFilter, setReviewFilter] = useState('latest');
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    // 장소 데이터 가져오기
    const fetchPlaceData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/places/${placeId}`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error('데이터를 불러올 수 없습니다.');
            
            const result = await response.json();
            if (result.success) {
                setPlaceData(result.data);
                setIsLiked(result.data?.isLiked || false);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 주변 관광지 가져오기
    const fetchNearbyPlaces = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/places/${placeId}/nearby?count=3`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error('주변 관광지를 불러올 수 없습니다.');
            
            const result = await response.json();
            if (result.success) {
                setNearbyPlaces(result.data?.nearbyPlaces || []);
            }
        } catch (err) {
            console.error('Error fetching nearby places:', err);
        }
    };

    // 리뷰 가져오기
    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/places/${placeId}/reviews?size=3`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error('리뷰를 불러올 수 없습니다.');
            
            const result = await response.json();
            if (result.success) {
                setReviews(result.data?.content || []);
                setReviewTotalCount(result.data?.totalCount || 0);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    // 좋아요 토글
    const toggleLike = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/places/${placeId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ data: !isLiked })
            });
            
            if (response.ok) {
                setIsLiked(!isLiked);
            }
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    // 이미지 스크롤 핸들러
    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const imageWidth = e.target.offsetWidth;
        const newIndex = Math.round(scrollLeft / imageWidth);
        setCurrentImageIndex(newIndex);
    };

    // 이미지 네비게이션
    const scrollToImage = (direction) => {
        if (!scrollRef.current) return;
        const imageWidth = scrollRef.current.offsetWidth;
        const newIndex = direction === 'next' 
            ? Math.min(currentImageIndex + 1, totalImages - 1)
            : Math.max(currentImageIndex - 1, 0);
        scrollRef.current.scrollTo({
            left: newIndex * imageWidth,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        fetchPlaceData();
        fetchNearbyPlaces();
        fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placeId]);

    if (loading) {
        return <div className="tourspots-loading">로딩 중...</div>;
    }

    if (!placeData) {
        return <div className="tourspots-error">데이터를 찾을 수 없습니다.</div>;
    }

    const images = placeData.officialPhotos 
        ? placeData.officialPhotos.sort((a, b) => a.order - b.order).map(photo => photo.photoUrl)
        : [];
    const totalImages = images.length;

    return (
        <div className="tourspots-page">
            {/* 이미지 갤러리 */}
            <div className="tourspots-gallery">
                <div 
                    className="gallery-scroll-container"
                    ref={scrollRef}
                    onScroll={handleScroll}
                >
                    {images.map((image, index) => (
                        <div key={index} className="gallery-image-wrapper">
                            <img 
                                src={image} 
                                alt={`${placeData.placeName || placeData.name} ${index + 1}`}
                                className="gallery-image"
                            />
                        </div>
                    ))}
                </div>
                
                {/* 이미지 네비게이션 버튼 */}
                {totalImages > 1 && (
                    <>
                        <button 
                            className="gallery-nav-btn gallery-nav-prev"
                            onClick={() => scrollToImage('prev')}
                            disabled={currentImageIndex === 0}
                        >
                            <img src={nextIcon} alt="이전" />
                        </button>
                        <button 
                            className="gallery-nav-btn gallery-nav-next"
                            onClick={() => scrollToImage('next')}
                            disabled={currentImageIndex === totalImages - 1}
                        >
                            <img src={nextIcon} alt="다음" />
                        </button>
                    </>
                )}
                
                {/* 상단 컨트롤 */}
                <div className="gallery-controls">
                    <button className="gallery-back-btn" onClick={() => navigate(-1)}>
                        <img src={backIcon} alt="뒤로가기" />
                    </button>
                    <div className="gallery-actions">
                        <button className="icon-btn" onClick={() => alert('일정 추가')}>
                            <img src={scheduleIcon} alt="일정 추가" />
                        </button>
                        <button className="icon-btn" onClick={() => alert('공유')}>
                            <img src={shareIcon} alt="공유" />
                        </button>
                        <button className="icon-btn" onClick={toggleLike}>
                            <img src={isLiked ? likedIcon : likeIcon} alt="관심" />
                        </button>
                    </div>
                </div>
                
                {/* 이미지 카운터 */}
                {totalImages > 0 && (
                    <div className="image-counter">
                        {currentImageIndex + 1} / {totalImages}
                    </div>
                )}
            </div>

            {/* 장소 정보 */}
            <div className="tourspots-content">
                <div className="place-header">
                    <h1 className="place-name">{placeData.name}</h1>
                    <div className="place-rating">
                        <span className="rating-star">★</span>
                        <span className="rating-score">{placeData.rating || '0.0'}</span>
                    </div>
                </div>
                
                <div className="place-meta">
                    <span className="place-category">{placeData.groupName}</span>
                    <span className="meta-divider">|</span>
                    <span className="place-address">{placeData.address}</span>
                    <span className="meta-divider">|</span>
                    <span className="review-count">리뷰 {placeData.reviewCount || 0}</span>
                </div>
                
                <div className="place-tags">
                    <button className="tag-btn active">{placeData.categoryName}</button>
                </div>

                {/* 설명 */}
                <div className="place-description">
                    <h3 className="description-title">{placeData.summary}</h3>
                    <p className="description-text">
                        {placeData.information}
                    </p>
                </div>

                {/* 지도 */}
                <div className="place-map-section">
                    <div className="place-map">
                        {placeData.latitude && placeData.longitude && (
                            <GoogleMapContainer 
                                latitude={placeData.latitude} 
                                longitude={placeData.longitude} 
                                placeName={placeData.name}
                                nearbyPlaces={nearbyPlaces}
                            />
                        )}
                    </div>
                    <div className="map-buttons">
                        <button className="map-btn" onClick={() => setShowBottomSheet(!showBottomSheet)}>
                            주변 탐색
                        </button>
                    </div>
                </div>

                {/* 리뷰 섹션 */}
                <div className="reviews-section">
                    <div className="reviews-header">
                        <h2 className="section-title">
                            리뷰 <span className="review-count-badge">{placeData.totalCount}</span>
                        </h2>
                        <div className="review-filter">
                            <label className="filter-option">
                                <input 
                                    type="radio" 
                                    name="reviewFilter" 
                                    value="latest"
                                    checked={reviewFilter === 'latest'}
                                    onChange={(e) => setReviewFilter(e.target.value)}
                                />
                                <span>최신순</span>
                            </label>
                            <label className="filter-option">
                                <input 
                                    type="radio" 
                                    name="reviewFilter" 
                                    value="photo"
                                    checked={reviewFilter === 'photo'}
                                    onChange={(e) => setReviewFilter(e.target.value)}
                                />
                                <span>사진/영상 리뷰만</span>
                            </label>
                        </div>
                    </div>

                    {/* 리뷰 이미지 그리드 */}
                    {reviews.some(review => review.photos && review.photos.length > 0) && (
                        <div className="review-images-grid">
                            {reviews
                                .flatMap(review => review.photos || [])
                                .slice(0, 3)
                                .map((photo, index) => (
                                    <div key={index} className="review-image-item">
                                        <img src={photo.photoUrl} alt={`리뷰 ${index + 1}`} />
                                        {index === 2 && reviews.flatMap(r => r.photos || []).length > 3 && (
                                            <div className="more-images-overlay">
                                                + {reviews.flatMap(r => r.photos || []).length - 3}
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {/* 리뷰 리스트 */}
                    <div className="reviews-list">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.reviewId} className="review-item">
                                    <div className="review-user">
                                        <div className="user-avatar">
                                            {review.user?.profileImageUrl ? (
                                                <img src={review.user.profileImageUrl} alt={review.user.nickname} />
                                            ) : (
                                                <div className="avatar-placeholder">👤</div>
                                            )}
                                        </div>
                                        <div className="user-info">
                                            <span className="user-name">{review.user?.nickname}</span>
                                            <div className="review-rating">
                                                <span className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.photos && review.photos.length > 0 && (
                                        <div className="review-photos">
                                            {review.photos.slice(0, 3).map((photo) => (
                                                <img key={photo.order} src={photo.photoUrl} alt="리뷰 사진" />
                                            ))}
                                        </div>
                                    )}
                                    <p className="review-content">{review.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className="no-reviews">
                                <p>아직 리뷰가 없습니다.</p>
                            </div>
                        )}
                    </div>

                    {/* 더보기 버튼 */}
                    {reviewTotalCount > 3 && (
                        <button className="load-more-btn">
                            {reviewTotalCount - 3}개 리뷰 더보기
                        </button>
                    )}
                </div>
            </div>

            {/* 주변 관광지 버텀시트 */}
            {showBottomSheet && (
                <div className="bottom-sheet-overlay" onClick={() => setShowBottomSheet(false)}>
                    <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="bottom-sheet-handle"></div>
                        <h3 className="bottom-sheet-title">이 근처의 가볼만한 곳</h3>
                        <div className="nearby-places-list">
                            {nearbyPlaces.length > 0 ? (
                                nearbyPlaces.map((place) => (
                                    <div 
                                        key={place.placeId} 
                                        className="nearby-place-item"
                                        onClick={() => navigate(`/places/tourspots/${place.placeId}`)}
                                    >
                                        <img 
                                            src={place.thumbnailUrl || 'https://via.placeholder.com/80'} 
                                            alt={place.name}
                                            className="nearby-place-image"
                                        />
                                        <div className="nearby-place-info">
                                            <h4 className="nearby-place-name">{place.name}</h4>
                                            <p className="nearby-place-distance">
                                                {placeData.name}에서 {place.distance}
                                            </p>
                                            <span className="nearby-place-category">{place.categoryName}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-nearby-places">주변 관광지가 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourSpots;
