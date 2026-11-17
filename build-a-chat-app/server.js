
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

// Create HTTP server
const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Broadcast messages to all connected clients
function broadcast(message) {
  const data = JSON.stringify(message);

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
}

// Handle new WebSocket connections
wss.on('connection', (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );

  // Broadcast user joined message
  broadcast({
    type: 'system',
    text: `${username} joined`,
  });

  // Handle incoming messages
  socket.on('message', (message) => {
    const { username, text } = JSON.parse(message.toString());

    broadcast({
      type: 'chat',
      username,
      text,
    });
  });

  // Handle user disconnection
  socket.on('close', () => {
    broadcast({
      type: 'system',
      text: `${username} left`,
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log('Chat server running at http://localhost:3001');
});
