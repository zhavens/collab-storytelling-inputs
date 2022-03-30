var express = require('express');
var router = express.Router();

var mongo = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new mongo.MongoClient(uri);

/* GET categorys listing. */
router.post('/:category', async function (req, res, next) {
    if (!req.params.category) {
        res.status(400).send('Error: missing field "category".');
    } else if (!req.body.path) {
        res.status(400).send('Error: missing field "path".');
    } else {
        try {
            await client.connect();
            const database = client.db("collab");
            const quickdraw = database.collection("quickdraw");
            // create a document to insert
            const doc = {
                category: req.params.category,
                path: req.body.path,
            };
            const result = await quickdraw.insertOne(doc);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send('Success.');
        } finally {
            await client.close();
            res.send('Error writing quickdraw to DB.');
        }
    }
});

router.get('/:category', async function (req, res, next) {
    if (!req.params.category) {
        res.status(400).send('Error: missing field "category".');
    } else {
        try {
            await client.connect();
            const database = client.db("collab");
            const quickdraw = database.collection("quickdraw");

            const pipeline = [
                { $match: { category: req.params.category.toLowerCase() } },
                { $sample: { size: 1 } },
            ];
            const cursor = quickdraw.aggregate(pipeline);
            if (!await cursor.hasNext()) {
                res.status(404).send("Could not find drawing for category.");
            } else {
                res.send(await cursor.next());
            }

            // const results = await quickdraw.findOne({ "category": req.params.category });
            // res.send(results);
        } catch {
            res.status(500).send('Error fetching drawing from DB.');
        } finally {
            await client.close();
        }
    }
});

module.exports = router;