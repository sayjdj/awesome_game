const startWords = ["대한민국", "유재석", "바나나", "호랑이", "컴퓨터"];
let currentWord = startWords[Math.floor(Math.random() * startWords.length)];
let targetCharIndex = 1; // 0-based, 앞에서 2번째 글자
let ruleMode = 'second_char'; // 'second_char', 'last_second', 'random'

const currentWordDisplay = document.getElementById("currentWordDisplay");
const wordInput = document.getElementById("wordInput");
const feedback = document.getElementById("feedback");
const wordHistory = document.getElementById("wordHistory");
const ruleText = document.getElementById("ruleText");
const submitBtn = document.querySelector(".submit-btn");

let usedWords = [currentWord];
wordHistory.innerHTML = `<strong>히스토리:</strong><br>${currentWord}`;
let isChecking = false;

function updateDisplay() {
    let displayHTML = "";
    for (let i = 0; i < currentWord.length; i++) {
        if (i === targetCharIndex) {
            displayHTML += `<span class="target-char">${currentWord[i]}</span>`;
        } else {
            displayHTML += currentWord[i];
        }
    }
    currentWordDisplay.innerHTML = displayHTML;
}

function changeRule() {
    const rules = ['second_char', 'last_second', 'random_idx'];
    ruleMode = rules[Math.floor(Math.random() * rules.length)];

    if (ruleMode === 'second_char') {
        targetCharIndex = 1;
        ruleText.innerHTML = "규칙: 제시어의 <b style='color:blue;'>'앞에서 두 번째 글자'</b>로 시작하는 3글자 단어!";
    } else if (ruleMode === 'last_second') {
        targetCharIndex = currentWord.length - 2;
        if(targetCharIndex < 0) targetCharIndex = 0;
        ruleText.innerHTML = "규칙: 제시어의 <b style='color:red;'>'뒤에서 두 번째 글자'</b>로 시작하는 3글자 단어!";
    } else {
        targetCharIndex = Math.floor(Math.random() * currentWord.length);
        ruleText.innerHTML = `규칙: 랜덤 픽! <b style='color:green;'>'${targetCharIndex+1}번째 글자'</b>로 시작하는 3글자 단어!`;
    }
    updateDisplay();
}

async function verifyWordExists(word) {
    try {
        // 한국어 위키낱말사전 API를 활용하여 단어 존재 여부 확인
        const response = await fetch(`https://ko.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(word)}&format=json&origin=*`);
        const data = await response.json();

        // 페이지 데이터가 없으면(-1) 사전에 없는 단어
        const pages = data.query.pages;
        if (pages["-1"]) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("API 연동 에러:", error);
        // 에러 시 게임 진행을 위해 일단 통과시켜줌
        return true;
    }
}

async function submitWord() {
    if (isChecking) return;

    const input = wordInput.value.trim();

    if (input.length !== 3) {
        showError("3글자 단어만 입력 가능합니다!");
        return;
    }

    const requiredChar = currentWord[targetCharIndex];

    if (input[0] !== requiredChar) {
        showError(`'${requiredChar}'(으)로 시작해야 합니다!`);
        return;
    }

    if (usedWords.includes(input)) {
        showError("이미 사용한 단어입니다!");
        return;
    }

    // 사전 검증 중 UI 처리
    isChecking = true;
    submitBtn.innerText = "검사중...";
    submitBtn.disabled = true;
    feedback.style.color = "blue";
    feedback.innerText = "국립국어원(위키낱말) 접속 중... 🧐";

    const exists = await verifyWordExists(input);

    isChecking = false;
    submitBtn.innerText = "입력";
    submitBtn.disabled = false;

    if (!exists) {
        // 사전에 없어도 20% 확률로 킹받게 억지 통과
        if(Math.random() > 0.8) {
            showError("사전에 없는 단어지만... 봐줍니다 ㅋ");
            setTimeout(() => { feedback.innerText = ""; }, 1000);
        } else {
            showError("사전에 없는 단어입니다! 지어내지 마세요 😡");
            return;
        }
    }

    // 통과
    feedback.style.color = "green";
    feedback.innerText = "정답!";
    usedWords.push(input);
    wordHistory.innerHTML += ` <span style='color:#ccc'>-></span> ${input}`;

    currentWord = input;
    wordInput.value = "";
    wordInput.focus();

    // 턴이 넘어갈 때마다 가끔씩 킹받게 룰 변경
    if(Math.random() > 0.4) {
        changeRule();
    } else {
        if(ruleMode === 'last_second') targetCharIndex = currentWord.length - 2;
        updateDisplay();
    }
}

function showError(msg) {
    feedback.style.color = "red";
    feedback.innerText = msg;
    shakeScreen();
    wordInput.value = "";
    wordInput.focus();
}

wordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitWord();
    }
});

// 초기화
changeRule(); // 처음부터 룰 적용
