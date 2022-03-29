//Create canvas
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var bounding = canvas.getBoundingClientRect();

//Set background
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 1450, 600);

lines();

function lines() {
	//Initialize mouse coordinates to 0,0
	var mouse = { x: 0, y: 0};

	//Paint includes line width, line cap, and color
	paint = function() {
		ctx.lineTo(mouse.x, mouse.y);
		ctx.lineWidth = lineWidthRange();
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.strokeStyle = colors;
		ctx.stroke();
	};

	//Find mouse coordinates relative to canvas
	linesMousemove = function(e){
		mouse.x = e.pageX - bounding.left;
		mouse.y = e.pageY - bounding.top;
	};

	//User clicks down on canvas to trigger paint
	linesMousedown = function(){
		ctx.beginPath();
		ctx.moveTo(mouse.x, mouse.y);
		canvas.addEventListener('mousemove', paint, false);
	};

	//When mouse lifts up, line stops painting
	linesMouseup = function(){
		canvas.removeEventListener('mousemove', paint, false);
	};

	//When mouse leaves canvas, line stops painting
	linesMouseout = function() {
		canvas.removeEventListener('mousemove', paint, false);
	};

	// Event listeners that will trigger the paint functions when mousedown, mousemove, mouseup, mouseout
	canvas.addEventListener('mousedown', linesMousedown, false);
	canvas.addEventListener('mousemove', linesMousemove, false);
	canvas.addEventListener('mouseup', linesMouseup, false);
	canvas.addEventListener('mouseout', linesMouseout, false);
};

//Color palette
var colors;
var colorId = "black";
var selectedClass =  "selected";
var selectedClassBlack =  "selected-black";
document.getElementById(colorId).classList.add(selectedClassBlack);

function changeColors(palette) {
    console.log("Change Colours: " + palette.id)
    var prevClassName = colorId == "black" ? "selected-black" : "selected";
    var newClassName = palette.id == "black" ? "selected-black" : "selected";

    document.getElementById(colorId).classList.remove(prevClassName);
    colorId = palette.id;
    document.getElementById(colorId).classList.add(newClassName);

	switch(palette.id) {
		case "red":
			colors = "red";
			break;
		case "red1":
			colors = "#F16161";
			break;
		case "red2":
			colors = "#F69FA0";
			break;
		case "orange":
			colors = "orange";
			break;
		case "orange1":
			colors = "#F99F62";
			break;
		case "orange2":
			colors = "#FBB57B";
			break;
		case "blue":
			colors = "#09C2DB";
			break;
		case "blue1":
			colors = "#8BD3DC";
			break;
		case "blue2":
			colors = "#B9E3E8";
			break;
		case "indigo":
			colors = "#0E38AD";
			break;
		case "indigo1":
			colors = "#546AB2";
			break;
		case "indigo2":
			colors = "#9C96C9";
			break;
		case "green":
			colors = "green";
			break;
		case "green1":
			colors = "#97CD7E";
			break;
		case "green2":
			colors = "#C6E2BB";
			break;
		case "black":
			colors = "black";
			break;
		case "black1":
			colors = "#545454";
			break;
		case "black2":
			colors = "#B2B2B2";
			break;
		case "yellow":
			colors = "yellow";
			break;
		case "yellow1":
			colors = "#F7F754";
			break;
		case "yellow2":
			colors ="#F7F4B1";
			break;
		case "pink":
			colors = "#B9509E";
			break;
		case "pink1":
			colors = "#D178B1";
			break;
		case "pink2":
			colors = "#E3ABCE";
			break;
        case "brown":
            colors = "#6F4E37";
            break;
        case "skin1":
            colors = "#F2EFEE";
            break;
        case "skin2":
            colors = "#EFE6DD";
            break;
        case "skin3":
            colors = "#EBD3C5";
            break;
        case "skin4":
            colors = "#D7B6A5";
            break;
        case "skin5":
            colors = "#9F7967";
            break;
        case "skin6":
            colors = "#70361C";
            break;
        case "skin7":
            colors = "#492816";
            break;
        case "skin8":
            colors = "#FFCD94";
            break;
        case "skin9":
            colors = "#EAC086";
            break;
        case "skin10":
            colors = "#FBDEBC";
	}
};

function erase() {
    console.log("Erase");
    colors = "white";
    document.getElementById(colorId).style.border = "none";
    colorId = palette.id;
    document.getElementById(palette.id).style.border = "2px solid #1f1f1f";
}

function lineWidthRange() {
    var widthLine = document.getElementById("myRange").value;
    return widthLine;
};

function clearCanvas() {
    console.log("Clear");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function saveImage() {
    console.log("Save Image");
    var var_name = localStorage.getItem("pseudonym") + localStorage.getItem("round");
    dataUrl = canvas.toDataURL();
    localStorage.setItem(var_name, dataUrl);
}

function addPath(path) {
    ctx.save();
    ctx.stroke(path);    
    ctx.restore(); 
}

// example function to show to add paths
// function test() {
//     var path2 = new Path2D();
//     path2.moveTo(220, 60);
//     path2.arc(170, 60, 50, 0, 2 * Math.PI);
//     addPath(path2);
// }