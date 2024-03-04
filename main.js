const loadedText = document.querySelector("#loaded-text");
const poster = document.querySelector("img");
const video = document.querySelector("video");
const type = document.querySelector("#type");

let charList;
let totalWords;
let charPos = 0;
let wordCount = 0;
let firstKey = true;

function getRandomObject(filters) {
  fetch("references.json")
    .then((response) => response.json())
    .then((data) => {
      let filteredData = data;
      console.log(filteredData);
      for (let key in filters) {
        let values = Array.isArray(filters[key])
          ? filters[key]
          : [filters[key]];
        filteredData = filteredData.filter((item) =>
          values.includes(item[key])
        );
      }
      return filteredData;
    })
    .then((fdata) => {
      if (fdata.length > 0) {
        option = fdata[Math.floor(Math.random() * fdata.length)];
        console.log(option);
        loadedText.innerText = option.quote;
        if (option.length === "short") {
          loadedText.style.textAlign = "center";
        }
        poster.src = option.posterURL;
        video.src = option.videoURL;
        charList = option.quote.split("");
        totalWords = option.quote.split(" ").length;
        console.log("done");
      } else {
        console.log("No items match the provided filters");
      }
    });
}

getRandomObject();

// new ambient
const canvas = document.querySelector("#js-canvas");
let step;

const context = canvas.getContext("2d");

context.filter = "blur(1px)";

function draw() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function drawLoop() {
  draw();
  step = window.requestAnimationFrame(drawLoop);
}

function drawPause() {
  window.cancelAnimationFrame(step);
  step = undefined;
}

function init() {
  video.addEventListener("loadeddata", draw, false);
  video.addEventListener("seeked", draw, false);
  video.addEventListener("play", drawLoop, false);
  video.addEventListener("pause", drawPause, false);
  video.addEventListener("ended", drawPause, false);
}

function cleanup() {
  video.removeEventListener("loadeddata", draw);
  video.removeEventListener("seeked", draw);
  video.removeEventListener("play", drawLoop);
  video.removeEventListener("pause", drawPause);
  video.removeEventListener("ended", drawPause);
}

window.addEventListener("load", init);
window.addEventListener("unload", cleanup);

// finsihed ambient

document.addEventListener("keydown", handleKeyPress);

function updateCompletedWords() {
  document.querySelector("#words-completed").innerText = `${wordCount}`;
}

let elapsed;

function updateTimer() {
  elapsed = Date.now() - startTime;
  const seconds = Math.floor(elapsed / 1000);
  const milliseconds = Math.floor((elapsed % 1000) / 10);
  document.querySelector("#timer").innerText = `${seconds}.${milliseconds}`;
}

function updateWpm() {
  const wpm = (wordCount / (elapsed / 1000 / 60)).toFixed(1);
  document.querySelector("#wpm").innerText = `${wpm}`;
}

function handleKeyPress(e) {
  const key = e.key;
  if (key === "/" || key === "'" || key === " ") {
    e.preventDefault();
  }

  if (firstKey && key === charList[charPos]) {
    startTime = Date.now();
    intervalTimerId = setInterval(updateTimer, 10);
    intervalWpmId = setInterval(updateWpm, 1000);
    firstKey = false;
  }

  if (key === charList[charPos]) {
    charPos++;
    if (key === " ") {
      wordCount++;
      updateCompletedWords();
      console.log("wordCount", wordCount);
    }
    if (charPos === charList.length) {
      clearInterval(intervalTimerId);
      wordCount++;
      clearInterval(intervalWpmId);
      updateWpm();
      updateCompletedWords();
      document.removeEventListener("keydown", handleKeyPress);
      console.log(wordCount / (elapsed / 1000 / 60));
    }
  } else if (key === "Backspace" && charPos > 0) {
    charPos--;
    if (charList[charPos] === " ") {
      wordCount--;
      updateCompletedWords();
    }
  }

  const completedText = charList.slice(0, charPos).join("");
  const remainingText = charList.slice(charPos).join("");
  loadedText.innerHTML = `<span class="completed">${completedText}</span><span class="remaining">${remainingText}</span>`;
}

// toggling buttons
let buttons = document.querySelectorAll(".toggle");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    if (this.style.backgroundColor === "rgb(0, 116, 217)") {
      this.style.backgroundColor = "";
    } else {
      this.style.backgroundColor = "rgb(0, 116, 217)";
    }
  });
});

// TODO: add actual filter functionality
