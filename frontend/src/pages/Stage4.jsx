import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Stage4() {
    const navigate = useNavigate();
    const { rageLevel, recordFail } = useStore();
    const [progress, setProgress] = useState(0);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [moneySpent, setMoneySpent] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval;
        if (!isFinished) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    // 속도가 점근적으로 느려짐 (제논의 역설)
                    // 남은 거리의 1/100 * 배율만큼 이동
                    const remaining = 100 - prev;
                    const increment = (remaining * 0.005) * speedMultiplier;

                    let newProgress = prev + increment;

                    if (newProgress >= 99.9) {
                        setIsFinished(true);
                        setTimeout(() => navigate('/ending'), 1000);
                        return 100;
                    }
                    return newProgress;
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [speedMultiplier, isFinished, navigate]);

    const handlePay = (amount, multiplier) => {
        setMoneySpent(prev => prev + amount);
        setSpeedMultiplier(prev => prev + multiplier);
    };

    const handleRageQuit = () => {
        recordFail('stage4');
        alert("이깟 로딩창 하나 못 기다리시나요? 처음부터 다시 하세요.");
        navigate('/stage1');
    };

    return (
        <div style={{
            width: '100vw', minHeight: '100vh', background: '#111', color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px', boxSizing: 'border-box'
        }}>
            <h1 style={{ color: '#f39c12', marginBottom: '10px' }}>Stage 4: 자본주의 로딩창</h1>
            <p style={{ color: '#aaa', marginBottom: '40px' }}>
                서버로 데이터를 전송하고 있습니다. <br/>
                현재 분노 지수: {rageLevel}% | 결제한 금액: {moneySpent.toLocaleString()}원
            </p>

            <div style={{ width: '80%', maxWidth: '600px', background: '#333', height: '30px', borderRadius: '15px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                    width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f39c12, #f1c40f)',
                    transition: 'width 0.1s linear'
                }} />
                <span style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    color: '#fff', fontWeight: 'bold', textShadow: '1px 1px 2px #000'
                }}>
                    {progress.toFixed(4)}%
                </span>
            </div>

            <p style={{ marginTop: '20px', color: '#e74c3c' }}>
                {progress > 90 ? "거의 다 왔습니다! 하지만 남은 거리는 영원히 절반씩 줄어듭니다..." : "로딩 속도가 너무 느린가요?"}
            </p>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => handlePay(1000, 0.5)}
                    style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
                >
                    ₩1,000 결제 (속도 0.5x 증가)
                </button>
                <button
                    onClick={() => handlePay(5000, 3)}
                    style={{ background: '#2980b9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
                >
                    ₩5,000 결제 (속도 3x 증가)
                </button>
                <button
                    onClick={() => handlePay(50000, 50)}
                    style={{ background: '#8e44ad', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                >
                    ₩50,000 프리미엄 패스 (속도 50x 증가)
                </button>
            </div>

            <button
                onClick={handleRageQuit}
                style={{ marginTop: '50px', background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}
            >
                더 이상 못 참겠다 (처음으로 돌아가기)
            </button>
        </div>
    );
}
