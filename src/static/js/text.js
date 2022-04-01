import { addInterpretation } from "./requestHandler.js";

/* ---------------
 *  TEXT SUBMISSION
 * ---------------*/
var next_btn = document.getElementById('next_btn');

function submit() {
    var input = document.getElementById('input_text').value;
    addInterpretation(input);
}

next_btn.onclick = submit;