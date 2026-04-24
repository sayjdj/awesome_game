const btn = document.getElementById('runawayBtn');
const rageMeter = document.getElementById('rageMeter');
let rage = 0;

const taunts = [
    "느려!", "거기 아냐~", "ㅋㅋ 메롱", "마우스에 꿀 발랐나?", "시력 검사 좀 해봐",
    "아깝~", "이걸 못 누르네", "화났어?", "진정해~", "우끼끼 🐵"
];

btn.addEventListener('mouseover', (e) => {
    // 킹받는 버튼 이동 로직
    const maxX = window.innerWidth - btn.offsetWidth;
    const maxY = window.innerHeight - btn.offsetHeight;

    // 너무 멀리 가지 않으면서 마우스를 피하도록
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;

    // 헤더나 뒤로가기 버튼 영역 피하기
    if (newY < 150) newY += 150;

    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';

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
    btn.style.left = '50%';
    btn.style.top = '50%';
});

// 초기 위치 중앙 설정
window.onload = () => {
    btn.style.left = (window.innerWidth / 2 - btn.offsetWidth / 2) + 'px';
    btn.style.top = (window.innerHeight / 2 - btn.offsetHeight / 2) + 'px';
};
