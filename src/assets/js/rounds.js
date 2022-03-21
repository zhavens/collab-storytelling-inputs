/* ---------------
 *  ROUNDS
 * ---------------*/

var maxRounds = 4;
var startText = document.getElementById('start_text');
var endRoundBtn = document.querySelector('#end_round_btn');

ready = function getStartText() {
    if (startText == null) {
        return;
    }
    
    var round = localStorage.getItem("round");
    if (round == null || parseInt(round) > maxRounds) {
        localStorage.setItem("round", 1);
    }

    round = parseInt(localStorage.getItem("round"));

    if (round == 1) {
        startText.textContent = "Collaborative Storytelling";
    } else {
        startText.textContent = "ROUND " + round;
    }
    console.log('Starting Round ' + round);
}
document.addEventListener("DOMContentLoaded", ready);

function updateRound() {
    var round = parseInt(localStorage.getItem("round"));
    round++;
    localStorage.setItem("round", round);
}

function startRound() {
    console.log(new Date().getTime());
}
