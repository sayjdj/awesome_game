const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 실패 횟수를 임시 메모리에 저장 (DB 연동 없이 로컬 인메모리)
const failLogs = {};

// 실패 기록 API
app.post('/api/fail-log', (req, res) => {
    const { stage, userId } = req.body;
    const user = userId || 'anonymous';

    if (!failLogs[user]) {
        failLogs[user] = { stage1: 0, stage2: 0, stage3: 0, stage4: 0, totalRage: 0 };
    }

    if (failLogs[user][stage] !== undefined) {
        failLogs[user][stage] += 1;
        failLogs[user].totalRage += 10;
    }

    res.json({ success: true, stats: failLogs[user] });
});

// 가스라이팅 캡챠 API (30% 확률로 억지 실패)
app.post('/api/captcha/verify', (req, res) => {
    const { answers } = req.body;
    // 사실 정답(answers)이 뭐든 상관없음. 킹받게 하는 게 목적.

    const isGaslighting = Math.random() < 0.3; // 30% 확률

    if (isGaslighting) {
        res.status(400).json({
            success: false,
            message: "당신은 로봇입니다. 인간이라면 이런 실수를 할 리가 없습니다."
        });
    } else {
        // 실제로는 검증 로직이 들어가야 하지만 컨셉상 무조건 통과
        res.json({ success: true, message: "인간으로 확인되었습니다." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Ultimate UX Hell Backend is running on port ${PORT}`);
});
