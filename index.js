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

function showOptions() {
  resultSection.classList.remove('hide');
  fileSection.classList.add('hide');
}

btnBack.onclick = () => {
  fileSection.classList.remove('hide');
  resultSection.classList.add('hide');
};

/* ----------------------------------------------
 * Regular expressions
 */

const regExps = {
  phone: /^((\+7|-7|7|8)+([0-9]){10})$|\b\d{3}[-.]?\d{3}[-.]?\d{4}/g,
  email: /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm,
  url: /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g,
  date: /^(?![+-]?\d{4,5}-?(?:\d{2}|W\d{2})T)(?:|(\d{4}|[+-]\d{5})-?(?:|(0\d|1[0-2])(?:|-?([0-2]\d|3[0-1]))|([0-2]\d{2}|3[0-5]\d|36[0-6])|W([0-4]\d|5[0-3])(?:|-?([1-7])))(?:(?!\d)|T(?=\d)))(?:|([01]\d|2[0-4])(?:|:?([0-5]\d)(?:|:?([0-5]\d)(?:|\.(\d{3})))(?:|[zZ]|([+-](?:[01]\d|2[0-4]))(?:|:?([0-5]\d)))))$/g,
};

/* ----------------------------------------------
 * Search result section
 */

const loaderNode = `
<div class="lds-facebook">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>
`;

btnSearch.onclick = () => {
  const resultsWrapper = document.querySelector('.search-results__wrapper');

  resultsWrapper.innerHTML = loaderNode;
  // delay just for funny
  setTimeout(() => {
    const options = checkedOption();
    let finallyContent = '';

    try {
      if (options.length) {
        const divWrapper = document.createElement('div');
        const searchResult = searchInFile(fileContent, options);

        if (searchResult.length) {
          searchResult.forEach((list) => {
            div.append(list);
          });

          finallyContent = divWrapper;
        }
      } else {
        finallyContent = 'Nothing found';
      }
    } catch (err) {
      finallyContent = 'Something go wrong. Try again 😕';
      console.error(`Search error: ${err}`);
    } finally {
      resultsWrapper.innerHTML = finallyContent || 'Nothing found';
    }
  }, 1200);
};

const arrCheckboxes = [...document.querySelectorAll('input[type=checkbox]')];

function checkedOption() {
  const checkedOptionsArr = [];

  for (let i = 0; i < arrCheckboxes.length; i += 1) {
    if (arrCheckboxes[i].checked) {
      checkedOptionsArr.push(arrCheckboxes[i].value);
    }
  }

  return checkedOptionsArr;
}

/* ----------------------------------------------
 * RegExp search
 */

function searchInFile(fileContent, options) {
  const resultLists = [];

  options.forEach((regName) => {
    const optionList = document.createElement('ul');
    const li = document.createElement('li');
    const mathArr = fileContent.match(regExps[regName]);

    console.log(`resultLists `, resultLists); // TODO:

    if (mathArr) {
      optionList.append(
        `<h3>${regName[0].toUpperCase() + regName.slice(1)}</h3>`
      );

      mathArr.forEach((math) => {
        li.innerText = math;
        optionList.append(li);
      });

      resultLists.push(optionList);
    }
  });

  return resultLists;
}

/* ----------------------------------------------
 * Footer time
 */

let footerHours = document.querySelector('.footer__hours');
let footerMinutes = document.querySelector('.footer__minutes');
let footerSeconds = document.querySelector('.footer__seconds');

setHours();
setMinutes();
setSeconds();

const MS_IN_SEC = 1000;
const SEC_IN_MIN = MS_IN_SEC * 60;
const MIN_IN_HOUR = SEC_IN_MIN * 60;

setInterval(setHours, MIN_IN_HOUR);
setInterval(setMinutes, SEC_IN_MIN);
setInterval(setSeconds, MS_IN_SEC);

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
