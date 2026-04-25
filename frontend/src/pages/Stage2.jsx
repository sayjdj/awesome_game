import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MousePointer2 } from 'lucide-react';

export default function Stage2() {
    const navigate = useNavigate();
    const { recordFail, rageLevel } = useStore();

    const [targetBox, setTargetBox] = useState({ x: 0, y: 0, size: 40 });
    const requestRef = useRef();
    const realMouseX = useRef(window.innerWidth / 2);

    const cursorY = useRef(window.innerHeight / 2);
    const velocity = useRef(0);
    const gravity = 0.35;
    const jumpStrength = -7;

    const [renderY, setRenderY] = useState(cursorY.current);
    const [renderX, setRenderX] = useState(realMouseX.current);

    useEffect(() => {
        // 초기 타겟 위치 설정 (우측 랜덤한 높이)
        setTargetBox({
            x: window.innerWidth - 150,
            y: window.innerHeight / 2,
            size: 40
        });

        const handleMouseMove = (e) => {
            realMouseX.current = e.clientX;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // 실제 마우스 숨기기
        document.body.style.cursor = 'none';

        const updatePhysics = () => {
            velocity.current += gravity;
            cursorY.current += velocity.current;

            // 바닥이나 천장에 닿으면 사망 처리 (실패 로그 남김)
            if (cursorY.current > window.innerHeight || cursorY.current < 0) {
                recordFail('stage2');
                cursorY.current = window.innerHeight / 2;
                velocity.current = 0;
            }

            setRenderY(cursorY.current);
            setRenderX(realMouseX.current);

            requestRef.current = requestAnimationFrame(updatePhysics);
        };
        requestRef.current = requestAnimationFrame(updatePhysics);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(requestRef.current);
            document.body.style.cursor = 'default';
        };
    }, []);

    const handleGlobalClick = () => {
        // 점프
        velocity.current = jumpStrength;

        // 클릭 시 가짜 커서가 타겟 영역에 있는지 확인 (여유 범위 조금 줌)
        const fakeX = realMouseX.current;
        const fakeY = cursorY.current;

        // 마우스 아이콘의 대략적인 핫스팟 (좌상단)을 고려
        if (
            fakeX >= targetBox.x - 10 && fakeX <= targetBox.x + targetBox.size + 10 &&
            fakeY >= targetBox.y - 10 && fakeY <= targetBox.y + targetBox.size + 10
        ) {
            document.body.style.cursor = 'default';
            navigate('/stage3');
        }
    };

    return (
        <div
            style={{ width: '100vw', height: '100vh', background: '#2c3e50', overflow: 'hidden', position: 'relative' }}
            onClick={handleGlobalClick}
        >
            <h2 style={{ position: 'absolute', top: 20, left: 20, userSelect: 'none', color: '#ecf0f1' }}>Stage 2: Flappy Cursor</h2>
            <div style={{ position: 'absolute', top: 60, left: 20, color: '#e74c3c', fontWeight: 'bold', userSelect: 'none' }}>
                분노 지수: {rageLevel}%<br/>
                마우스로 좌우를 움직이고 클릭으로 점프하여 가짜 커서를 '통과' 버튼 위에서 클릭하세요!<br/>
                (진짜 커서는 숨겨져 있고, y축은 중력의 영향을 받습니다)
            </div>

            {/* 가짜 커서 */}
            <div style={{
                position: 'absolute',
                left: renderX,
                top: renderY,
                pointerEvents: 'none',
                transform: `rotate(${velocity.current * 3}deg)`,
                zIndex: 999
            }}>
                <MousePointer2 size={32} color="#ecf0f1" fill="#34495e" />
            </div>

            {/* 타겟 버튼 */}
            <div
                style={{
                    position: 'absolute',
                    left: targetBox.x,
                    top: targetBox.y,
                    width: targetBox.size,
                    height: targetBox.size,
                    background: '#e74c3c',
                    border: '2px solid #c0392b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'white',
                    userSelect: 'none',
                    pointerEvents: 'none' // 클릭 이벤트는 부모에서 처리
                }}
            >
                통과
            </div>
        </div>
    );
}
