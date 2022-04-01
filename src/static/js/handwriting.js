/* ---------------
 *  HANDWRITING RECOGNITION
 * ---------------*/
import MyScript from './myscript.esm.js';
import { addInterpretation } from "./requestHandler.js";

const msappCookie = "myscript-app";
const mshmacCookie = "myscript-hmac";

const editor = document.querySelector("#editor");

var appkeyinput = document.querySelector("#appkey");
var hmackeyinput = document.querySelector("#hmackey");
var keystatus = document.querySelector("#keystatus");

appkeyinput.value = localStorage.getItem(msappCookie);
hmackeyinput.value = localStorage.getItem(mshmacCookie);

function registerMyScript() {
    if (appkeyinput.value && hmackeyinput.value) {
        MyScript.register(editor, {
            recognitionParams: {
                type: 'TEXT',
                server: {
                    applicationKey: appkeyinput.value,
                    hmacKey: hmackeyinput.value
                }
            }
        });
        keystatus.classList.remove("fail");
        keystatus.classList.add("success");
    } else {
        console.log('Missing MyScript keys.');
        keystatus.classList.remove("success");
        keystatus.classList.add("fail");
    }
}

function updateKeys() {
    if (appkeyinput.value && hmackeyinput.value) {
        localStorage.setItem(msappCookie, appkeyinput.value);
        localStorage.setItem(mshmacCookie, hmackeyinput.value);
        registerMyScript();
    }
}

updateKeys();
document.querySelector("#keys").onclick = updateKeys;

/* ---------------
 *  HANDWRITING SUBMISSION
 * ---------------*/
function submit() {
    console.log("not implemented yet");
    //addInterpretation();
}

var next_btn = document.getElementById('next_btn');
next_btn.onclick = submit;
