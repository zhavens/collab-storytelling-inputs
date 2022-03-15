/* ---------------
 *  ROUNDS
 * ---------------*/

var round = 1;
var max_rounds = 4;

var start_text = document.getElementById('start_text');
var end_round_btn = document.querySelector('#end_round_btn');

window.onload = function getStartText() {
    if(round == 1) {
        start_text.textContent = "Collaborative Storytelling"
    } else {
        start_text.textContent = "ROUND " + round;
    }
}

function updateRound() {
    round++;
}

end_round_btn.onclick = updateRound;
