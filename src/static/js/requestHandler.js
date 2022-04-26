import { log } from "./logging.js";
import { getUrl } from "./util.js";

export async function addInterpretation(text) {
    var user = localStorage.getItem("pseudonym");
    var inputVersion = localStorage.getItem("versionInput");

    log("Add Interpretation: " + text);
    if (user == null) {
        log("Error: undefined user");
    } else if (inputVersion == null) {
        log("Error: undefined version");
    } else if (text == null) {
        // give some warning to the user
        log("Error: undefined text");
    } else {
        await fetch(getUrl("interpretations", user), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                input: inputVersion
            })
        });
    }
}

export async function addImage(image, outputVersion) {
    var user = localStorage.getItem("pseudonym");
    var inputVersion = localStorage.getItem("versionInput");
    var round = localStorage.getItem("round");

    log("Adding Canvas Image");
    if (user == null) {
        log("Error: undefined user");
    } else if (inputVersion == null) {
        log("Error: undefined input version");
    } else if (outputVersion == null) {
        log("Error: undefined output version");
    } else if (image == null) {
        log("Error: undefined image");
    } else if (round == null) {
        log("Error: undefined round");
    } else {
        await fetch(getUrl("images", user), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: image,
                inputVersion: inputVersion,
                outputVersion: outputVersion,
                round: round
            })
        });
    }
}

export async function getCategories() {
    var user = localStorage.getItem("pseudonym");

    return await fetch(getUrl("categories", user), {
        method: "GET"
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        return data;
    });
}

export async function getImageIntersection(currentImage, newPath, cx, cy) {
    log("Get Image Intersection: ");
    if (currentImage == null) {
        log("Error: undefined currentImage");
    } else if (newPath == null) {
        log("Error: undefined newPath");
    } else {
        return await fetch(getUrl("imageIntersection", currentImage, newPath, cx, cy), {
            method: "GET"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            log(data); // this will be a string
            return data;
        });
    }
    return;
}