import { log } from "./logging.js";
/* ---------------
 *  ROUNDS
 * ---------------*/

var startBtn = document.getElementById("start_link");
var submitBtn = document.getElementById("submit_btn");
var nextBtn = document.getElementById("next_btn_link");

if(startBtn != null) {
    startBtn.onclick = startRound;
}

if(submitBtn != null) {
    submitBtn.onclick = setPseudonym;
}

if(nextBtn != null) {
    nextBtn.onclick = updateRound;
}


var maxRounds = 4;
var endRoundBtn = document.querySelector('#end_round_btn');
var inputVersions = {
    text: "text-input.html",
    speech: "speech-recognition.html",
    handwriting: "handwriting-recognition.html",
}
var inputVersion = "text"; 
localStorage.setItem("inputVersion", inputVersion);

function setVersion() {
    log("Set version to: " + inputVersion);
    var nextLink = document.getElementById('start_link');
    nextLink.href = inputVersions[inputVersion];
}

function setPseudonym() {
    var pseudonymInput = document.getElementById("code_name").value;
    console.log(pseudonymInput);
    if(pseudonymInput != ""){
        localStorage.setItem("pseudonym", pseudonymInput);
        log("Pseudonym: " + pseudonymInput);
        console.log("here");
        showStartButton();
    }
}

function showNameForm() {
    var nameForm = document.getElementById('name_form');
    var nextBtn = document.getElementById('next_btn');
    nameForm.style.display = "block";
    nextBtn.style.display = "none";
}

function showStartButton() {
    var nameForm = document.getElementById('name_form');
    var nextBtn = document.getElementById('next_btn');
    nameForm.style.display = "none";
    nextBtn.style.display = "block";
}

const ready = function getStartText() {
    var startText = document.getElementById('start_text');
    if (startText == null) {
        return;
    }
    
    var round = localStorage.getItem("round");
    if (round == null || parseInt(round) > maxRounds) {
        localStorage.clear();
        localStorage.setItem("round", 1);
        localStorage.setItem("pseudonym", null);
    }

    round = parseInt(localStorage.getItem("round"));
    if (round == 1) {
        startText.textContent = "Collaborative Storytelling";
    } else {
        startText.textContent = "ROUND " + round;
    }
    log('About to Start Round ' + round);

    if(localStorage.getItem("pseudonym") != "null") {
        showStartButton();
    } else {
        showNameForm();
    }
    setVersion();
}
document.addEventListener("DOMContentLoaded", ready);

function updateRound() {
    var round = parseInt(localStorage.getItem("round"));
    round++;
    localStorage.setItem("round", round);
}

function startRound() {
    console.log("Start");
    var round = parseInt(localStorage.getItem("round"));
    log("Round " + round + " : " + new Date().getTime());
}
