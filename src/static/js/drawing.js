import categories from "./categories.js";
import { addImage } from "./requestHandler.js";

//Create canvas
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 1450, 600);
var outputVersion = "AI";
var drawElements = ["cat", "dog"];

export function getCanvas() {
    return {
        canvas: canvas,
        ctx: ctx
    }
}

export async function createAITemplate() {
    // here the AI draws
    console.log("Create AI Generated Template");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(var i = 0; i < drawElements.length; i++) {
        draw(drawElements[i]);
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
    var url = 'https://zhavens.com/raquel/quickdraw/';
    url += encodeURIComponent(category);
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

async function draw(category) {
    const data = await getDrawing(category);
    var drawing = data.drawing;
    var svg = quickdrawSvgRender(drawing);
    var path = new Path2D(svg);
    var randomColour = '#'+Math.floor(Math.random()*16777215).toString(16);
    var cx = 50 + Math.random() * (canvas.width - 200);
    var cy = 50 + Math.random() * (canvas.height - 200);
    var stroke = ctx.lineWidth;
    ctx.lineWidth = 2;
    ctx.translate(cx, cy);
    ctx.strokeStyle = randomColour;
    ctx.stroke(path);
    ctx.translate(-cx, -cy);
    ctx.lineWidth = stroke;
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

// $('#category').typeahead({
//     highlight: false,
//     hint: false,
//     minlength: 1
// },
//     {
//         display: 'value',
//         source: substringMatcher(categories),
//         templates: {
//             suggestion: function (data) {
//                 return "<div>" + data + "</div>"
//             }
//         }
//     });


$('#category').on("typeahead:selected", function (eventObject, suggestion, name) {
    $('#category').typeahead('val', suggestion);
    draw(suggestion);
});

$('#draw').click(function () {
    draw($('#category').val());
})

$("#category").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        $('#category').typeahead('close');
        draw(this.value);
    }
});