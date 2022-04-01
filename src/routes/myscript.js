var express = require('express');
var router = express.Router();

var mongo = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new mongo.MongoClient(uri);

router.get('/keys', async function (req, res, next) {
    try {
        await client.connect();
        const database = client.db("collab");
        const logging = database.collection("myscript");
        const appResp = await logging.findOne({ "type": "app" });
        const hmacResp = await logging.findOne({ "type": "hmac" });
        res.json({ applicationKey: appResp.key, hmacKey: hmacResp.key });
    } catch {
        res.status(500).send('Error fetching keys from DB.')
    } finally {
        await client.close();
    }
});

module.exports = router;