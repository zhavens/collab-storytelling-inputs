$('#userForm').on('submit', (event) => {
    event.preventDefault();

    const user = $('#userInput').val();
    var socket = new WebSocket('wss://zhavens.com/hai/wizard/' + encodeURIComponent(user));

    socket.addEventListener('open', event => {
        $('#connIcon').removeClass("fail bi-x-circle-fill")
            .addClass("success bi-check-circle-fill");
        var msg = new Date().toISOString() + ": Connected.\n"
        var p = $(document.createElement("p")).html(msg).addClass("success");
        $('#output').append(p);
        p[0].scrollIntoView(false);
    });

    socket.addEventListener('message', event => {
        var data = JSON.parse(event.data);
        if (data.type == "log") {
            data.log.timestamp = new Date(data.log.timestamp);
            var msg = data.log.timestamp.toISOString() + ': ' + data.log.msg + '\n';
            var p = $(document.createElement("p")).html(msg);
            $('#output').append(p);
            p[0].scrollIntoView(false);
        }
    });

    socket.addEventListener('close', event => {
        $('#connIcon').removeClass("success bi-check-circle-fill")
            .addClass("fail bi-x-circle-fill");
        var msg = new Date.toISOString() + ": Disonnected.\n"
        var p = $(document.createElement("p")).html(msg).addClass("fail");
        $('#output').append(p);
        p[0].scrollIntoView(false);
    });
});