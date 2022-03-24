/* ---------------
 *  SPEECH RECOGNITION
 * ---------------*/

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

var startbtn = document.querySelector('#start_rec');
var stopbtn = document.querySelector('#stop_rec');

function startrecognition() {
    recognition.start();
    console.log('Starting recognition.');
}

function stoprecognition() {
    recognition.stop();
    console.log('Stopping recognition.')
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

    console.log('Result: ' + speech_result.transcript +
        ' | Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function () {
    stoprecognition();
}

recognition.onnomatch = function (event) {
    console.log("No matching grammar.");
}

recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error);
}

startbtn.onclick = startrecognition;
stopbtn.onclick = stoprecognition;

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