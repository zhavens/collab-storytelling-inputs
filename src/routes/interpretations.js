var express = require('express');
var router = express.Router();

var mongo = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new mongo.MongoClient(uri);

/* POST users listing. */
router.post('/:user', async function (req, res, next) {
    if (!req.params.user) {
        console.log('Error: missing field "user".');
        res.status(400).send('Error: missing field "user".');
    } else if (!req.body.text) {
        console.log('Error: missing field "text".');
        res.status(400).send('Error: missing field "text".');
    } else if (!req.body.input) {
        console.log('Error: missing field "input".');
        res.status(400).send('Error: missing field "input".');
    } else {
        try {
            await client.connect();
            const database = client.db("collab");
            const inter = database.collection("interpretations");
            // create a document to insert
            const doc = {
                user: req.params.user,
                text: req.body.text,
                input: req.body.input,
                timestamp: mongo.Timestamp(),
            };
            const result = await inter.insertOne(doc);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send('Success.');
        } catch {
            res.send('Error writing interpretation to DB.');
            await client.close();
        } finally {
            await client.close();
        }
    }
});

/* GET users listing. */
router.get('/:user', async function (req, res, next) {
    if (!req.params.user) {
        console.log('Error: missing field "user".');
        res.status(400).send('Error: missing field "user".');
    } else if (!req.body.input) {
        console.log('Error: missing field "input".');
        res.status(400).send('Error: missing field "input".');
    } else {
        try {
            await client.connect();
            const database = client.db("collab");
            const inter = database.collection("interpretations");
            const results = await inter.find({ "user": req.params.user, "input": req.params.input }).toArray();
            res.send(results);
        } finally {
            await client.close();
            res.status(500).send('Error fetching logs from DB.');
        }
    }
});

module.exports = router;
