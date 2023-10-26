const questions = [
    {
        question: "How was your overall experience?",
        answers: [
            { text: "Very Good" },
            { text: "Good" },
            { text: "Poor" },
            { text: "Very Poor" },
        ]
    },
    {
        question: "How did you find out about this website?",
        answers: [
            { text: "Advertisement" },
            { text: "Friends/Family" },
            { text: "College" },
            { text: "Other" }
        ]
    },
    {
        question: "Would you recommend this website to anyone?",
        answers: [
            { text: "Very Likely" },
            { text: "Likely" },
            { text: "Not Likely" },
            { text: "Not Very Likely" },
        ]
    },
    {
        question: "Any Suggestions?"
    },
];

const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.style.display = "block";
        nextButton.innerHTML="Submit";
        const suggestionTextarea = document.createElement("textarea");
        suggestionTextarea.id = "suggestion";
        suggestionTextarea.placeholder = "Your suggestions...";
        answerButton.appendChild(suggestionTextarea);
    }
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        button.addEventListener("click", selectAnswer);
    });

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.style.display = "block";
    }
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButton.firstChild) {
        answerButton.removeChild(answerButton.firstChild);
    }
}

function selectAnswer(e) {
    const selectionBtn = e.target;
    Array.from(answerButton.children).forEach(button => {
        button.classList.remove("selected");
    });
    selectionBtn.classList.add("selected");
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        location.replace("https://fossevents2.netlify.app/");
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();
