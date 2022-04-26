/* ---------------
 *  SPEECH RECOGNITION
 * ---------------*/
import { log } from "./logging.js";
import { addInterpretation } from "./requestHandler.js";
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
var recording_time;

const HELD_TIMEOUT_MS = 1000;

var btn = document.querySelector('#rec_btn');
var btnBackground = document.getElementById('rec_btn');
var icon = document.getElementById('rec_icon');



function startrecognition() {
    recording_time = new Date();
    recognition.start();
    log('Starting recognition.');
    icon.textContent = "radio_button_checked";
    btn.classList.remove("btn-white");
    btn.classList.add("btn-red");
}

function stoprecognition() {
    recording_time = null;
    recognition.stop();
    log('Stopping recognition.');
    icon.textContent = "fiber_manual_record";
    btn.classList.remove("btn-red");
    btn.classList.add("btn-white");
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

btn.onmousedown = function () {
    recording = !recording;
    if (recording) {
        startrecognition();
    } else {
        stoprecognition();
    }
};

btn.onmouseup = () => {
    if (recording_time && (new Date() - recording_time) > HELD_TIMEOUT_MS) {
        stoprecognition();
    }
}

/* ---------------
 *  SPEECH SYNTHESIS
 * ---------------*/
var synth = window.speechSynthesis;
var voices
var voiceselect = document.querySelector('#voice');
var speakbtn = document.querySelector('#play_rec');

function loadVoicesWhenAvailable(onComplete = () => { }) {
    const v = synth.getVoices()

    if (v.length !== 0) {
        voices = v
        onComplete()
    } else {
        return setTimeout(function () { loadVoicesWhenAvailable(onComplete) }, 100)
    }
}

function populateVoiceList() {
    if (!synth) {
        alert("No synthesis support!");
    }

    var voices = synth.getVoices();


    for (const voice of voices) {
        // if (voice.lang.includes('en-')) {
        var option = document.createElement('option');
        option.textContent = voice.name + ' (' + voice.lang + ')';

        if (voice.default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceselect.appendChild(option);
        // }
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


// on document ready
loadVoicesWhenAvailable(function () {
    $("h1").text("loaded");
});

var next_btn = document.getElementById('next_btn');
next_btn.onclick = submit;