import categories from "./categories.js";

function setUser(panel, user) {
    panel[0].dataset.user = user;
}

function getUser(panel) {
    return panel[0].dataset.user;
}

function addConsoleLog($console, msg, classes = null) {
    var p = $(document.createElement("p")).html(msg).addClass(classes);
    $console.append(p);
    $console[0].scrollTop = $console[0].scrollHeight;
    // p[0].scrollIntoView(false);
}

function connectConsole($console, user) {
    var socket = new WebSocket('wss://zhavens.com/hai/wizard/' + encodeURIComponent(user));

    socket.addEventListener('open', event => {
        $('#connIcon').removeClass("fail bi-x-circle-fill")
            .addClass("success bi-check-circle-fill");
        var msg = new Date().toISOString() + ": Connected.\n"
        addConsoleLog($console, msg, "success");
    });

    socket.addEventListener('message', event => {
        var data = JSON.parse(event.data);
        if (data.type == "log") {
            data.log.timestamp = new Date(data.log.timestamp);
            addConsoleLog($console, data.log.timestamp.toISOString() + ': ' + data.log.msg + '\n')
        }
    });

    socket.addEventListener('error', event => {
        $('#connIcon').removeClass("success bi-check-circle-fill")
            .addClass("fail bi-x-circle-fill");
        var msg = new Date.toISOString() + ": Error - " + event + "\n";
        addConsoleLog($console, msg, "fail");
    });

    socket.addEventListener('close', event => {
        $('#connIcon').removeClass("success bi-check-circle-fill")
            .addClass("fail bi-x-circle-fill");
        var msg = new Date.toISOString() + ": Disonnected.\n"
        addConsoleLog($console, msg, "fail");
    });
};

async function postCategories(user, newCategories, $console) {
    var url = "https://zhavens.com/hai/categories/"
    url += encodeURIComponent(user);

    await $.ajax(url,
        {
            method: 'POST',
            contentType: "application/json",
            data: JSON.stringify({ "categories": newCategories }),
        }).done(() => {
            var msg = new Date().toISOString() + ": Updated categories - " + newCategories + ".\n";
            if ($console)
                addConsoleLog($console, msg)
        }).catch(console.error);
}

function appendCategory($list, category) {
    $list.append($(document.createElement('a'))
        .addClass("list-group-item list-group-item-action new-cat")
        .attr('href', '#')
        .text(category)
        .click(event => {
            event.target.remove()
        }));
};

function populateCategories($list, user) {
    const categoryUrl = "https://zhavens.com/hai/categories/" + encodeURIComponent(user);
    $.getJSON(categoryUrl, data => {
        $list.find(".new-cat").remove();
        if (data && data.categories) {
            for (var category of data.categories) {
                appendCategory($list, category);
            }
        }
    });
}

$('form.user-form').on('submit', (event) => {
    event.preventDefault();
    var panel = $(event.target).closest(".wizard-panel");

    var user = panel.find('.user-input').val();
    setUser(panel, user);
    connectConsole(panel.find(".console"), user);
    populateCategories(panel.find(".cat-list"), user);
});

$('button.connect').on('click', event => {
    var panel = $(event.target).closest('.wizard-panel');

    connectConsole(panel.find('console'), getUser(panel));
});


$('form.add-cat-form').on('submit', event => {
    event.preventDefault();
    var panel = $(event.target).closest('.wizard-panel');
    var input = panel.find('input.category-input');
    appendCategory(panel.find(".cat-list"),
        input.val().toLowerCase());
    input.val("");
})

$('form.post-cat-form').on('submit', async event => {
    event.preventDefault();

    var panel = $(event.target).closest('.wizard-panel');
    var newCategories = [];

    panel.find('.new-cat').each((idx, el) => {
        newCategories.push(el.text);
    });

    postCategories(getUser(panel), newCategories, panel.find(".console"));
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

$('.category-input').typeahead({
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


$('.category-input').on("typeahead:selected", function (event, suggestion, name) {
    var panel = $(event.target).closest('.wizard-panel');
    panel.find('.category-input').val(suggestion);
    panel.find('.add-cat-form').submit();
});