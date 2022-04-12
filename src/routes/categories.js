var express = require('express');
var router = express.Router();
var debug = require('debug')('categories')

var mongo = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new mongo.MongoClient(uri);

/* GET category listing. */
router.post('/:user', async function (req, res, next) {
    debug("Request: %o", req.body);
    if (!req.params.user) {
        res.status(400).send('Error: missing field "user".');
    } if (!req.body.categories) {
        res.status(400).send('Error: missing field "categories".');
    } else {
        try {
            await client.connect()
            const database = client.db("collab");
            const categories = database.collection("categories");
            // create a document to insert
            const doc = {
                user: req.params.user.toLocaleLowerCase(),
                categories: req.body.categories,
                date: new Date(),
            };
            const result = await categories.insertOne(doc);
            debug(`A document was inserted with the _id: ${result.insertedId}`);
            res.send('Success.');
        } finally {
            await client.close();
            res.send('Error writing categories to DB.');
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
            const categories = database.collection("categories");

            const query = { user: req.params.user.toLowerCase() };
            const resp = categories.findOne(query, { sort: { date: -1 } });

            res.json(await resp);
        } catch {
            res.status(500).send('Error fetching categories from DB.');
        } finally {
            await client.close();
        }
    }
});

module.exports = router;