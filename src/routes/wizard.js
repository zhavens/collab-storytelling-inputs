const { compileClient } = require('jade');
var mongo = require('mongodb');

const uri = "mongodb://localhost:27017";
var client = new mongo.MongoClient(uri);
client.connect();

async function createDbWatcher(ws, user) {
    var changeStream = null;
    try {

        const database = client.db("collab");
        const logging = database.collection("logging");

        changeStream = logging.watch({ $match: { user: user } });
        // set up a listener when change events  finally  emitted
        changeStream.on("change", async next => {
            if (ws.readyState == 1 /*OPEN*/) {
                ws.send(JSON.stringify(next.fullDocument));
            }
        });

        ws.on('message', (msg) => {
            console.log(msg);
        });

        ws.on('close', async () => {
            console.log("Socket closed. Closing DB watcher.");
            await changeStream.close();
        });
    } catch (e) {
        console.log("Error creating DB watcher: ", e);
        if (changeStream) await changeStream.close();
        ws.close();
    }
};

module.exports = (router) => {
    router.ws('/:user', (ws, req) => {
        console.log('Socket opened.');
        createDbWatcher(ws, req.params.user);

        ws.on('message', (msg) => {
            console.log(msg);
            ws.send(msg);
        });
    });

    return router;
};