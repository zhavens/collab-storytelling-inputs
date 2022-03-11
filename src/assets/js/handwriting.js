/* ---------------
 *  HANDWRITING RECOGNITION
 * ---------------*/
import Cookies from '../node_modules/js-cookie/dist/js.cookie.min.mjs';
import MyScript from '../node_modules/myscript/dist/myscript.esm.js';

const msappCookie = "myscript-app";
const mshmacCookie = "myscript-hmac";

const editor = document.querySelector("#editor");

var appkeyinput = document.querySelector("#appkey");
var hmackeyinput = document.querySelector("#hmackey");
var keystatus = document.querySelector("#keystatus");

appkeyinput.value = Cookies.get(msappCookie);
hmackeyinput.value = Cookies.get(mshmacCookie);

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
        Cookies.set(msappCookie, appkeyinput.value);
        Cookies.set(mshmacCookie, hmackeyinput.value);
        registerMyScript();
    }
}

updateKeys();
document.querySelector("#keys").onclick = updateKeys;


