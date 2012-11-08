var fileserve = require('./fileserve')
var app = require('http').createServer(fileserve.fileserver)
var io = require('socket.io').listen(app)

app.listen(8083);
