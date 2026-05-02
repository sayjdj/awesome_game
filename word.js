// 간단한 내장 단어장 (3글자 단어)
const dictionary = new Set([
    "한라산", "한국인", "한가위", "한마음", "한여름", "한반도", "한송이",
    "라디오", "라면집", "라벤더", "라운지", "라이터",
    "산기슭", "산봉우리", "산불조심", "산타클", "산할아버지", "산소통",
    "기차역", "기록장", "기념일", "기대감", "기름값",
    "차선책", "차단기", "차별화", "차세대",
    "선풍기", "선생님", "선물용", "선수촌",
    "풍선껌", "풍경화", "풍물놀", "풍뎅이",
    "껌딱지", "껌종이",
    "지하철", "지우개", "지갑속", "지구본", "지름길",
    "하마터", "하늘색", "하수구", "하모니",
    "철사장", "철도청", "철판구",
    "장난감", "장미꽃", "장수풍", "장학생",
    "감자탕", "감동적", "감수성",
    "탕수육", "탕비실",
    "육개장", "육상부",
    "장기자", "장독대",
    "자전거", "자동차", "자라목",
    "거북이", "거짓말", "거미줄",
    "이빨요", "이름표", "이발소",
    "표지판", "표범무",
    "판사님", "판타지", "판다곰",
    "사과나무", "사물함", "사다리",
    "다람쥐", "다리미", "다이어",
    "쥐구멍", "쥐포구",
    "구멍가", "구름빵", "구기자",
    "기러기",
    // 자주 쓰이는 무작위 3글자 단어 추가
    "가나다", "강아지", "고양이", "비행기", "소방차", "경찰차", "구급차",
    "운동화", "슬리퍼", "컴퓨터", "키보드", "마우스", "모니터", "스피커",
    "휴대폰", "충전기", "이어폰", "리모컨", "선글라", "마스크", "텀블러",
    "자물쇠", "열쇠고", "우산꽂", "쓰레기", "빗자루", "걸레받", "화장실",
    "세면대", "변기통", "수건걸", "칫솔꽂", "치약짜", "비누곽", "샤워기",
    "욕조물", "바가지", "수도꼭", "보일러", "에어컨", "온풍기", "가습기",
    "제습기", "공기청", "청소기", "세탁기", "건조기", "냉장고", "전자렌",
    "오븐기", "가스렌", "인덕션", "도마위", "식칼잡", "냄비받", "프라이",
    "국자퍼", "뒤집개", "수저통", "밥그릇", "국그릇", "반찬통", "물컵잔",
    "주전자", "보온병", "믹서기", "커피포", "토스터", "식기세", "정수기"
]);

const startWords = ["대한민국", "유재석", "바나나", "호랑이", "컴퓨터"];
let currentWord = startWords[Math.floor(Math.random() * startWords.length)];
let targetCharIndex = 1; // 0-based, 앞에서 2번째 글자
let ruleMode = 'second_char'; // 'second_char', 'last_second', 'random'

const currentWordDisplay = document.getElementById("currentWordDisplay");
const wordInput = document.getElementById("wordInput");
const feedback = document.getElementById("feedback");
const wordHistory = document.getElementById("wordHistory");
const ruleText = document.getElementById("ruleText");

let usedWords = new Set([currentWord]);

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

function submitWord() {
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

    if (usedWords.has(input)) {
        showError("이미 사용한 단어입니다!");
        return;
    }

    // 간단한 사전 검사 (엄격하게 하려면 주석 해제, 현재는 킹받게 하기 위해 대충 통과시켜주는 로직도 가능)
    if (!dictionary.has(input)) {
        // 사전에 없어도 20% 확률로 킹받게 억지 통과
        if(Math.random() > 0.8) {
            showError("사전에 없는 단어지만... 봐줍니다 ㅋ");
            setTimeout(() => { feedback.innerText = ""; }, 1000);
        } else {
            showError("사전에 없는 단어입니다! (내장 사전에 한계가 있을 수 있음)");
            return;
        }
    }

    // 통과
    feedback.style.color = "green";
    feedback.innerText = "정답!";
    usedWords.add(input);
    // Use insertAdjacentHTML for O(1) DOM appending instead of O(n) innerHTML +=
    wordHistory.insertAdjacentHTML('beforeend', ` <span style='color:#ccc'>-></span> ${input}`);

    currentWord = input;
    wordInput.value = "";
    wordInput.focus();

    // 턴이 넘어갈 때마다 가끔씩 킹받게 룰 변경
    if(Math.random() > 0.4) {
        changeRule();
    } else {
        // 룰이 안 바뀌어도 타겟 인덱스 갱신은 필요 (단어 길이가 3으로 고정이지만 만약을 위해)
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
