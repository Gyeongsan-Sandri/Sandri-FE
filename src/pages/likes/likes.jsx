import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './likes.css';
import likedIcon from '../../assets/tourspots_icon/is_like.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Likes = () => {
    const navigate = useNavigate();
    const [likedPlaces, setLikedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLikedPlaces();
    }, []);

    // 관심 장소 목록 가져오기
    const fetchLikedPlaces = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/favorites`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('관심 장소를 불러올 수 없습니다.');

            const result = await response.json();
            if (result.success) {
                const data = result.data || {};
                // places, routes, magazines를 하나의 배열로 합치기
                const allItems = [
                    ...(data.places || []).map(item => ({ ...item, itemType: 'place' })),
                    ...(data.routes || []).map(item => ({ ...item, itemType: 'route' })),
                    ...(data.magazines || []).map(item => ({ ...item, itemType: 'magazine' }))
                ];
                setLikedPlaces(allItems);
            }
        } catch (err) {
            console.error('Error fetching liked places:', err);
        } finally {
            setLoading(false);
        }
    };

    // 좋아요 토글
    const toggleLike = async (item, currentLikeStatus) => {
        try {
            // itemType으로 type 결정
            const type = item.itemType || 'place';
            let targetId = item.placeId || item.routeId || item.magazineId;

            const response = await fetch(`${API_BASE_URL}/api/favorites/${type}/${targetId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ data: !currentLikeStatus })
            });

            if (response.ok) {
                // 좋아요 해제 시 목록에서 제거
                setLikedPlaces(prevPlaces => 
                    prevPlaces.filter(place => {
                        if (type === 'place') return place.placeId !== targetId;
                        if (type === 'route') return place.routeId !== targetId;
                        if (type === 'magazine') return place.magazineId !== targetId;
                        return true;
                    })
                );
            }
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    // 장소 카드 클릭
    const handleItemClick = (item) => {
        const itemType = item.itemType || 'place';
        const id = item.placeId || item.routeId || item.magazineId;
        
        if (itemType === 'place') {
            navigate(`/places/${id}`);
        } else if (itemType === 'route') {
            navigate(`/routes/${id}`);
        } else if (itemType === 'magazine') {
            navigate(`/magazines/${id}`);
        }
    };

    // 고유 키 생성
    const getItemKey = (item) => {
        const itemType = item.itemType || 'place';
        const id = item.placeId || item.routeId || item.magazineId;
        return `${itemType}-${id}`;
    };

    // 이미지 URL 가져오기
    const getImageUrl = (item) => {
        if (item.thumbnailUrl) return item.thumbnailUrl;
        if (item.photos?.[0]?.photoUrl) return item.photos[0].photoUrl;
        if (item.imageUrl) return item.imageUrl;
        return 'https://via.placeholder.com/300';
    };

    // 카테고리 이름 가져오기
    const getCategoryName = (item) => {
        if (item.categoryName) return item.categoryName;
        if (item.category) return item.category;
        if (item.type) return item.type;
        return item.itemType === 'place' ? '장소' : item.itemType === 'route' ? '루트' : '매거진';
    };

    if (loading) {
        return (
            <div className="likes-container">
                <div className="likes-loading">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="likes-container">
            <div className="likes-wrapper">
                <header className="likes-header">
                    <h1>관심 장소</h1>
                </header>

                {likedPlaces.length > 0 ? (
                    <div className="likes-grid">
                        {likedPlaces.map((item) => (
                            <div key={getItemKey(item)} className="like-card">
                                <div 
                                    className="like-card-image"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <img 
                                        src={getImageUrl(item)} 
                                        alt={item.name || item.title || '이미지'} 
                                    />
                                    <button 
                                        className="like-heart-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(item, true);
                                        }}
                                    >
                                        <img src={likedIcon} alt="관심" />
                                    </button>
                                </div>
                                <div 
                                    className="like-card-info"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <h3 className="like-card-name">{item.name || item.title || '제목 없음'}</h3>
                                    <span className="like-card-category">{getCategoryName(item)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="likes-empty">
                        <p>아직 관심 장소가 없습니다.</p>
                        <p className="empty-subtitle">마음에 드는 장소를 찾아보세요!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Likes;
