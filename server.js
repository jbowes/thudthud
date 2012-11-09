var fileserve = require('./fileserve');
var express = require('express');
var http = require('http');

var app = express();
fileserve.configure(app);

var server = http.createServer(app);
var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
    console.log('A socket conected');
    socket.on('toggle', function(data) {
        console.log('toggled: ' + data);
    });
});

server.listen(8083);
