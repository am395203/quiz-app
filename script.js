'use strict';
//https://opentdb.com/api.php?amount=10&type=multiple
//https://opentdb.com/api.php?amount=1&type=multiple

const quizQuestion = document.querySelector(".quiz-question");
const questionSubject = document.querySelector(".question-subject");
const questionDifficulty = document.querySelector(".question-difficulty");
let ansBtn = document.querySelector(".answers");
const nextBtn = document.querySelector(".next-btn");
let ansArr;
let qset;

let currentQuestionIndex = 0;
let score = 0;


function startQuiz(){
    nextBtn.style.display = "none";
    currentQuestionIndex = 0;
    score = 0;
    nextBtn.innerHTML = "Next";

    loadQuestion();
}

async function loadQuestion(){

    const apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

    try{
        const response = await fetch(`${apiUrl}`);

        if(!response.ok){
            throw new Error("Unable to fetch quiz data");
        }
        const data = await response.json();
        qset = data;
        showQuestion(data);

    } catch(error){
        console.log(error);
    }
}

//the Durstenfeld shuffle, an optimized version of Fisher-Yates
function shuffle(answers){

    for(let i = answers.length-1; i > 0; i--){
        
        const j = Math.floor(Math.random() * (i+1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
}

function showQuestion(data){
    let curr = data.results[currentQuestionIndex];
    let questionNumber = currentQuestionIndex + 1;
    //console.log(qset);
    //console.log(curr);

    //updating question, difficult, subject, etc.
    quizQuestion.innerHTML = `${questionNumber}. ${curr.question}`;
    questionSubject.innerHTML = `${curr.category}`;
    questionDifficulty.innerHTML = `${curr.difficulty}`;
    
    //correct/incorrect concatinated into 1 array then shuffled
    ansArr = curr.incorrect_answers.concat(curr.correct_answer);
    shuffle(ansArr);

    //adding answer buttons
    ansArr.forEach(element => {
        const button = document.createElement("button");
        button.innerHTML = element;
        button.classList.add("btn");
        ansBtn.appendChild(button);

        button.addEventListener("click", (e) => {selectAnswer(e,curr.correct_answer)});

    });
}

function resetState(){
    nextBtn.style.display = "none";
    while(ansBtn.firstChild){
        ansBtn.removeChild(ansBtn.firstChild);
    }
}

function selectAnswer(e, ans){

    const selected = e.target;

    if(selected.innerHTML === ans){
        selected.classList.add("correct");
        score++;
    }
    else{
        selected.classList.add("incorrect");
    }
    //console.log(selected.innerHTML);
    //console.log(ans);

    Array.from(ansBtn.children).forEach(button => {
        //console.log(button.innerHTML);
        if(button.innerHTML === ans){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextBtn.style.display = "block";
}

function showScore(){
    resetState();
    quizQuestion.innerHTML = `You scored ${score} out of 10.`;
    nextBtn.innerHTML = "Play Again";
    nextBtn.style.display = "block";
    questionSubject.innerHTML = "";
    questionDifficulty.innerHTML = "";
}

function handleNext(){
    currentQuestionIndex++;
    if(currentQuestionIndex < 10){
        resetState();
        showQuestion(qset);
    }
    else{
        showScore();
    }
}

nextBtn.addEventListener("click", ()=>{
    if(currentQuestionIndex <= 10){
        handleNext();
    }
    else{
        startQuiz();
    }
});

startQuiz();
