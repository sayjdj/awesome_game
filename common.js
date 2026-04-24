// 공통 스크립트 및 유틸 함수들
function shakeScreen() {
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
}

function showTaunt(msg, x, y) {
    const taunt = document.createElement('div');
    taunt.innerText = msg;
    taunt.style.position = 'absolute';
    taunt.style.left = x + 'px';
    taunt.style.top = y + 'px';
    taunt.style.color = 'red';
    taunt.style.fontWeight = 'bold';
    taunt.style.fontSize = '24px';
    taunt.style.pointerEvents = 'none';
    taunt.style.animation = 'floatUp 1s ease-out forwards';
    document.body.appendChild(taunt);

    setTimeout(() => {
        taunt.remove();
    }, 1000);
}

const styleSheet = document.createElement('style');
styleSheet.innerText = `
@keyframes floatUp {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(-50px); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);
