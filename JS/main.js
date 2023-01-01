//Selectors
let questionCounter = document.querySelector(".quiz-container .counter span");
let bullets = document.querySelector(".quiz-container .countdown .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let countDown = document.querySelector(".countdown");
let results = document.querySelector(".results");
let timer = document.querySelector(".timer");

//Functions
let currentIndex = 0;
let rightAnswersCounter = 0;
let countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText);
      createBullets(questions.length);

      addQuestionsData(questions[currentIndex], questions.length);
      console.log(questions);

      counterDown(10, questions.length);

      submitButton.onclick = () => {
        let rightAnswer = questions[currentIndex].right_answer;
        currentIndex++;

        checkAnswer(rightAnswer, questions.length);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionsData(questions[currentIndex], questions.length);

        lightBullet();

        clearInterval(countDownInterval);
        counterDown(10, questions.length);

        showResult(questions.length);
      };
    }
  };

  myRequest.open("Get", "questions.json", true);
  myRequest.send();
}

function createBullets(num) {
  questionCounter.innerHTML = num;

  for (i = 0; i < num; i++) {
    let myBulletSpan = document.createElement("span");
    if (i === 0) {
      myBulletSpan.className = "on";
    }
    bullets.appendChild(myBulletSpan);
  }
}

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    let theQuestion = document.createElement("h2");
    let myQuestionText = document.createTextNode(obj["title"]);

    theQuestion.appendChild(myQuestionText);
    quizArea.appendChild(theQuestion);

    //Create the Answers
    for (i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let myRadio = document.createElement("input");
      myRadio.name = "answer";
      myRadio.id = `answer-${i}`;
      myRadio.type = "Radio";
      myRadio.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        myRadio.checked = true;
      }

      let theLabel = document.createElement("Label");
      theLabel.htmlFor = `answer-${i}`;
      theLabel.textContent = obj[`answer_${i}`];

      mainDiv.appendChild(myRadio);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, cNumber) {
  let answers = document.getElementsByName("answer");
  let theChoice;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoice = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoice) {
    rightAnswersCounter++;
    console.log("Good you got it");
  }
}

function lightBullet() {
  let myBullet = document.querySelectorAll(".countdown .spans span");
  let theArrayedBullet = Array.from(myBullet);

  theArrayedBullet.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResult(count) {
  let theCorrectAnswer;

  if (currentIndex === count) {
    answersArea.remove();
    quizArea.remove();
    submitButton.remove();
    countDown.remove();

    if (rightAnswersCounter > count / 2 && rightAnswersCounter < count) {
      theCorrectAnswer = document.createElement("span");
      theCorrectAnswer.className = "good";
      theCorrectAnswer.textContent = `Good, you have got ${rightAnswersCounter} out of ${count}`;
    } else if (rightAnswersCounter === count) {
      theCorrectAnswer = document.createElement("span");
      theCorrectAnswer.className = "perfect";
      theCorrectAnswer.textContent = `Perfect, you have got ${rightAnswersCounter} out of ${count}`;
    } else {
      theCorrectAnswer = document.createElement("span");
      theCorrectAnswer.className = "bad";
      theCorrectAnswer.textContent = `Bad, you have got ${rightAnswersCounter} out of ${count}`;
    }

    results.appendChild(theCorrectAnswer);
    results.style.padding = "20px";
    results.style.marginTop = "10px";
    results.style.backgroundColor = "White";
  }
}

function counterDown(duration, count) {
  let minutes, seconds;

  if (currentIndex < count) {
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timer.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

getQuestions();
