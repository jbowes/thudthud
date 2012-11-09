var fileserve = require('./fileserve');
var model = require('./model');

var redis = require("redis");
var express = require('express');
var http = require('http');

var app = express();

var table = model.initModel();

auth = {
    redisHost: "slimehead.redistogo.com",
    redisPort: 9328,
    redisPass: process.env.REDIS_PASS,
};

var redisClient = redis.createClient(auth.redisPort, auth.redisHost);
redisClient.auth(auth.redisPass);

// try and load the persisted beats table state
redisClient.on("ready", function() {
    redisClient.get("beats", function(err, reply) {
        if (reply) {
            console.log("found persisted table: " + reply);
            table = JSON.parse(reply);
        }
    });
});

fileserve.configure(app, table);

var server = http.createServer(app);
var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
    console.log('A socket conected');
    // send out current view of drum kit
    socket.emit('table', table.table);

    socket.on('toggle', function(data) {
        table.table[data.drum][data.bar] = data.state;
        redisClient.set("beats", JSON.stringify(table));
        socket.broadcast.emit('toggle', data);
    });
});

server.listen(8083);
