const wordInput = document.querySelector(".word-input-element");
const root = document.getElementById("result-root");
const themeBtn = document.querySelector(".mode-btn");
const formEl = document.querySelector(".form-1");
const themeContainer = document.querySelector(".theme-container");
const deafultAccentSelect = document.querySelector(
  ".select-default-pronounciation"
);
const spinner = document.querySelector(".loader-book");

/******************  GLOBAL VARIABLE  ******************/
let resultTemplate = {
  word: "",
  phonetics: [
    {
      text: "",
      audio: "",
    },
    {
      text: "",
      audio: "",
    },
  ],
  meanings: [],
};
let meaningsTemplate = {
  partOfSpeech: "",
  definitions: [],
  synonyms: [],
};
let accentUs = true;
/******************  Funtions  ******************/
async function getWord(word) {
  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const result = await fetch(url);
    const data = await result.json();

    return data;
  } catch (error) {
    return "error";
  }
}
function createClone(data) {
  // this is where cloning  happens
  try {
    const resultObj = [];

    data.forEach((element) => {
      resultTemplate.word = element.word;
      resultTemplate.phonetics = element.phonetics.map((val) => {
        return { text: val.text, audio: val.audio };
      });

      meaningsTemplate = element.meanings.map((val) => {
        defs = val.definitions.map((def) => def.definition);
        return {
          partOfSpeech: val.partOfSpeech,
          defs,
          synonyms: val.synonyms,
        };
      })[0];

      resultTemplate.meanings.push(meaningsTemplate);

      // all of the word's objects
      resultObj.push(JSON.parse(JSON.stringify(resultTemplate)));

      //clean result template
      resultTemplate = {
        word: "",
        phonetics: [
          {
            text: "",
            audio: "",
          },
          {
            text: "",
            audio: "",
          },
        ],
        meanings: [],
      };
    });

    return resultObj;
  } catch (error) {
    return "not found";
  }
}

function createHTMLElement(data) {
  let HTML_Template_Str = "";
  data.forEach((element, index) => {
    /*************** funtions ***************/
    const crSelect = (index) => {
      if (element.phonetics.length === 0) {
        return "";
      }
      return `
      <select class = "selectors select-style" id="select-${index}" data-id="${index}">
          <option value="us" ${accentUs ? "selected" : ""}>us</option>
          <option value="uk" ${!accentUs ? "selected" : ""}>uk</option>
        </select>`;
    };

    const crAudioBtn = (index) => {
      if (element.phonetics.length > 1) {
        return ` <button class="btn-audio  audio-btns" id="btn-${index}" data-id = "${index}"><svg class = "play-svg" xmlns="http://www.w3.org/2000/svg" width="9.739" height="11.082" viewBox="0 0 9.739 11.082">
  <path class = "svg-fill" id="play-svgrepo-com" d="M0,6.24V16.311a.483.483,0,0,0,.25.433.488.488,0,0,0,.266.067.417.417,0,0,0,.233-.067l8.723-5.028a.5.5,0,0,0,0-.883L.75,5.806A.5.5,0,0,0,0,6.239Z" transform="translate(0 -5.729)" fill="#a11a0f"/>
</svg>
</button>
        <audio src="${
          accentUs ? element.phonetics[1].audio : element.phonetics[0].audio
        }" id="audio-${index}" class = "audios" data-us = "${
          element.phonetics[1].audio ?? ""
        }" data-uk = "${element.phonetics[0].audio ?? ""}"></audio>`;
      } else if (element.phonetics.length === 1) {
        return ` <button class="btn-audio  audio-btns" id="btn-${index}" data-id = "${index}"><svg class = "play-svg" xmlns="http://www.w3.org/2000/svg" width="9.739" height="11.082" viewBox="0 0 9.739 11.082">
  <path class = "svg-fill" id="play-svgrepo-com" d="M0,6.24V16.311a.483.483,0,0,0,.25.433.488.488,0,0,0,.266.067.417.417,0,0,0,.233-.067l8.723-5.028a.5.5,0,0,0,0-.883L.75,5.806A.5.5,0,0,0,0,6.239Z" transform="translate(0 -5.729)" fill="#a11a0f"/>
</svg>
</button>
        <audio src="${
          element.phonetics[0].audio
        }" id="audio-${index}" data-us = ""  data-uk = "${
          element.phonetics[0].audio ?? ""
        }"></audio>`;
      } else return "";
    };
    const crPhenome = (index) => {
      if (element.phonetics.length > 1) {
        return `<p class="phenome" id="phenome-${index}" data-us = "${
          element.phonetics[1].text ?? ""
        }" data-uk = "${element.phonetics[0].text ?? ""}" >${
          accentUs
            ? element.phonetics[1].text ?? ""
            : element.phonetics[0].text ?? ""
        }</p>`;
      } else if (element.phonetics.length === 1) {
        return `<p class="phenome" id="phenome-${index}" data-us = "" data-uk = "${
          element.phonetics[0].text ?? ""
        }">${element.phonetics[0].text ?? ""}</p>`;
      } else return "";
    };
    const crSynonym = (val) => {
      if (val.synonyms.length === 0) {
        return ``;
      }
      let button_template = ``;
      val.synonyms.forEach((syn) => {
        button_template += `<button class="btn-search-word">${syn}</button>`;
      });
      return `
      <div class="synonyms-container">
      <p class="synonyms-word">Synonyms</p>
      <div class="synosyms-btn-container">
        ${button_template}
      </div>
    </div>`;
    };
    /*************** templates ***************/

    let template_2 = `
    <div class="word-phenome-accent-container">
    <div class="word-phenome-selection-container">
      <div class="word-selection-container">
        <div class="word-phenome-container">
          <p class="word">${element.word}</p>
          ${crPhenome(index)}
        </div>
        <div class = "selection-super_script">${crSelect(index)}</div>
      </div>
      <div class="audio-btn-container">
       ${crAudioBtn(index)}
      </div>
    </div>
  </div>`;

    let meaning_template = ``;
    element.meanings.forEach((val) => {
      let def_li_template = "";

      val.defs.forEach((def) => {
        def_li_template += ` <li class = "meaning-li">${def}</li>`;
      });

      let template_3 = `
      <div class="meanings-container">
      <div class="part_of_speech-line-container">
        <p class="part_of_speech">${val.partOfSpeech}</p>
        <hr class="horizontal-line">
      </div>
      <p class="meaning-word">meaning</p>
      <div class="defintions-contianer">
        <ul class = "meaning-lists">
          ${def_li_template}
        </ul>
      </div>
     ${crSynonym(val)}
    </div>
      `;
      meaning_template += template_3;
    });

    /*************** all templates ***************/
    HTML_Template_Str += `<div class ="entiner-word-unit-container">${
      template_2 + meaning_template
    }</div>`;
  });
  return HTML_Template_Str;
}
async function searchHandler() {
  // spinner.start
  spinner.classList.add("spin");
  root.innerHTML = "";
  let word = wordInput.value.trim(); // accept word from a user

  // if there is no word return
  if (word === "") {
    spinner.classList.remove("spin");
    return;
  }
  const data = await getWord(word); // get definitons from api

  if (data === "error") {
    root.innerHTML = `<div id="network-error">network error</div>`;
    spinner.classList.remove("spin");
    return;
  }

  const clonedData = createClone(data); // create clone to simplfy data
  if (clonedData === "not found") {
    root.innerHTML = ` <div id="notfound">Word not found</div>`;
    spinner.classList.remove("spin");
    return;
  }
  const HTML_element = createHTMLElement(clonedData); // returns an string of an html
  root.innerHTML = HTML_element;
  searchWordBtnHandler();
  selectHandler();
  playBtnHandler();
  wordFontSizeHanlder();
  // spinner.stop
  spinner.classList.remove("spin");
}
function searchWordBtnHandler() {
  const btns = document.querySelectorAll(".btn-search-word");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      wordInput.value = btn.textContent;
      formEl["form-submit-btn"].click();
    });
  });
}

function selectHandler() {
  const selectors = document.querySelectorAll(".selectors");

  selectors.forEach((select) => {
    let index = select.getAttribute("data-id");
    let audioEl = document.getElementById(`audio-${index}`);
    let buttonEl = document.getElementById(`btn-${index}`);

    let us_audio = audioEl.getAttribute("data-us");
    let uk_audio = audioEl.getAttribute("data-uk");

    //new
    let phenomeEl = document.getElementById(`phenome-${index}`);
    let us_phenome = phenomeEl.getAttribute("data-us");
    let uk_phenome = phenomeEl.getAttribute("data-uk");
    if (us_audio === "" && uk_audio === "") {
      select.remove();
      buttonEl.remove();
      return;
    }

    if (us_audio === "") {
      select.remove();
      audioEl.setAttribute("src", uk_audio);
      phenomeEl.textContent = uk_phenome;
      return;
    }

    if (uk_audio === "") {
      select.remove();
      audioEl.setAttribute("src", us_audio);
      phenomeEl.textContent = us_phenome;
      return;
    }

    select.addEventListener("input", (event) => {
      if (event.target.value === "us") {
        audioEl.setAttribute("src", us_audio);
        phenomeEl.textContent = us_phenome;
      }
      if (event.target.value === "uk") {
        audioEl.setAttribute("src", uk_audio);
        phenomeEl.textContent = uk_phenome;
      }
    });
  });
}

function playBtnHandler() {
  const audioBtns = document.querySelectorAll(".audio-btns");
  audioBtns.forEach((audioBtn) => {
    let index = audioBtn.getAttribute("data-id");
    audioBtn.addEventListener("click", () => {
      document.getElementById(`audio-${index}`).play();
    });
  });
}

function setTheme(theme) {
  if (theme === "dark") {
    document.querySelector(".day-svg").style.display = "none";
    document.querySelector(".night-svg").style.display = "";
    themeBtn.classList.remove("active");
    //  root el
    document.documentElement.style.setProperty("--primary-color", "#ffffff");
    document.documentElement.style.setProperty("--body-color", "#000000");
    document.documentElement.style.setProperty("--accent-color", "#fdc565");
    document.documentElement.style.setProperty("--line-color", "#373737");
    document.documentElement.style.setProperty("--search-btn-color", "#363636");
  } else if (theme === "light") {
    document.querySelector(".day-svg").style.display = "";
    document.querySelector(".night-svg").style.display = "none";
    themeBtn.classList.add("active");
    //  root el
    document.documentElement.style.setProperty("--primary-color", "#000000");
    document.documentElement.style.setProperty("--body-color", "#ffffff");
    document.documentElement.style.setProperty("--accent-color", "#262a38");
    document.documentElement.style.setProperty("--line-color", "#f0f0f0");
    document.documentElement.style.setProperty("--search-btn-color", "#f0f0f0");
  }
}
function themeBtnHandler() {
  themeBtn.classList.toggle("active");
  if (themeBtn.classList.contains("active")) {
    localStorage.setItem("theme", "light");
    setTheme("light");
  } else {
    localStorage.setItem("theme", "dark");
    setTheme("dark");
  }
}

function deafultAccentHandler() {
  let accent = deafultAccentSelect.value;
  if (accent === "us") {
    accentUs = true;
    localStorage.setItem("accent", "us");
  } else if (accent === "uk") {
    accentUs = false;
    localStorage.setItem("accent", "uk");
  }

  formEl["form-submit-btn"].click();
}

function windowLoadHandler() {
  // theme
  let theme = localStorage.getItem("theme");
  if (theme) {
    setTheme(theme);
  } else {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  }
  // accent
  let accent = localStorage.getItem("accent");

  if (accent) {
    if (accent === "us") {
      accentUs = true;
      deafultAccentSelect.value = "us";
    } else {
      accentUs = false;
      deafultAccentSelect.value = "uk";
    }
  } else {
    localStorage.setItem("accent", "us");
    accentUs = true;
    deafultAccentSelect.value = "us";
  }
}

function wordFontSizeHanlder() {
  const words = document.querySelectorAll(".word");
  words.forEach((word) => {
    let wordLength = word.textContent.length;
    word.style.fontSize = `${4 / Math.log(wordLength)}rem`;
  });
}
/******************  EVENT LISTENERS  ******************/
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  searchHandler();
});
themeBtn.addEventListener("click", themeBtnHandler);
window.addEventListener("load", windowLoadHandler);
deafultAccentSelect.addEventListener("input", deafultAccentHandler);
