'use strict';

const dropArea = document.querySelector('.file__form');
const dropInput = document.querySelector('#drop-input');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    dropArea.addEventListener(event, (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
    });
});

['dragenter', 'dragover'].forEach(event => {
    dropArea.addEventListener(event, (evt) => {
        dropArea.classList.add('drag');
    });
});

['dragleave', 'drop'].forEach(event => {
    dropArea.addEventListener(event, (evt) => {
        dropArea.classList.remove('drag');
    });
});

dropArea.addEventListener('drop', (event) => {
    const dt = event.dataTransfer;
    const file = dt.files[0];

    readFile(file);
});

dropInput.addEventListener('change', (event) => {
    readFile(event.target.files[0]);
});

let fileContent = null;

function readFile(file) {
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
        fileContent = reader.result;
        showOptions();
    };

    reader.onerror = () => {
        console.log(reader.error);
    };
}

const fileSection = document.querySelector('.file');
const resultSection = document.querySelector('.result');
const btnBack = document.querySelector('.result__btn-back');
const btnSearch = document.querySelector('.result__btn-search');
const modalResult = document.querySelector('.search-results-wrapper');
const modalResultList = document.querySelector('.search-results-list');
const btnModalClose = document.querySelector('.search-result-btn-close');

function showOptions() {
    resultSection.classList.remove('hide');
    fileSection.classList.add('hide');
}

btnBack.onclick = () => {
    fileSection.classList.remove('hide');
    resultSection.classList.add('hide');
}

btnSearch.onclick = () => {
    modalResultList.innerHTML = '';

    const arrResults = [];
    const arrOptions = checkedOption();

    if (arrOptions.length) {
        searchInText(fileContent, arrOptions).forEach((item) => {
            if (item) {
                const li = document.createElement('li');
                li.textContent = item;
                modalResultList.append(li);
            } else {
                modalResultList.textContent = 'Nothing found';
            }
        });
    } else {
        modalResultList.textContent = 'Nothing found';
    }

    modalResult.classList.remove('hide');
}

const arrCheckboxes = [...document.querySelectorAll('input[type=checkbox]')];

function checkedOption() {
    const resultArr = [];

    for (let i = 0; i < arrCheckboxes.length; i += 1) {
        if (arrCheckboxes[i].checked) {
            resultArr.push(arrCheckboxes[i].value);
        }
    }

    return resultArr;
}

function searchInText(fileContent, arrOptions) {
    let resultArr = [];
    const objRegexpTemplate = {
        phone: /-?\d\(?\d{3}\)?\d{3}-?\d{2}-?\d{2}/g,
        email: /[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~]+@[a-z]+\.[a-z]+/g,
        date: /\d{4}-([0][0-9]|[1][012])-([0-2][0-9]|3[01])/g,
    }

    arrOptions.forEach((regName) => {
        resultArr = resultArr.concat(fileContent.match(objRegexpTemplate[regName]));
    });

    return resultArr;
}

btnModalClose.onclick = () => {
    modalResult.classList.add('hide');
}

const ESC_CODE = 27;

document.addEventListener('keydown', (event) => {
    if (event.keyCode === ESC_CODE) {
        modalResult.classList.add('hide');
    }
});

// ----------------------------------------------
// Added next code just for fun and practice

let footerHours = document.querySelector('.footer__hours');
let footerMinutes = document.querySelector('.footer__minutes');
let footerSeconds = document.querySelector('.footer__seconds');

setHours();
setMinutes();
setSeconds();

setInterval(setHours, 1000 * 60 * 60);
setInterval(setMinutes, 1000 * 60);
setInterval(setSeconds, 1000);

function setHours() {
    new Date().getHours().toString().length === 1
        ? footerHours.textContent = '0' + new Date().getHours()
        : footerHours.textContent = new Date().getHours();
}

function setMinutes() {
    new Date().getMinutes().toString().length === 1
        ? footerMinutes.textContent = '0' + new Date().getMinutes()
        : footerMinutes.textContent = new Date().getMinutes();
}

function setSeconds() {
    new Date().getSeconds().toString().length === 1
        ? footerSeconds.textContent = '0' + new Date().getSeconds()
        : footerSeconds.textContent = new Date().getSeconds();
}