var fs = require('fs')
var haml = require('haml')
var url = require('url')
var express = require('express');

module.exports = {
    configure: configure
};

var locals;

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

function configure(app, table) {
    locals = table;

    console.log(table.drums);

    app.use(function(req, res, next) {
        console.log('%s %s', req.method, req.url);
        next();
    });
    app.get('/', serveIndex);
    app.use(express.static(__dirname + '/static'));
}
