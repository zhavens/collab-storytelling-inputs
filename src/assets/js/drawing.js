import quickDraw from '../node_modules/quickdraw.js/src/quickdraw.js';

categoryInput = document.querySelector("#drawcategory");
drawBtn = document.querySelector("#draw");
drawOuput = document.querySelector("#drawing");

function getDrawing() {
    var set = quickDraw.set(1, [categoryInput.value]);
    console.log(set);
}

drawBtn.onclick = getDrawing;


