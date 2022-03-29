var express = require('express');
var router = express.Router();

var mongo = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new mongo.MongoClient(uri);

/* GET users listing. */
router.post('/:user', async function (req, res, next) {
    if (!req.params.user) {
        res.status(400).send('Error: missing field "user".');
    } else if (!req.body.msg) {
        res.status(400).send('Error: missing field "msg".');
    } else {
        try {
            await client.connect();
            const database = client.db("collab");
            const logging = database.collection("logging");
            // create a document to insert
            const doc = {
                user: req.params.user,
                msg: req.body.msg,
                timestamp: mongo.Timestamp(),
            };
            const result = await logging.insertOne(doc);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send('Success.');
        } finally {
            await client.close();
            res.send('Error logging to DB.');
        }
    }
});

router.get('/:user', async function (req, res, next) {
    if (!req.params.user) {
        res.status(400).send('Error: missing field "user".');
    } else {
        try {
            await client.connect();
            const database = client.db("collab");
            const logging = database.collection("logging");
            const results = await logging.find({ "user": req.params.user }).toArray();
            res.send(results);
        } finally {
            await client.close();
            res.status(500).send('Error fetching logs from DB.');
        }
    }
});

module.exports = router;