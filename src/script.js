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
function createHTMLAnswer(answer) {
    let ten = answer.ten;
    let noi_dung = answer.noi_dung;
    let is_dung = answer.is_dung;
    let is_selected = answer.is_selected;
    return `
<div class="cau-tra-loi  ${is_dung || is_dung === false ? (is_dung ? 'dung' : 'sai') : ''} ${
        is_selected ? 'selected' : ''
    }">
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
            return { ten: String.fromCharCode(i + 65), noi_dung: a };
        })
        .map((a) => createHTMLAnswer(a))
        .join(' ');
    return `
<div class="cau-hoi" id="mau-cau-hoi">
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
function createHTMLDetailQuestion(stt, title, answers, result, grade, level, chapter, time, form, selectIndex) {
    let imagesHTML = createHTMLImages(stt);
    let resultIndex = parseInt(result) - 1;
    let answersHTML = answers
        .map((a, i) => {
            let ten = String.fromCharCode(i + 65);
            let is_dung = null;
            let is_selected = null;
            if (i == resultIndex) is_dung = true;
            if (i == selectIndex && selectIndex != resultIndex) is_dung = false;
            if (i == selectIndex) is_selected = true;
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
        <div class="dap-an">Đáp án <span class="gia-tri">${String.fromCharCode(resultIndex + 65)}</span></div>
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
function initializeEventTabs() {
    for (let tabIndex = 0; tabIndex < tabs.length; tabIndex += 1) {
        tabs[tabIndex].tab.addEventListener('click', () => {
            selectTab(tabIndex);
        });
    }
}

//////////////////////////////////////////////
//
initializeEventTabs();
showQuestions();

selectTab(1);
