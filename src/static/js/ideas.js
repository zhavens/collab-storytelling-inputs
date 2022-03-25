import categories from "./categories.js";

var ideaText = document.getElementById('idea_text');

function getIdeas() {
    var items = [];
    var count = 0;
    while(count < 3) {
        var randomItem = categories[Math.floor(Math.random()*categories.length)];
        if(!items.includes(randomItem)) {
            items[count] = randomItem;
            count++;
        }
    }
    ideaText.innerHTML = items[0] + '<br />' +  items[1] + '<br />' + items[2];
}

var btn = document.querySelector('#idea_btn');
btn.onclick = getIdeas;

var new_btn = document.querySelector('#new_idea_btn');
new_btn.onclick = getIdeas;