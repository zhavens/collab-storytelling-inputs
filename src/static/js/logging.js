import { getUrl } from "./util.js";

var user = localStorage.getItem("pseudonym");

export async function log(msg) {
    var url = getUrl("logging", user);
    await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            msg: msg
        })
    });
}

export async function getLogs() {
    var url = getUrl("logging", user);
    url += encodeURIComponent(user);
    return await $.get(url);
}