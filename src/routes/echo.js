module.exports = (router) => {
    router.get('/', (req, res, next) => {
        console.log('Echo called.');
        res.send("Echo.");
    });

    router.ws('/', (ws, req) => {
        console.log('Echo connection.');

        ws.on('message', (msg) => {
            console.log(msg);
            ws.send(msg);
        });
        ws.on('close', () => {
            console.log('Echo closed.');
        });
    });

    return router;
};