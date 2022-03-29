const https = require('https');
const { MongoClient } = require("mongodb");
const ndjson = require('ndjson');
const quickDraw = require("quickdraw.js");

/** Significant code reuse from the quickdraw.js Node package. */

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

/** Downloads the given amount of drawings from the given category */
function _downloadSet(category, amount) {
    var url = 'https://storage.googleapis.com/quickdraw_dataset/full/simplified/';
    url += encodeURIComponent(category) + '.ndjson';

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            var { statusCode } = res;

            if (statusCode !== 200) {
                throw new Error(`Request Failed.\n Status Code: ${statusCode}`);
            }

            res.setEncoding('utf8');
            var drawings = [];
            res
                .pipe(ndjson.parse())
                .on('data', function (obj) {
                    if (drawings.length < amount) {
                        drawings.push(obj);
                    } else {
                        this.destroy();
                    }
                })
                .on('end', () => {
                    resolve(drawings);
                })
                .on('close', () => {
                    resolve(drawings);
                });
        }).on('error', (e) => {
            throw new Error(e.message);
        });
    });
}

/** Strips additional metadata from the drawing object. */
function _stripDrawing(drawing) {
    return {
        _id: drawing.key_id,
        category: drawing.word.toLowerCase(),
        drawing: drawing.drawing
    }
}

/** Imports the dataset of the certain category  */
async function _import(category, amount) {
    var drawings = await _downloadSet(category, amount);

    if (drawings.length < amount) {
        console.warn(`Requested ${amount} images from '${category}', only ${drawings.length} available!`);
    }

    drawings = drawings.map(x => _stripDrawing(x));

    var db = await client.db("collab");
    var collection = db.collection('quickdraw');
    const insertResult = await collection.insertMany(drawings);
    console.log(category, ' - Inserted documents:', insertResult.insertedCount);
}

/** Imports the datasets of all categories */
async function _importAll(amount) {
    for (var i = 0; i < quickDraw.categories.length; i++) {
        let category = quickDraw.categories[i];
        await _import(category, amount);
    }
}

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        console.log("Connected successfully to server");

        await _importAll(100);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);