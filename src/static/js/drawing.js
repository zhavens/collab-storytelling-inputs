import { log } from "./logging.js";
import { addImage, getCategories } from "./requestHandler.js";
import { getUrl } from "./util.js";

//Create canvas
var canvas = document.getElementById('myCanvas');
var catgories = document.getElementById('categories');
var ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 1300, 700);
var outputVersion = "AI";
var drawElements = [];
var currentDrawIndex = 0;

export function getCanvas() {
    return {
        canvas: canvas,
        ctx: ctx
    }
}

function resizePanels() {
    $('#colorpanel').height($('#myCanvas').height())
}

window.onresize = resizePanels;

async function fetchCategories() {
    var response = await getCategories();
    response = JSON.parse(response);
    return response == null ? [] : response["categories"];
}

export async function drawCategories() {
    // reset the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw all the images
    currentDrawIndex = 0;
    for (var i = 0; i < drawElements.length; i++) {
        draw(drawElements[i]);
        await new Promise(r => setTimeout(r, 20));
    }

    catgories.textContent = "Categories Identified: " + drawElements.toString().replaceAll(',', ', ');
}

export async function createAITemplate() {
    log("Creating AI Generated Template");

    while (localStorage.getItem("loading") == "true") {
        var response = await fetchCategories();

        // compare elements
        var sameElements = (response.length == drawElements.length) && response.every(function (element, index) {
            return element === drawElements[index];
        });

        if (!sameElements) {
            drawElements = response;
            console.log(drawElements);
            log("Fetched categories: " + drawElements);
            await drawCategories();
        }

        // check if the categories changed again in 5 seconds
        await new Promise(r => setTimeout(r, 5000));
    }

    //save the image to the database
    addImage(canvas.toDataURL(), outputVersion);
}

function parseNdjson(result) {
    var data = [];
    var lines = result.split("\n");
    for (var i = 0; i < lines.length - 1; ++i) {
        var l = lines[i].trim();
        if (l.length > 0) {
            data.push(JSON.parse(l));
        }
    }
    return JSON.parse(data);
}

function getDrawing(category) {
    var data;
    var url = getUrl('quickdraw', category);
    return $.ajax
        ({
            url: url,
        });
}

// https://www.npmjs.com/package/quickdraw-svg-render
function quickdrawSvgRender(drawing, viewBox) {
    viewBox = (typeof viewBox !== 'undefined') ? viewBox : true

    var svgSize = viewBox ? 'viewBox="0 0 256 256"' : 'width="256"  height="256"'
    var svg = []
    // svg.push('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' + svgSize + '>')

    drawing.forEach(function (loops) {
        // svg.push('<path d="')
        svg.push('M ' + loops[0][0] + ' ' + loops[1][0])

        for (var i = 1; i < loops[0].length; i++) {
            svg.push('L ' + loops[0][i] + ' ' + loops[1][i])
        }

        // svg.push('" stroke-width="1" stroke="black" fill="none"></path>')
    })

    // svg.push('</svg>')

    return svg.join("");
}

async function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}

async function draw(category) {
    // get the drawing
    const data = await getDrawing(category);
    var drawing = data.drawing;
    var svg = quickdrawSvgRender(drawing);
    var path = new Path2D(svg);

    // randomly assign the colour and position
    var randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16);
    var cx = 50 + (canvas.width - 100) * currentDrawIndex / drawElements.length;//Math.random() * (canvas.width - 400);
    var cy = Math.random() * (canvas.height - 250);

    // draw the drawing
    var path = new Path2D(svg);
    var stroke = ctx.lineWidth;
    ctx.translate(cx, cy);
    ctx.lineWidth = 2;
    ctx.strokeStyle = randomColour;
    ctx.stroke(path);
    ctx.lineWidth = stroke;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    currentDrawIndex++;
}

// https://codepen.io/tomfarina/pen/wZyPeZ
var substringMatcher = function (strs) {
    return function findMatches(q, cb) {
        var matches = [];
        var substrRegex = new RegExp(q, 'i');
        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });
        cb(matches);
    };
};