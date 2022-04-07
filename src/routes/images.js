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
    } else if (!req.body.image) {
        console.log('Error: missing field "image".');
        res.status(400).send('Error: missing field "image".');
    } else if (!req.body.inputVersion) {
        console.log('Error: missing field "inputVersion".');
        res.status(400).send('Error: missing field "inputVersion".');
    }  else if (!req.body.outputVersion) {
        console.log('Error: missing field "outputVersion".');
        res.status(400).send('Error: missing field "outputVersion".');
    }  else if (!req.body.round) {
        console.log('Error: missing field "round".');
        res.status(400).send('Error: missing field "round".');
    } else {
        try {
            await client.connect();
            const database = client.db("collab");
            const inter = database.collection("images");
            // create a document to insert
            const doc = {
                user: req.params.user,
                image: req.body.image,
                inputVersion: req.body.inputVersion,
                outputVersion: req.body.outputVersion,
                round: req.body.round,
                timestamp: mongo.Timestamp(),
            };
            const result = await inter.insertOne(doc);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send('Success.');
        } catch {
            res.status(500).send('Error posting image DB.');
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
    } else if (!req.body.inputVersion) {
        console.log('Error: missing field "inputVersion".');
        res.status(400).send('Error: missing field "inputVersion".');
    } else {
        try {
            await client.connect();
            const database = client.db("collab");
            const inter = database.collection("images");
            const results = await inter.find({ "user": req.params.user, "inputVersion": req.params.inputVersion }).toArray();
            res.send(results);
        } finally {
            await client.close();
            res.status(500).send('Error fetching logs from DB.');
        }
    }
});

module.exports = router;
