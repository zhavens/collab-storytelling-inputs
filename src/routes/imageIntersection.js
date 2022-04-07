var parse = require('parse-svg-path');
var serialize = require('serialize-svg-path');
var intersect = require('path-intersection');
var translate = require('translate-svg-path');
var svgpath = require('svgpath');

var express = require('express');
var router = express.Router();


router.get('/:currentImage/:newPath/:cx/:cy', async function (req, res, next) {
    if (!req.params.currentImage) {
        res.status(400).send('Error: missing field "currentImage".');
    } else if (!req.params.newPath) {
        res.status(400).send('Error: missing field "newPath".');
    } else if (!req.params.cx) {
        res.status(400).send('Error: missing field "cx".');
    } else if (!req.params.cy) {
        res.status(400).send('Error: missing field "cy".');
    } else {
        try {
            var newPath = req.params.newPath;
            var currentImage = req.params.currentImage;
            var parsed = parse(newPath);
            // var transform = svgpath(parsed).translate(cx, cy);
            // var transform = translate(parsed, cx, cy);
            // console.log(transform);
            // var transformedPath = serialize(transform);
            var intersection = intersect(currentImage, newPath);
            console.log("hello");
            console.log(intersection);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({key:"hello"}));
        } catch {
            res.status(500).send('Error fetching logs from DB.');
        }
    }
});

module.exports = router;
