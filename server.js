var app = require('http').createServer(handler)
var io = require('socket.io').listen(app)
var fs = require('fs')
var haml = require('haml')

var drums = ['bass', 'hihat']
var bars = [0, 1, 2, 3]
var locals = {drums:drums, bars:bars}

function handler (req, res) {
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

app.listen(8083);
