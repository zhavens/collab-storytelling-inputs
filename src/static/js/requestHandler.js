var user = localStorage.getItem("pseudonym");
var inputVersion = localStorage.getItem("inputVersion");
var round = localStorage.getItem("round");

export async function addInterpretation (text) {
    console.log("Add Interpretation: " + user);
    if(user == null) {
        console.log("Error: undefined user");
    } else if (inputVersion == null) {
        console.log("Error: undefined version");
    } else if (text == null) {
        // give some warning to the user
        console.log("Error: undefined text");
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
    console.log("Add Canvas Image: " + user);
    if(user == null) {
        console.log("Error: undefined user");
    } else if (inputVersion == null) {
        console.log("Error: undefined input version");
    } else if (outputVersion == null) {
        console.log("Error: undefined output version");
    } else if (image == null) {
        console.log("Error: undefined image");
    } else if (round == null) {
        console.log("Error: undefined round");
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