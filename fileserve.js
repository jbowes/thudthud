var fs = require('fs')
var haml = require('haml')
var url = require('url')

module.exports = {
    fileserver: fileserver
};

var drums = ['bass', 'hihat']
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

function serveStatic(req, res) {
    reqUrl = url.parse(req.url)

    fs.readFile(__dirname + '/static' + reqUrl.pathname, 'utf8',
    function (err, data) {
        if (err) {
            res.writeHead(404);
            return res.end('file not found');
        }

        res.writeHead(200);
        res.end(data);
    });

}

function fileserver(req, res) {
    reqUrl = url.parse(req.url)
    console.log("requested path is: " + reqUrl.pathname)

    if (reqUrl.pathname == '/' || reqUrl.pathname == '/index.html') {
        serveIndex(req, res)
    } else {
        serveStatic(req, res)
    }

}
