var user = localStorage.getItem("pseudonym");

export async function log(msg) {
    var url = "https://zhavens.com/raquel/logging/"
    url += encodeURIComponent(user);
    await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                msg:msg
            })
        });
}

export async function getLogs() {
    var url = "https://zhavens.com/hai/logging/"
    url += encodeURIComponent(user);
    return await $.get(url);
}