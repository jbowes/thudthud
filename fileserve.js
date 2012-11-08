var fs = require('fs')
var haml = require('haml')
var url = require('url')
var express = require('express');

module.exports = {
    configure: configure
};

var drums = ['clap', 'snare', 'cowbell']
var bars = [0, 1, 2, 3, 4, 5, 6, 7]
var locals = {drums:drums, bars:bars}

function serveIndex(req, res) {
    fs.readFile(__dirname + '/tmpl/index.haml', 'utf8',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index!');
        }

        index = haml.render(data, {locals:locals})
        res.writeHead(200);
        res.end(index);
    });
}

function configure(app) {
    app.use(function(req, res, next) {
        console.log('%s %s', req.method, req.url);
        next();
    });
    app.get('/', serveIndex);
    app.use(express.static(__dirname + '/static'));
}
