var maxRounds = 4;
var round = localStorage.getItem("round");
var finalStory = document.getElementById("final_story");
var image = document.getElementById("output_image");
var shareBtn = document.getElementById("share_btn");

if(round == maxRounds) {
    // set all rounds of story images
    for(var i = 1; i <= maxRounds; i++){
        var tempImage = document.getElementById("output_image" + i);
        var imageName = localStorage.getItem("pseudonym") + i;
        tempImage.src = localStorage.getItem(imageName);
    }
} else {
    // set the current round image
    var imageName = localStorage.getItem("pseudonym") + localStorage.getItem("round");
    image.src = localStorage.getItem(imageName);
}

window.onload = function () {
    if(round == 4) {
        image.style.display = "none";
        finalStory.style.display = "block";
        shareBtn.style.display = "block";
    } else {
        image.style.display = "block";
        finalStory.style.display = "none";
        shareBtn.style.display = "none";
    }
}

function shareStory() {
    // download all images
    for(var i = 1; i <= maxRounds; i++){
        var imageName = localStorage.getItem("pseudonym") + i;
        download(localStorage.getItem(imageName));
    }
}

function download(url){
    var link = document.createElement('a');
    var var_name = localStorage.getItem("pseudonym") + localStorage.getItem("round");
    link.download = var_name + '.png';
    link.href = url;
    link.click();
}