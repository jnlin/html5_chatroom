#!/usr/bin/env node

var WebSocketServer = require('websocket').server;
var http = require("http");
var server = http.createServer().listen(8888);

var wsServer = new WebSocketServer({
    httpServer: server,
});

var connections = [];

wsServer.on('request', function(request) {
    var connection = request.accept('chatroom', request.origin);
    connections.push(connection);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);

    connection.on('close', function() {
        console.log(connection.remoteAddress + " disconnected");
        var index = connections.indexOf(connection);
        if (index !== -1) {
            // remove the connection from the pool
            connections.splice(index, 1);
        }
    });

    connection.on('message', function(message) {
        if ('utf8' == message.type) {
            try {
                var data = JSON.parse(message.utf8Data);

                // send messages to each one
                connections.forEach(function(destination) {
                    destination.sendUTF(message.utf8Data);
                });
            } catch (ex) {
            }
        }
    });
});
