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
  phone: /((\+7|-7|7|8)+([0-9]){10})/g,
  date: /\d{4}-([0][0-9]|[1][012])-([0-2][0-9]|3[01])/g,
  email: /([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}/g,
  url: /(https?|ftp|file):\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/g,
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
    let finallyContent = document.createElement('div');

    try {
      if (options.length) {
        const searchResult = searchInFile(fileContent, options);

        if (searchResult) {
          searchResult.forEach((list) => {
            console.log('list ', list);
            finallyContent.append(list);
          });
        }
      } else {
        finallyContent.append('Nothing found');
      }
    } catch (err) {
      finallyContent.append('Something go wrong. Try again 😕');
      console.error(`Search error: ${err}`);
    } finally {
      console.log('finallyContent ', finallyContent);
      resultsWrapper.innerHTML = '';
      resultsWrapper.append(finallyContent || '<div>Nothing found</div>');
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
    const matchArr = fileContent.match(regExps[regName]);

    if (matchArr) {
      optionList.style.marginBottom = '1em';
      optionList.append(`${regName[0].toUpperCase() + regName.slice(1)}s`);

      matchArr.forEach((match) => {
        const li = document.createElement('li');

        li.innerText = match;
        optionList.append(li);
      });

      resultLists.push(optionList);
    }
  });

  return resultLists.length ? resultLists : null;
}

/* ----------------------------------------------
 * Footer time
 */

const footerHours = document.querySelector('.footer__hours');
const footerMinutes = document.querySelector('.footer__minutes');
const footerSeconds = document.querySelector('.footer__seconds');

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
