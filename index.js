'use strict';

const dropArea = document.querySelector('.file__form');
const dropInput = document.querySelector('#drop-input');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) => {
  dropArea.addEventListener(event, (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  });
});

['dragenter', 'dragover'].forEach((event) => {
  dropArea.addEventListener(event, () => {
    dropArea.classList.add('drag');
  });
});

['dragleave', 'drop'].forEach((event) => {
  dropArea.addEventListener(event, () => {
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
};

btnSearch.onclick = () => {
  modalResultList.innerHTML = '';

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
};

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

/* ----------------------------------------------
 * Regular expressions
 */

const regExps = {
  phone: /^((\+7|7|8)+([0-9]){10})$|\b\d{3}[-.]?\d{3}[-.]?\d{4}/,
  email: /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm,
  url: /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  date: /^(?![+-]?\d{4,5}-?(?:\d{2}|W\d{2})T)(?:|(\d{4}|[+-]\d{5})-?(?:|(0\d|1[0-2])(?:|-?([0-2]\d|3[0-1]))|([0-2]\d{2}|3[0-5]\d|36[0-6])|W([0-4]\d|5[0-3])(?:|-?([1-7])))(?:(?!\d)|T(?=\d)))(?:|([01]\d|2[0-4])(?:|:?([0-5]\d)(?:|:?([0-5]\d)(?:|\.(\d{3})))(?:|[zZ]|([+-](?:[01]\d|2[0-4]))(?:|:?([0-5]\d)))))$/,
};

function searchInText(fileContent, arrOptions) {
  let resultArr = [];

  arrOptions.forEach((regName) => {
    resultArr = resultArr.concat(fileContent.match(regExps[regName]));
  });

  return resultArr;
}

/* ----------------------------------------------
 * Search result section
 */

/* ----------------------------------------------
 * Footer time
 */

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
    ? (footerHours.textContent = '0' + new Date().getHours())
    : (footerHours.textContent = new Date().getHours());
}

function setMinutes() {
  new Date().getMinutes().toString().length === 1
    ? (footerMinutes.textContent = '0' + new Date().getMinutes())
    : (footerMinutes.textContent = new Date().getMinutes());
}

function setSeconds() {
  new Date().getSeconds().toString().length === 1
    ? (footerSeconds.textContent = '0' + new Date().getSeconds())
    : (footerSeconds.textContent = new Date().getSeconds());
}
