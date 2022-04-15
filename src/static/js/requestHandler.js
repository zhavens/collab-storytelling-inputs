import { log } from "./logging.js";
var user = localStorage.getItem("pseudonym");
var inputVersion = localStorage.getItem("inputVersion");
var round = localStorage.getItem("round");

export async function addInterpretation (text) {
    log("Add Interpretation: " + text);
    if(user == null) {
        log("Error: undefined user");
    } else if (inputVersion == null) {
        log("Error: undefined version");
    } else if (text == null) {
        // give some warning to the user
        log("Error: undefined text");
    } else {
        await fetch("https://zhavens.com/raquel/interpretations/" + user, {
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

export async function addImage (image, outputVersion) {
    log("Add Canvas Image: " + user);
    if(user == null) {
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
        await fetch("https://zhavens.com/raquel/images/" + user, {
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

export async function getCategories () {
    return await fetch("https://zhavens.com/hai/categories/" + user, {
        method: "GET"
    }).then(function(response) {
        return response.text();
    }).then(function(data) {
        log(data); // this will be a string
        return data;
    });
}

export async function getImageIntersection (currentImage, newPath, cx, cy) {
    log("Get Image Intersection: ");
    if (currentImage == null) {
        log("Error: undefined currentImage");
    } else if (newPath == null) {
        log("Error: undefined newPath");
    } else {
        var parameters = currentImage + "/" + newPath + "/" + cx + "/" + cy;
        return await fetch("https://zhavens.com/raquel/imageIntersection/" + parameters, {
            method: "GET"
        }).then(function(response) {
            return response.text();
        }).then(function(data) {
            log(data); // this will be a string
            return data;
        });
    }
    return;
}