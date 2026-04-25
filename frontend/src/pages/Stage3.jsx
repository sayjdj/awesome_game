import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const CAPTCHA_IMAGES = [
    { id: 1, type: 'traffic_light', url: 'https://images.unsplash.com/photo-1550041276-2e8601d36d81?w=300&h=300&fit=crop' },
    { id: 2, type: 'crosswalk', url: 'https://images.unsplash.com/photo-1544414603-7b7da0344d32?w=300&h=300&fit=crop' },
    { id: 3, type: 'bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=300&fit=crop' },
    { id: 4, type: 'bus', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=300&fit=crop' },
    { id: 5, type: 'fire_hydrant', url: 'https://images.unsplash.com/photo-1594917415160-c1143c1ee558?w=300&h=300&fit=crop' },
    { id: 6, type: 'stairs', url: 'https://images.unsplash.com/photo-1510425463958-dcced28da480?w=300&h=300&fit=crop' },
    { id: 7, type: 'chimney', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop' },
    { id: 8, type: 'motorcycle', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&h=300&fit=crop' },
    { id: 9, type: 'bridge', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=300&fit=crop' }
];

export default function Stage3() {
    const navigate = useNavigate();
    const { recordFail, rageLevel } = useStore();
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [targetType, setTargetType] = useState('traffic_light');

    const targetTypes = ['traffic_light', 'crosswalk', 'bicycle', 'bus', 'fire_hydrant'];
    const targetLabels = {
        'traffic_light': '신호등',
        'crosswalk': '횡단보도',
        'bicycle': '자전거',
        'bus': '버스',
        'fire_hydrant': '소화전'
    };

    useEffect(() => {
        randomizeTarget();
    }, []);

    const randomizeTarget = () => {
        const randomType = targetTypes[Math.floor(Math.random() * targetTypes.length)];
        setTargetType(randomType);
        setSelectedImages([]);
    };

    const toggleImage = (id) => {
        if (selectedImages.includes(id)) {
            setSelectedImages(selectedImages.filter(imgId => imgId !== id));
        } else {
            setSelectedImages([...selectedImages, id]);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setMessage('');

        try {
            // 백엔드의 가스라이팅 캡챠 API 호출
            const response = await fetch('http://localhost:3000/api/captcha/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedImageIds: selectedImages,
                    targetType
                })
            });

            const data = await response.json();

            if (data.success) {
                // 성공하면 4단계로
                navigate('/stage4');
            } else {
                // 백엔드에서 30% 확률로 억지 실패를 줌 (또는 진짜 틀렸거나)
                recordFail('stage3');
                setMessage(data.message || '틀렸습니다. 다시 시도하세요.');
                setTimeout(() => {
                    randomizeTarget();
                    setMessage('');
                }, 2000);
            }
        } catch (error) {
            console.error('Verify error:', error);
            setMessage('네트워크 오류입니다. 당신의 핑계는 통하지 않습니다.');
            recordFail('stage3');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            width: '100vw', minHeight: '100vh', background: '#f5f6fa',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ position: 'absolute', top: 20, left: 20, color: '#e74c3c', fontWeight: 'bold' }}>
                분노 지수: {rageLevel}%
            </div>

            <div style={{
                background: 'white', padding: '20px', borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px'
            }}>
                <div style={{ background: '#4a90e2', color: 'white', padding: '15px', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'normal' }}>
                        다음 이미지가 포함된 모든 타일을 선택하세요:
                    </h2>
                    <h1 style={{ margin: '10px 0 0 0', fontSize: '28px' }}>
                        {targetLabels[targetType]}
                    </h1>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', marginBottom: '20px'
                }}>
                    {CAPTCHA_IMAGES.map((img) => (
                        <div
                            key={img.id}
                            onClick={() => toggleImage(img.id)}
                            style={{
                                width: '100%', aspectRatio: '1/1', cursor: 'pointer',
                                border: selectedImages.includes(img.id) ? '4px solid #4a90e2' : 'none',
                                boxSizing: 'border-box',
                                backgroundImage: `url(${img.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transition: 'all 0.2s',
                                transform: selectedImages.includes(img.id) ? 'scale(0.95)' : 'scale(1)'
                            }}
                        />
                    ))}
                </div>

                {message && (
                    <div style={{ color: '#e74c3c', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        style={{
                            background: '#4a90e2', color: 'white', border: 'none', padding: '10px 24px',
                            borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '16px', fontWeight: 'bold'
                        }}
                    >
                        {loading ? '검증 중...' : '확인'}
                    </button>
                </div>
            </div>
        </div>
    );
}
