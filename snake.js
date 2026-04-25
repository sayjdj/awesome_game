const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const controlStateElement = document.getElementById("controlState");
const gameOverOverlay = document.getElementById("gameOver");
const finalScoreElement = document.getElementById("finalScore");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let velocity = {x: 0, y: 0};
let apple = {x: 15, y: 15};
let score = 0;
let gameInterval;
let controlMode = "normal"; // normal, reverse, random
let modeInterval;

const taunts = [
    "방향키가 왜 이래? ㅋㅋ", "어딜 가시나~", "거꾸로 가는 중!", "마음대로 안 되지?", "아이고 답답해라"
];

function gameLoop() {
    update();
    draw();
}

function update() {
    let headX = snake[0].x + velocity.x;
    let headY = snake[0].y + velocity.y;

    // 벽 충돌 체크 (게임 오버)
    if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
        gameOver();
        return;
    }

    // 자기 몸 충돌 체크
    if (snake.slice(1).some(part => part.x === headX && part.y === headY)) {
        gameOver();
        return;
    }

    snake.unshift({x: headX, y: headY});

    // 사과 먹기
    if (headX === apple.x && headY === apple.y) {
        score += 10;
        scoreElement.innerText = score;
        spawnApple();
        if(score % 30 === 0) shakeScreen();
    } else {
        snake.pop(); // 안 먹었으면 꼬리 자르기
    }
}

function draw() {
    // 배경
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 사과
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.fillText("🍎", apple.x * gridSize - 2, apple.y * gridSize + 16);

    // 뱀
    ctx.fillStyle = "green";
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function spawnApple() {
    apple.x = Math.floor(Math.random() * tileCount);
    apple.y = Math.floor(Math.random() * tileCount);
    // 뱀 몸통에 겹치지 않게
    if (snake.some(part => part.x === apple.x && part.y === apple.y)) {
        spawnApple();
    }
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(modeInterval);
    shakeScreen();
    finalScoreElement.innerText = score;
    gameOverOverlay.style.display = "block";
}

// 킹받는 조작 변경 로직
function changeControlMode() {
    const modes = ["normal", "reverse", "left90", "right90"];
    const modeNames = {
        "normal": "정상",
        "reverse": "반전 (위↔아래, 좌↔우)",
        "left90": "좌로 90도 꺾임",
        "right90": "우로 90도 꺾임"
    };

    controlMode = modes[Math.floor(Math.random() * modes.length)];
    controlStateElement.innerText = modeNames[controlMode];

    if(controlMode !== "normal") {
        controlStateElement.style.color = "purple";
        const taunt = taunts[Math.floor(Math.random() * taunts.length)];
        showTaunt(taunt, window.innerWidth/2, 100);
        shakeScreen();
    } else {
        controlStateElement.style.color = "green";
    }
}

// 키 입력 처리
window.addEventListener("keydown", (e) => {
    let inputDir = {x: 0, y: 0};

    switch (e.key) {
        case "ArrowUp":    inputDir = {x: 0, y: -1}; break;
        case "ArrowDown":  inputDir = {x: 0, y: 1};  break;
        case "ArrowLeft":  inputDir = {x: -1, y: 0}; break;
        case "ArrowRight": inputDir = {x: 1, y: 0};  break;
        default: return;
    }

    // 모드에 따른 방향 변환
    let finalDir = {x: inputDir.x, y: inputDir.y};

    if (controlMode === "reverse") {
        finalDir.x = -inputDir.x;
        finalDir.y = -inputDir.y;
    } else if (controlMode === "left90") {
        finalDir.x = inputDir.y;
        finalDir.y = -inputDir.x;
    } else if (controlMode === "right90") {
        finalDir.x = -inputDir.y;
        finalDir.y = inputDir.x;
    }

    // 뱀이 반대 방향으로 즉시 꺾이는 것 방지
    if (velocity.x !== 0 && finalDir.x === -velocity.x) return;
    if (velocity.y !== 0 && finalDir.y === -velocity.y) return;

    // 시작 안했을때 시작
    if(velocity.x === 0 && velocity.y === 0) {
        if(finalDir.x === 0 && finalDir.y === 0) return; // 변환 후 0이면 무시
    }

    velocity = finalDir;
});

// 게임 시작
function initGame() {
    spawnApple();
    gameInterval = setInterval(gameLoop, 150); // 속도
    // 7초마다 조작법 변경
    modeInterval = setInterval(changeControlMode, 7000);
}

initGame();
