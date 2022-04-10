$('#userForm').on('submit', (event) => {
    event.preventDefault();

    const user = $('#userInput').val();
    var socket = new WebSocket('wss://zhavens.com/hai/wizard/' + encodeURIComponent(user));

    socket.addEventListener('open', event => {
        $('#connIcon').removeClass("fail bi-x-circle-fill")
            .addClass("success bi-check-circle-fill");
        var p = $(document.createElement("p")).html("Connected.\n").addClass("success");
        $('#output').append(p);
        p[0].scrollIntoView(false);
    });
    socket.addEventListener('message', event => {
        var log = JSON.parse(event.data);
        log.timestamp = new Date(log.timestamp);
        var msg = log.timestamp.toISOString() + ': ' + log.msg + '\n';
        var p = $(document.createElement("p")).html(msg);
        $('#output').append(p);
        p[0].scrollIntoView(false);
    });
    socket.addEventListener('close', event => {
        $('#connIcon').removeClass("success bi-check-circle-fill")
            .addClass("fail bi-x-circle-fill");
        var p = $(document.createElement("p")).html("Disconnected.\n").addClass("fail");
        $('#output').append(p);
        p[0].scrollIntoView(false);
    });
});