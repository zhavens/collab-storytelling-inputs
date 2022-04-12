/* ---------------
 *  SPEECH RECOGNITION
 * ---------------*/
import { addInterpretation } from "./requestHandler.js";
import { log } from "./logging.js";
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
// recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var speech_result;
var recording = false;

var btn = document.querySelector('#rec');
var btnBackground = document.getElementById('rec_icon');
var icon = document.getElementById('rec_icon');

function speechClick() {
    recording = !recording;
    if (recording){
        startrecognition();
    } else {
        stoprecognition();
    }
}

function startrecognition() {
    recognition.start();
    log('Starting recognition.');
    icon.textContent = "radio_button_checked";
    btnBackground.classList.add("rec_btn_selected");
}

function stoprecognition() {
    recognition.stop();
    log('Stopping recognition.');
    icon.textContent = "fiber_manual_record";
    btnBackground.classList.remove("rec_btn_selected");
}

recognition.onresult = function (event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    speech_result = event.results[0][0];

    log('Result: ' + speech_result.transcript +
        ' | Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function () {
    stoprecognition();
}

recognition.onnomatch = function (event) {
    log("No matching grammar.");
}

recognition.onerror = function (event) {
    log('Error occurred in recognition: ' + event.error);
}

btn.onclick = speechClick;

/* ---------------
 *  SPEECH SYNTHESIS
 * ---------------*/
var synth = window.speechSynthesis;
var voiceselect = document.querySelector('#voice');
var speakbtn = document.querySelector('#play_rec');

function populateVoiceList() {
    var voices = synth.getVoices();

    for (const voice of synth.getVoices()) {
        if (voice.lang.includes('en-')) {
            var option = document.createElement('option');
            option.textContent = voice.name + ' (' + voice.lang + ')';

            if (voice.default) {
                option.textContent += ' -- DEFAULT';
            }

            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            voiceselect.appendChild(option);
        }
    }
}

function speak() {
    var utterThis = new SpeechSynthesisUtterance(speech_result.transcript);
    var selectedOption = voiceselect.selectedOptions[0].getAttribute('data-name');
    for (const voice of synth.getVoices()) {
        if (voice.name === selectedOption) {
            utterThis.voice = voice;
        }
    }
    // utterThis.pitch = pitch.value;
    // utterThis.rate = rate.value;
    synth.speak(utterThis);
}

populateVoiceList();
speakbtn.onclick = speak;
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

/* ---------------
 *  SPEECH SUBMISSION
 * ---------------*/
function submit() {
    addInterpretation(speech_result.transcript);
}

var next_btn = document.getElementById('next_btn');
next_btn.onclick = submit;