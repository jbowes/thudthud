var fileserve = require('./fileserve');
var model = require('./model');

var express = require('express');
var http = require('http');

var app = express();

var table = model.initModel();

fileserve.configure(app, table);

var server = http.createServer(app);
var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
    console.log('A socket conected');
    // send out current view of drum kit
    socket.emit('table', table.table);

    socket.on('toggle', function(data) {
        table.table[data.drum][data.bar] = data.state;
        socket.broadcast.emit('toggle', data);
    });
});

server.listen(8083);
