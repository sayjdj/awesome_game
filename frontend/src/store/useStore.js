import { create } from 'zustand';

export const useStore = create((set) => ({
    rageLevel: 0,
    failCounts: {
        stage1: 0,
        stage2: 0,
        stage3: 0,
        stage4: 0,
    },
    increaseRage: (amount) => set((state) => ({ rageLevel: state.rageLevel + amount })),
    recordFail: (stage) => set((state) => {
        const newFailCounts = { ...state.failCounts, [stage]: state.failCounts[stage] + 1 };

        // 백엔드 API로 비동기 전송 (결과를 기다리진 않음)
        fetch('http://localhost:3000/api/fail-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage, userId: 'player' })
        }).catch(e => console.error("Logging failed", e));

        return { failCounts: newFailCounts, rageLevel: state.rageLevel + 10 };
    }),
}));
