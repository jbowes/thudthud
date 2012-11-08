var fileserve = require('./fileserve');
var express = require('express');
//var app = require('http').createServer(fileserve.fileserver)
//var io = require('socket.io').listen(app)

var app = express();
fileserve.configure(app);

app.listen(8083);
