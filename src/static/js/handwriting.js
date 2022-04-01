/* ---------------
 *  HANDWRITING RECOGNITION
 * ---------------*/
import MyScript from './myscript.esm.js';

const msappCookie = "myscript-app";
const mshmacCookie = "myscript-hmac";

const editor = document.querySelector("#editor");

var keystatus = document.querySelector("#keystatus");

async function getKeys() {
    var keysResp = await fetch("https://zhavens.com/hai/myscript/keys");
    return await keysResp.json();
}

function registerMyScript(keys) {
    if (keys) {
        console.log(keys);
        MyScript.register(editor, {
            recognitionParams: {
                type: 'TEXT',
                server: keys
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

async function initMyScript() {
    var keys = await getKeys();
    registerMyScript(keys);
}

initMyScript();
// document.querySelector("#keys").onclick = updateKeys;


