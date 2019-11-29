#!/usr/bin/env node
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wsServer = new WebSocket.Server({ noServer: true });
var port = (process.env.PORT || 5000);

function broadcast(wsServer, ws, message) {
  wsServer.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
wsServer.on('connection', (ws, req) => {
  var ip = req.connection.remoteAddress;
  broadcast(wsServer, ws, '{ "type": "connected", "payload": { "ip": "' + ip +'"}}')
  ws.on('message', (message) => {
    broadcast(wsServer, ws, message);
	});
  ws.on('close', () => {
    console.log((new Date()) + ' Peer on ip ' + ip + ' disconnected!');
    broadcast(wsServer, ws, '{ "type": "disconnected", "payload": { "ip": "' + ip +'"}}')
  });
});

server.on('upgrade', function upgrade(request, socket, head) {
  wsServer.handleUpgrade(request, socket, head, function done(ws) {
    wsServer.emit('connection', ws, request);
  });
});

console.log((new Date()) + ' Server is listening on port ' + port);
server.listen(port);
