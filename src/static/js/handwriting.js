/* ---------------
 *  HANDWRITING RECOGNITION
 * ---------------*/
import { log } from "./logging.js";
import MyScript from './myscript.esm.js';
import { addInterpretation } from "./requestHandler.js";
import { getUrl } from "./util.js";

const msappCookie = "myscript-app";
const mshmacCookie = "myscript-hmac";

const editor = document.querySelector("#editor");
const resultElement = document.getElementById('export-result');
const undoElement = document.getElementById('undo');
const redoElement = document.getElementById('redo');
const clearElement = document.getElementById('clear');

editor.addEventListener('changed', (event) => {
    undoElement.disabled = !event.detail.canUndo;
    redoElement.disabled = !event.detail.canRedo;
    clearElement.disabled = event.detail.isEmpty;
});

editor.addEventListener('exported', (evt) => {
    if (evt.detail) {
        addInterpretation(evt.detail["exports"]["text/plain"]);
    } else {
        resultElement.innerHTML = '';
    }
});
undoElement.addEventListener('click', () => {
    editor.editor.undo();
});
redoElement.addEventListener('click', () => {
    editor.editor.redo();
});
clearElement.addEventListener('click', () => {
    editor.editor.clear();
});

var keystatus = document.querySelector("#keystatus");

async function getKeys() {
    var keysResp = await fetch(getUrl("myscript/keys"));
    return await keysResp.json();
}

function registerMyScript(keys) {
    if (keys) {
        log(keys);
        MyScript.register(editor, {
            triggers: {
                exportContent: 'DEMAND'
            },
            recognitionParams: {
                type: 'TEXT',
                server: keys
            }
        });
        if (keystatus) {
            keystatus.classList.remove("fail");
            keystatus.classList.add("success");
        }
    } else {
        log('Missing MyScript keys.');
        if (keystatus) {
            keystatus.classList.remove("success");
            keystatus.classList.add("fail");
        }
    }
}

async function initMyScript() {
    var keys = await getKeys();
    registerMyScript(keys);
}

initMyScript();
// document.querySelector("#keys").onclick = updateKeys;

/* ---------------
 *  HANDWRITING SUBMISSION
 * ---------------*/
function submit() {
    log("not implemented yet");
    editor.editor.export_();
}

var next_btn = document.getElementById('next_btn');
next_btn.onclick = submit;
