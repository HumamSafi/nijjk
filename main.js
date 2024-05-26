// setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Humam Safi`;

// setting game option
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// manage word
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function genrateInput() {
  const inputContainer = document.querySelector(".inputs");

  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) {
      tryDiv.classList.add("disabled-inputs");
    }

    // creat inputs
    for (let j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", 1);
      tryDiv.appendChild(input);
    }

    inputContainer.appendChild(tryDiv);
  }
  inputContainer.children[0].children[1].focus();

  // disabled all inputs except first one
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert Input To Uppercase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      // console.log(index);
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (event) {
      // console.log(event);
      const currentIndex = Array.from(inputs).indexOf(event.target); // Or this
      // console.log(currentIndex);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);
console.log(wordToGuess);
function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputFeild = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputFeild.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    //game logic
    if (actualLetter === letter) {
      // letter in correct place
      inputFeild.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // letter isn't in correct place but in word
      inputFeild.classList.add("not-in-place");
      successGuess = false;
    } else {
      // letter is wrong
      inputFeild.classList.add("wrong");
      successGuess = false;
    }
  }

  // check if user win or lose
  if (successGuess) {
    if (numberOfHints === 2) {
      messageArea.innerHTML = `You Win! And You Didn't Use Hints! <span>You Took ${currentTry}Try  </span>`;
    } else {
      messageArea.innerHTML = `You Win! <span>You Took ${currentTry}Try </span>`;
    }

    //Add  disabled class to all try divs
    let allTreis = document.querySelectorAll(".inputs > div");
    allTreis.forEach((tryDiv) => {
      tryDiv.classList.add("disabled-inputs");
    });
    // Disabeled guess button
    guessButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `Game Over You Lose! <span><button class="again">Try Again</button></span>`;
      document.querySelector(".again").onclick = function () {
        window.location.reload();
      };
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enableInputs = document.querySelectorAll("input:not([disabled])");

  const embtyEnableInputs = Array.from(enableInputs).filter(
    (input) => input.value === ""
  );

  if (embtyEnableInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * embtyEnableInputs.length);
    const randomInput = embtyEnableInputs[randomIndex];
    const indexToFill = Array.from(enableInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackSpace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackSpace);

window.onload = function () {
  genrateInput();
};
