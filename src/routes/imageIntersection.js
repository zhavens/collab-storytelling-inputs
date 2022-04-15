var parse = require('parse-svg-path');
var serialize = require('serialize-svg-path');
var intersect = require('path-intersection');
var translate = require('translate-svg-path');

var express = require('express');
var router = express.Router();

router.get('/:currentImage/:newPath/:cx/:cy', async function (req, res, next) {
    if (!req.params.currentImage) {
        res.status(400).send('Error: missing field "currentImage".');
    } else if (!req.params.newPath) {
        res.status(400).send('Error: missing field "newPath".');
    } else {
        try {
            var newPath = req.params.newPath;
            var currentImage = req.params.currentImage;
            var parsed = parse(newPath);
            var trans = translate(parsed, req.params.cx, req.params.cy);
            var translatedPath = serialize(trans);
            var intersection = intersect(currentImage, translatedPath);
            res.send(intersection);
        } catch {
            res.status(500).send('Error fetching logs from DB.');
        }
    }
});

module.exports = router;
