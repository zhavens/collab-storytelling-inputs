import categories from "./categories.js";

var currUser = "";

function appendCategory(category) {
    $('#newCats').append($(document.createElement('a'))
        .addClass("list-group-item list-group-item-action newCat")
        .attr('href', '#')
        .text(category)
        .click(event => {
            event.target.remove()
        }));
};

function addConsoleLog(msg, classes = null) {
    var p = $(document.createElement("p")).html(msg).addClass(classes);
    $('#output').append(p);
    p[0].scrollIntoView(false);
}

function connectConsole() {
    var socket = new WebSocket('wss://zhavens.com/hai/wizard/' + encodeURIComponent(currUser));

    socket.addEventListener('open', event => {
        $('#connIcon').removeClass("fail bi-x-circle-fill")
            .addClass("success bi-check-circle-fill");
        var msg = new Date().toISOString() + ": Connected.\n"
        addConsoleLog(msg, "success");
    });

    socket.addEventListener('message', event => {
        var data = JSON.parse(event.data);
        if (data.type == "log") {
            data.log.timestamp = new Date(data.log.timestamp);
            addConsoleLog(data.log.timestamp.toISOString() + ': ' + data.log.msg + '\n')
        }
    });

    socket.addEventListener('error', event => {
        $('#connIcon').removeClass("success bi-check-circle-fill")
            .addClass("fail bi-x-circle-fill");
        var msg = new Date.toISOString() + ": Error - " + event + "\n";
        addConsoleLog(msg, "fail");
    });

    socket.addEventListener('close', event => {
        $('#connIcon').removeClass("success bi-check-circle-fill")
            .addClass("fail bi-x-circle-fill");
        var msg = new Date.toISOString() + ": Disonnected.\n"
        addConsoleLog(msg, "fail");
    });
};

function fetchCategories() {
    const categoryUrl = "https://zhavens.com/hai/categories/" + encodeURIComponent(currUser);
    $.getJSON(categoryUrl, data => {
        $(".newCat").remove();
        for (var category of data.categories) {
            appendCategory(category);
        }
    });
}

$('#userForm').on('submit', (event) => {
    event.preventDefault();

    currUser = $('#userInput').val();
    connectConsole();
    fetchCategories();
});

$('#connectBtn').on('click', connectConsole);


$('#addCatForm').on('submit', event => {
    event.preventDefault();
    appendCategory($('#category').val().toLowerCase());
    $('#category').val("");
})

$('#newCatForm').on('submit', async event => {
    event.preventDefault();

    var newCategories = [];

    $('.newCat').each((idx, el) => {
        newCategories.push(el.text);
    });

    var url = "https://zhavens.com/hai/categories/"
    url += encodeURIComponent(currUser);

    await $.ajax(url,
        {
            method: 'POST',
            contentType: "application/json",
            data: JSON.stringify({ "categories": newCategories }),
        }).done(() => {
            var msg = new Date().toISOString() + ": Updated categories - " + newCategories + ".\n";
            addConsoleLog(msg)
        }).catch(console.error);
});

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

$('#category').typeahead({
    highlight: false,
    hint: false,
    minlength: 1
},
    {
        display: 'value',
        source: substringMatcher(categories),
        templates: {
            suggestion: function (data) {
                return "<div>" + data + "</div>"
            }
        }
    });


$('#category').on("typeahead:selected", function (eventObject, suggestion, name) {
    $('#category').val(suggestion);
    $('#addCatForm').submit();
});