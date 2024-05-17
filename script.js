'use strict';
//https://opentdb.com/api.php?amount=10&type=multiple

const quizQuestion = document.querySelector(".quiz-question");
const questionSubject = document.querySelector(".question-subject");
const questionDifficulty = document.querySelector(".question-difficulty");
const ansBtn = document.querySelector(".answers");
const nextBtn = document.querySelector(".next-btn");

let currentQuestionIndex = 0;
let score = 0;


function startQuiz(){

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

        showQuestion(data.results[0]);

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

    let questionNumber = currentQuestionIndex + 1;
    console.log(data);

    //updating question, difficult, subject, etc.
    quizQuestion.innerHTML = `${questionNumber}. ${data.question}`;
    questionSubject.innerHTML = `${data.category}`;
    questionDifficulty.innerHTML = `${data.difficulty}`;
    
    //correct/incorrect concatinated into 1 array then shuffled
    let ansArr = data.incorrect_answers.concat(data.correct_answer);
    shuffle(ansArr);

    //adding answer buttons
    ansArr.forEach(element => {
        const button = document.createElement("button");
        button.innerHTML = element;
        button.classList.add("btn");
        ansBtn.appendChild(button);

        
        //button.addEventListener("click",selectAnswer);



    });
}

function resetState(){
    while(ansBtn.firstChild){
        ansBtn.removeChild(ansBtn.firstChild);
    }
}

function selectAnswer(e){
    const selected = e.target;
    //const isCorrect = ;
}

startQuiz();
