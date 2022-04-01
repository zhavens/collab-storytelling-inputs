/* ---------------
 *  ROUNDS
 * ---------------*/

var maxRounds = 4;
var endRoundBtn = document.querySelector('#end_round_btn');
var inputVersions = {
    text: "text-input.html",
    speech: "speech-recognition.html",
    handwriting: "handwriting-recognition.html",
}
var inputVersion = "speech"; 
localStorage.setItem("inputVersion", inputVersion);

function setVersion() {
    console.log("Set version to: " + inputVersion);
    var nextLink = document.getElementById('next_link');
    nextLink.href = inputVersions[inputVersion];
}

function setPseudonym() {
    pseudonymInput = document.getElementById("code_name").value;
    if(pseudonymInput != ""){
        localStorage.setItem("pseudonym", pseudonymInput);
        console.log("Pseudonym: " + pseudonymInput);
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

ready = function getStartText() {
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
    console.log('About to Start Round ' + round);

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
    var round = parseInt(localStorage.getItem("round"));
    console.log("Round " + round + " : " + new Date().getTime());
}
