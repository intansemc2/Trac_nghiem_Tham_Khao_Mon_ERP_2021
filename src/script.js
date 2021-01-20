//
let tabCacCauHoi = document.getElementById('tab-cac-cau-hoi');
let tabTracNghiem = document.getElementById('tab-trac-nghiem');
let tabTongKet = document.getElementById('tab-tong-ket');
//
let tabContentCacCauHoi = document.getElementById('tab-content-cac-cau-hoi');
let tabContentTracNghiem = document.getElementById('tab-content-trac-nghiem');
let tabContentTongKet = document.getElementById('tab-content-tong-ket');
//
let tabs = [
    { tab: tabCacCauHoi, content: tabContentCacCauHoi },
    { tab: tabTracNghiem, content: tabContentTracNghiem },
    { tab: tabTongKet, content: tabContentTongKet },
];
//
let selectedTabIndex = 0;
//
let intervalTimerID = 0;
//
let doTestTime = { hh: 0, mm: 0, ss: 0 };
//
let testQuestions = [];
//
let testAnswers = [];
//
let formatTimeValue = (timeValue) => `${timeValue}`.padStart(2, '0');
//
let formatTime = (hh, mm, ss, pp = null) =>
    `${formatTimeValue(hh)}h ${formatTimeValue(mm)}m ${formatTimeValue(ss)}s${pp ? ` ${pp}ms` : ''}`;
//
let gradeFromCode = (code) => String.fromCharCode(parseInt(code) - 1 + 65);
//
let codeFromGrade = (grade) => `${grade}`.charCodeAt(0) - 65 + 1;

//////////////////////////////////////////////
//
function extendedTab(tabIndex) {
    tabs[tabIndex].tab.classList.add('extended');
    tabs[tabIndex].content.classList.remove('d-none');
}
//
function collapsedTab(tabIndex) {
    tabs[tabIndex].tab.classList.remove('extended');
    tabs[tabIndex].content.classList.add('d-none');
}
//
function collapsedOtherTab(tabIndex) {
    for (let i = 0; i < tabIndex; i += 1) {
        collapsedTab(i);
    }
    for (let i = tabIndex + 1; i < tabs.length; i += 1) {
        collapsedTab(i);
    }
}
//
function selectTab(tabIndex) {
    //
    collapsedOtherTab(tabIndex);
    //
    extendedTab(tabIndex);
    //
    selectedTabIndex = tabIndex;
}

//
function previousTabIndex(tabIndex) {
    let previousIndex = tabIndex - 1;
    if (previousIndex < 0) previousIndex = tabs.length - 1;
    return previousIndex;
}
function nextTabIndex(tabIndex) {
    let nextIndex = tabIndex + 1;
    if (nextIndex >= tabs.length) nextIndex = 0;
    return nextIndex;
}

//
function hideTab(tabIndex) {
    tabs[tabIndex].tab.classList.add('d-none');
    tabs[tabIndex].content.classList.add('d-none');
}
//
function hideOtherTab(tabIndex) {
    for (let i = 0; i < tabIndex; i += 1) {
        hideTab(i);
    }
    for (let i = tabIndex + 1; i < tabs.length; i += 1) {
        hideTab(i);
    }
}
//
function showTab(tabIndex) {
    tabs[tabIndex].tab.classList.remove('d-none');
    tabs[tabIndex].content.classList.remove('d-none');
}

//////////////////////////////////////////////
//
function createHTMLAnswer(answer, script = false) {
    if (answer.noi_dung === '' || answer.noi_dung === '0') return '';

    let ten = gradeFromCode(answer.ten);
    let noi_dung = answer.noi_dung;
    let is_dung = answer.is_dung;
    let is_selected = answer.is_selected;
    return `
<div class="cau-tra-loi  ${is_dung || is_dung === false ? (is_dung ? 'dung' : 'sai') : ''} ${
        is_selected ? 'selected' : ''
    }" ${
        script
            ? `onclick="this.parentNode.querySelectorAll('.cau-tra-loi').forEach((node) => node.classList.remove('selected')); this.classList.add('selected')"`
            : ''
    }>
    <div class="ten">${ten}</div>
    <div class="noi-dung">${noi_dung}</div>
</div>
`;
}
//
function createHTMLImages(stt) {
    if (QUESTION_IMAGES.has(stt)) {
        let imagesURLS = QUESTION_IMAGES.get(stt);
        return imagesURLS.map(
            (imagesURL, index) => `<img src="${imagesURL}" alt="Hình ảnh thứ ${index} của câu hỏi ${stt}" />`
        );
    } else {
        return null;
    }
}
//
function createHTMLQuestion(stt, title, answers) {
    let imagesHTML = createHTMLImages(stt);
    let answersHTML = answers
        .map((a, i) => {
            return { ten: i + 1, noi_dung: a };
        })
        .map((a) => createHTMLAnswer(a, true))
        .join(' ');
    return `
<div class="cau-hoi">
    <div class="tieu-de">
        <div class="stt">${stt}</div>
        ${title}
    </div>
    <div class="noi-dung">
        <div class="hinh-anh ${imagesHTML === null ? 'd-none' : ''}">${imagesHTML ? imagesHTML : ''}</div>
        <div class="cac-cau-tra-loi">${answersHTML}</div>
    </div>
</div>
`;
}
//
function createHTMLDetailQuestion(
    stt,
    title,
    answers,
    result,
    grade,
    level,
    chapter,
    time,
    form,
    isCheckSelected = false,
    selectedIndex = undefined
) {
    let imagesHTML = createHTMLImages(stt);
    let answersHTML = answers
        .map((a, i) => {
            let ten = i + 1;
            let is_dung = null;
            let is_selected = null;

            let indexString = `${i + 1}`;

            if (isCheckSelected) {
                let selectedIndexString = `${selectedIndex}`;
                if (selectedIndex) {
                    if (indexString == selectedIndexString) is_selected = true;
                    if (indexString == selectedIndexString && indexString != result) is_dung = false;
                    if (indexString == result) is_dung = true;
                } else {
                    if (indexString == result) is_dung = false;
                }
            } else {
                if (indexString == result) is_dung = true;
            }

            return { ten: ten, noi_dung: a, is_dung: is_dung, is_selected: is_selected };
        })
        .map((a) => createHTMLAnswer(a))
        .join(' ');
    return `
<div class="cau-hoi">
    <div class="tieu-de">
        <div class="stt">${stt}</div>
        ${title}
    </div>
    <div class="noi-dung">
    <div class="hinh-anh ${imagesHTML === null ? 'd-none' : ''}">${imagesHTML ? imagesHTML : ''}</div>
        <div class="cac-cau-tra-loi">${answersHTML}</div>
    </div>
    <div class="thong-tin">
        <div class="dap-an">Đáp án <span class="gia-tri">${gradeFromCode(result)}</span></div>
        <div class="diem">Điểm <span class="gia-tri">${grade}</span></div>
        <div class="muc-do">Mức độ <span class="gia-tri">${level}</span></div>
        <div class="chuong">Chương <span class="gia-tri">${chapter}</span></div>
        <div class="thoi-gian">Thời gian <span class="gia-tri">${time}</span> phút </div>
        <div class="hinh-thuc">Hình thức <span class="gia-tri">${form}</span></div>
    </div>
</div>    
`;
}

//
function showQuestions() {
    tabContentCacCauHoi.innerHTML = '';

    let chiTietCauHoiHTML = '';
    for (let cau_hoi of QUESTIONS) {
        let answers = [cau_hoi.lua_chon_a, cau_hoi.lua_chon_b, cau_hoi.lua_chon_c, cau_hoi.lua_chon_d];
        chiTietCauHoiHTML += createHTMLDetailQuestion(
            cau_hoi.stt,
            cau_hoi.cau_hoi,
            answers,
            cau_hoi.dap_an,
            cau_hoi.diem_so,
            cau_hoi.muc_do,
            cau_hoi.thuoc_chuong,
            cau_hoi.thoi_gian,
            cau_hoi.hinh_thuc
        );
    }

    tabContentCacCauHoi.innerHTML += chiTietCauHoiHTML;
}

//////////////////////////////////////////////
//
function changeToStartTest() {
    document.getElementById('tab-content-trac-nghiem').classList.add('start-test');
    document.querySelector('#tab-content-trac-nghiem .timer .timer-value').href = '#kiem-tra-test';
    resetTimerValue();
    startTimer();

    createTestQuestions();
    updateTestQuestions();
}
//
function changeToSetupTest() {
    document.getElementById('tab-content-trac-nghiem').classList.remove('start-test');
    document.getElementById('tab-content-trac-nghiem').classList.remove('test-result');
    document.querySelector('#tab-content-trac-nghiem .timer .timer-value').href = '#bat-dau-test';
    stopTimer();
    resetTimerValue();
}
//
function changeToCheckResult() {
    document.getElementById('tab-content-trac-nghiem').classList.add('test-result');
    document.querySelector('#tab-content-trac-nghiem .timer .timer-value').href = '#ket-qua-test';

    stopTimer();

    getSelectedTestAnswers();
    updateTestQuestionResults();

    updateCheckResultPanel();
}
//
function startTimer() {
    updateUITimer();
    intervalTimerID = setInterval(() => {
        updateUITimer();
        updateTimerValue();
    }, 1000);
}
function stopTimer() {
    clearInterval(intervalTimerID);
    updateUITimer();
}
//
function updateTimerValue(number = 1) {
    doTestTime.ss += number;

    if (doTestTime.ss >= 60) {
        doTestTime.mm += Math.floor(doTestTime.ss / 60);
        doTestTime.ss = doTestTime.ss % 60;
    }

    if (doTestTime.mm >= 60) {
        doTestTime.hh += Math.floor(doTestTime.mm / 60);
        doTestTime.mm = doTestTime.mm % 60;
    }
}
//
function updateUITimer() {
    //
    document.querySelector('#tab-content-trac-nghiem .timer .timer-value').innerHTML = formatTime(
        doTestTime.hh,
        doTestTime.mm,
        doTestTime.ss
    );
}
//
function resetTimerValue() {
    //
    doTestTime.hh = 0;
    doTestTime.mm = 0;
    doTestTime.ss = 0;
}
//
function createTestQuestions() {
    let numberQuestions = parseInt(
        document.querySelector('#tab-content-trac-nghiem .config-test .so-luong-cau-hoi').value
    );

    if (numberQuestions > QUESTIONS.length) {
        numberQuestions = QUESTIONS.length;
        document.querySelector('#tab-content-trac-nghiem .config-test .so-luong-cau-hoi').value = QUESTIONS.length;
    }

    if (numberQuestions < 1 || isNaN(numberQuestions)) {
        numberQuestions = 1;
        document.querySelector('#tab-content-trac-nghiem .config-test .so-luong-cau-hoi').value = 1;
    }

    testQuestions = [];
    for (let i = 0; i < numberQuestions; i += 1) {
        let newQuestion = null;
        while (true) {
            newQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

            let isHas = false;
            for (let testQuestion of testQuestions)
                if (testQuestion.stt == newQuestion.stt) {
                    isHas = true;
                    break;
                }

            if (isHas == false) break;
        }
        testQuestions.push(newQuestion);
    }

    testQuestions = testQuestions.map((testQuestion) => {
        testQuestion.answers = [
            testQuestion.lua_chon_a,
            testQuestion.lua_chon_b,
            testQuestion.lua_chon_c,
            testQuestion.lua_chon_d,
        ];
        return testQuestion;
    });

    testQuestions.sort((a, b) => parseInt(a.stt) - parseInt(b.stt));
}
//
function updateTestQuestions() {
    let questionsHTML = '';

    for (let cau_hoi of testQuestions)
        questionsHTML += createHTMLQuestion(cau_hoi.stt, cau_hoi.cau_hoi, cau_hoi.answers);

    document.querySelector('#tab-content-trac-nghiem .danh-sach-cau-hoi').innerHTML = questionsHTML;
}
//
function getSelectedTestAnswers() {
    testAnswers = [];
    document
        .querySelector('#tab-content-trac-nghiem .danh-sach-cau-hoi')
        .querySelectorAll('.cau-hoi')
        .forEach((questionNode) => {
            let answerNodes = questionNode.querySelectorAll('.cau-tra-loi.selected');
            if (answerNodes.length < 1) testAnswers.push(null);
            else {
                let answerNode = answerNodes[0].querySelector('.ten');
                let answerCode = codeFromGrade(answerNode.innerHTML);
                testAnswers.push(answerCode);
            }
        });
}
//
function updateTestQuestionResults() {
    let questionResultsHTML = '';

    for (let i = 0; i < testQuestions.length; i += 1) {
        questionResultsHTML += createHTMLDetailQuestion(
            testQuestions[i].stt,
            testQuestions[i].cau_hoi,
            testQuestions[i].answers,
            testQuestions[i].dap_an,
            testQuestions[i].diem_so,
            testQuestions[i].muc_do,
            testQuestions[i].thuoc_chuong,
            testQuestions[i].thoi_gian,
            testQuestions[i].hinh_thuc,
            true,
            testAnswers[i]
        );
    }

    document.querySelector('#tab-content-trac-nghiem .danh-sach-cau-hoi').innerHTML = questionResultsHTML;
}
//
function updateCheckResultPanel() {
    //
    let dungHTML = document.querySelector('#tab-content-trac-nghiem .ket-qua-test .dung');
    let saiHTML = document.querySelector('#tab-content-trac-nghiem .ket-qua-test .sai');
    let timeHTML = document.querySelector('#tab-content-trac-nghiem .ket-qua-test .time');
    let tyLeDungHTML = document.querySelector('#tab-content-trac-nghiem .ket-qua-test .ty-le-dung');
    let thoiGianTBHTML = document.querySelector('#tab-content-trac-nghiem .ket-qua-test .thoi-gian-trung-binh');
    let diemHTML = document.querySelector('#tab-content-trac-nghiem .ket-qua-test .diem ');

    //
    let dung = 0;
    let sai = 0;
    let so_cau = testAnswers.length;
    for (let i = 0; i < so_cau; i += 1) {
        if (testAnswers[i] == testQuestions[i].dap_an) dung += 1;
        else sai += 1;
    }

    let time = formatTime(doTestTime.hh, doTestTime.mm, doTestTime.ss);
    let tyLeDung = (1.0 * dung) / so_cau;

    let thoiGianTB = doTestTime.hh * 3600.0 + doTestTime.mm * 60.0 + doTestTime.ss * 1.0;
    thoiGianTB = (1.0 * thoiGianTB) / so_cau;
    thoiGianTB = formatTime(
        Math.floor(thoiGianTB / 3600.0),
        Math.floor((thoiGianTB % 3600.0) / 60.0),
        Math.floor((thoiGianTB % 3600.0) % 60.0),
        Math.floor((thoiGianTB % 1) * 1000)
    );

    let diem = 10.0 * tyLeDung;

    //
    dungHTML.innerHTML = dung;
    saiHTML.innerHTML = sai;
    timeHTML.innerHTML = time;
    tyLeDungHTML.innerHTML = `${Math.floor(tyLeDung * 10000) / 100}%`;
    thoiGianTBHTML.innerHTML = thoiGianTB;
    diemHTML.innerHTML = Math.floor(diem * 100) / 100;

    //
    diemHTML.classList.remove('cao');
    diemHTML.classList.remove('thap');
    if (diem >= 7.0) diemHTML.classList.add('cao');
    else if (diem < 5) diemHTML.classList.add('thap');

    //
    tyLeDungHTML.classList.remove('cao');
    tyLeDungHTML.classList.remove('thap');
    if (tyLeDung >= 0.7) tyLeDungHTML.classList.add('cao');
    else if (tyLeDung < 0.5) tyLeDungHTML.classList.add('thap');
}

//////////////////////////////////////////////
//
function initializeEventTabs() {
    for (let tabIndex = 0; tabIndex < tabs.length; tabIndex += 1) {
        tabs[tabIndex].tab.addEventListener('click', () => {
            selectTab(tabIndex);
        });
    }
}

//
function initializeEventStartTest() {
    document.querySelector('#tab-content-trac-nghiem .bat-dau').addEventListener('click', () => changeToStartTest());
    document
        .querySelector('#tab-content-trac-nghiem .cai-lai-test')
        .addEventListener('click', () => changeToSetupTest());
    document.querySelector('#tab-content-trac-nghiem .kiem-tra').addEventListener('click', () => changeToCheckResult());
}

//////////////////////////////////////////////
//
initializeEventTabs();
initializeEventStartTest();

showQuestions();

selectTab(0);
