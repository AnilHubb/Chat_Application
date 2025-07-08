// Import necessary modules
const express = require('express'); // For serving HTML/CSS/JS files
const http = require('http');       // Core Node.js HTTP server
const WebSocket = require('ws');    // For WebSocket communication
const path = require('path');       // For handling file paths

// Initialize express app and server
const app = express();
const server = http.createServer(app);

// Create a WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// Store chat rooms and user connections
let rooms = {}; // Format: { roomName: [socket1, socket2, ...] }
let users = {}; // Format: { socketId: { username, room } }

// Function to broadcast the list of available rooms to all connected clients
function broadcastRoomList() {
  const roomList = Object.keys(rooms); // Get all room names
  const payload = JSON.stringify({ type: 'rooms', rooms: roomList }); // Send as a WebSocket message

  // Loop through each connected client and send room list
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Handle new WebSocket connection
wss.on('connection', (socket) => {
  // Assign a unique ID to each connected socket
  socket.id = Date.now() + Math.random().toString(36).substr(2, 9);

  // Handle messages received from the client
  socket.on('message', (data) => {
    const msg = JSON.parse(data); // Parse the incoming JSON
    const { room, user, text, type } = msg;

    // If the client is requesting available rooms
    if (type === 'getRooms') {
      const roomList = Object.keys(rooms);
      socket.send(JSON.stringify({ type: 'rooms', rooms: roomList }));
      return;
    }

    // If a user is trying to join a room
    if (type === 'join') {
      const roomSockets = rooms[room] || [];

      // Check if the username is already taken in this room
      const isDuplicate = roomSockets.some(s => users[s.id]?.username === user);
      if (isDuplicate) {
        socket.send(JSON.stringify({ type: 'error', text: 'Username already taken in this room.' }));
        return;
      }

      // Save user info
      users[socket.id] = { username: user, room };
      socket.room = room;

      // Add socket to room
      if (!rooms[room]) rooms[room] = [];
      rooms[room].push(socket);

      // Notify everyone about updated rooms
      broadcastRoomList();
    }

    // If a user sends a chat message
    if (type === 'message') {
      if (rooms[room]) {
        // Send the message to every user in the room
        rooms[room].forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ user, text, room }));
          }
        });
      }
    }
  });

  // Handle user disconnect
  socket.on('close', () => {
    const { room } = users[socket.id] || {};

    // Remove the socket from the room
    if (room && rooms[room]) {
      rooms[room] = rooms[room].filter(client => client !== socket);
      // If room is empty, delete it
      if (rooms[room].length === 0) delete rooms[room];
    }

    // Remove user info
    delete users[socket.id];

    // Notify everyone about updated room list
    broadcastRoomList();
  });
});

// Serve static files (index.html, style.css, client.js, etc.)
app.use(express.static(__dirname));

// Route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});



