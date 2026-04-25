import React from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function Ending() {
    const { rageLevel, failCounts, resetStore } = useStore();
    const navigate = useNavigate();

    const handleRestart = () => {
        resetStore();
        navigate('/stage1');
    };

    return (
        <div style={{
            width: '100vw', minHeight: '100vh', background: '#000', color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px', boxSizing: 'border-box', textAlign: 'center'
        }}>
            <h1 style={{ color: '#2ecc71', fontSize: '3rem', marginBottom: '10px' }}>축하합니다!</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '40px' }}>
                당신은 마침내 '궁극의 UX 지옥'을 돌파했습니다.
            </p>

            <div style={{ background: '#222', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '500px', marginBottom: '40px' }}>
                <h2 style={{ color: '#e74c3c', margin: '0 0 20px 0' }}>최종 성적표</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem' }}>
                    <span>최종 분노 지수:</span>
                    <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>{rageLevel}%</span>
                </div>

                <hr style={{ borderColor: '#444', margin: '15px 0' }} />

                <h3 style={{ fontSize: '1rem', color: '#aaa', margin: '0 0 15px 0', textAlign: 'left' }}>구간별 실패 횟수</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Stage 1 (최악의 회원가입):</span>
                    <span>{failCounts.stage1 || 0}회</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Stage 2 (플래피 커서):</span>
                    <span>{failCounts.stage2 || 0}회</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Stage 3 (가스라이팅 캡챠):</span>
                    <span>{failCounts.stage3 || 0}회</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Stage 4 (자본주의 로딩창):</span>
                    <span>{failCounts.stage4 || 0}회</span>
                </div>
            </div>

            <button
                onClick={handleRestart}
                style={{
                    background: '#fff', color: '#000', border: 'none', padding: '15px 30px',
                    borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
                    transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
                다시 고통받기
            </button>
        </div>
    );
}
