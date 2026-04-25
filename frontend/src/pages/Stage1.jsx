import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import './Stage1.css';

export default function Stage1() {
    const navigate = useNavigate();
    const { recordFail, rageLevel } = useStore();
    const [phoneNum, setPhoneNum] = useState(0);
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const btnRef = useRef(null);

    // 극악무도한 폰번호 슬라이더
    const handleSliderChange = (e) => setPhoneNum(e.target.value);

    // 프라임 넘버 체크
    const isPrime = (num) => {
        for(let i = 2, s = Math.sqrt(num); i <= s; i++)
            if(num % i === 0) return false;
        return num > 1;
    }

    const validateForm = () => {
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const today = days[new Date().getDay()];

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password)) {
            return "대소문자, 숫자, 특수문자가 필요합니다.";
        }
        if (!password.includes(today)) {
            return `오늘의 요일(${today})이 포함되어야 합니다.`;
        }

        const hasPrime = [2, 3, 5, 7].some(p => password.includes(p.toString()));
        if (!hasPrime) {
            return "1부터 10 사이의 소수(Prime)가 포함되어야 합니다.";
        }
        return "pass";
    };

    const handleNextClick = () => {
        const validation = validateForm();
        if (validation !== "pass") {
            setErrorMsg(validation);
            recordFail('stage1');
        } else {
            navigate('/stage2');
        }
    };

    // 도망가는 버튼 로직
    const evadeMouse = (e) => {
        const btn = btnRef.current;
        if(!btn) return;
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        btn.style.position = 'absolute';
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
    };

    return (
        <div className="stage-container">
            <h2>Stage 1: 최악의 회원가입</h2>
            <div className="rage-meter">현재 분노 지수: {rageLevel}%</div>

            <div className="form-group">
                <label>전화번호 (정확히 맞추세요): 010-{String(phoneNum).padStart(8, '0')}</label>
                <input
                    type="range"
                    min="0"
                    max="99999999"
                    value={phoneNum}
                    onChange={handleSliderChange}
                    className="annoying-slider"
                />
            </div>

            <div className="form-group">
                <label>비밀번호</label>
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="대/소문자, 특수문자, 오늘의 요일, 10이하 소수 포함"
                />
            </div>

            {errorMsg && <p className="error">{errorMsg}</p>}

            <button
                ref={btnRef}
                className="evasive-btn"
                onMouseEnter={evadeMouse}
                onTouchStart={evadeMouse}
                onClick={handleNextClick}
            >
                다음 단계로
            </button>
        </div>
    );
}
