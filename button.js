const btn = document.getElementById('runawayBtn');
const rageMeter = document.getElementById('rageMeter');
let rage = 0;

const taunts = [
    "느려!", "거기 아냐~", "ㅋㅋ 메롱", "마우스에 꿀 발랐나?", "시력 검사 좀 해봐",
    "아깝~", "이걸 못 누르네", "화났어?", "진정해~", "우끼끼 🐵"
];

// [Bolt Optimization]: Cache button dimensions and use transform for movement.
// 🎯 Why: Reading `offsetWidth`/`offsetHeight` and modifying `left`/`top` in an event handler causes layout thrashing (Forced Synchronous Layout).
// 📊 Impact: Using `transform: translate` shifts movement to the GPU (Composite layer), eliminating CPU layout recalculations and providing buttery smooth 60fps movement.
let btnWidth = 0;
let btnHeight = 0;

btn.addEventListener('mouseover', (e) => {
    // 킹받는 버튼 이동 로직
    const maxX = window.innerWidth - btnWidth;
    const maxY = window.innerHeight - btnHeight;

    // 너무 멀리 가지 않으면서 마우스를 피하도록
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;

    // 헤더나 뒤로가기 버튼 영역 피하기
    if (newY < 150) newY += 150;

    btn.style.transform = `translate(${newX}px, ${newY}px)`;

    rage += 5;
    rageMeter.innerText = rage;

    // 가끔씩 약올리는 멘트 출력 및 화면 흔들림
    if (Math.random() > 0.5) {
        showTaunt(taunts[Math.floor(Math.random() * taunts.length)], e.clientX, e.clientY);
    }

    if (rage % 20 === 0) {
        shakeScreen();
    }

    if (rage >= 100) {
        alert("분노 게이지 100% 돌파! 당신의 패배입니다 ㅋㅋㅋ");
        rage = 0;
        rageMeter.innerText = rage;
    }
});

btn.addEventListener('click', () => {
    // 혹시라도 운 좋게 눌렀을 때
    alert("와 이걸 누르네? 하지만 점수는 안 줄 거지롱~");
    rage = 0;
    rageMeter.innerText = rage;
    btn.style.transform = `translate(${window.innerWidth / 2 - btnWidth / 2}px, ${window.innerHeight / 2 - btnHeight / 2}px)`;
});

// 초기 위치 중앙 설정
window.onload = () => {
    btnWidth = btn.offsetWidth;
    btnHeight = btn.offsetHeight;

    // transform translate은 현재 element 위치를 기준으로 이동하므로 초기 위치를 0,0으로 강제
    btn.style.left = '0px';
    btn.style.top = '0px';

    btn.style.transform = `translate(${window.innerWidth / 2 - btnWidth / 2}px, ${window.innerHeight / 2 - btnHeight / 2}px)`;
};
