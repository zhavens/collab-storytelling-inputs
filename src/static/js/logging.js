const collabLogging = (function () {
    return {
        log: function (user, msg) {
            var url = "https://zhavens.com/hai/logging/"
            url += encodeURIComponent(user);
            return await $.ajax(url,
                {
                    method: 'POST',
                    contentType: "type/text",
                    body: JSON.stringify({ msg: msg });
                });
        },

        fetch: function (user) {
            var url = "https://zhavens.com/hai/logging/"
            url += encodeURIComponent(user);
            return await $.get(url);
        }
    }
})()

export default collabLogging;