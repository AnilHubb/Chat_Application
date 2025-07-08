// Declare global variables to store the WebSocket connection, current room, and current user
let socket;
let currentRoom = '';
let currentUser = '';

// Function to handle user joining the chat
function joinChat() {
  // Get the entered username, selected room, and new room name
  const username = document.getElementById('username').value.trim();
  const selectedRoom = document.getElementById('room-select').value;
  const newRoom = document.getElementById('room-name').value.trim();

  // Determine the room to join (either selected or newly created)
  const room = newRoom || selectedRoom;

  // Validate inputs
  if (!username || !room) {
    alert('Please enter username and choose/create a room');
    return;
  }

  // Create a new WebSocket connection to the server
  socket = new WebSocket('ws://localhost:3000');

  // Store the room and username globally
  currentRoom = room;
  currentUser = username;

  // When the connection is opened, send a "join" message to the server
  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'join', room, user: username }));
  };

  // Handle messages received from the server
  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    // Show error alert if username is already taken
    if (msg.type === 'error') {
      alert(msg.text);
      socket.close();
      return;
    }

    // Update the list of available rooms when received
    if (msg.type === 'rooms') {
      updateRoomList(msg.rooms);
      return;
    }

    // Display received chat message in the chat box
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
    chatBox.appendChild(div);

    // Auto scroll to the bottom for the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  // Hide the login section and show the chat section
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('chat-section').classList.remove('hidden');
}

// Function to send a message to the server
function sendMessage() {
  const input = document.getElementById('message-input');
  const text = input.value.trim();

  // Only send if there is text and the connection is open
  if (text && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'message', user: currentUser, room: currentRoom, text }));
    input.value = ''; // Clear the input box
  }
}

// Function to update the room list dropdown
function updateRoomList(rooms) {
  const select = document.getElementById('room-select');
  select.innerHTML = `<option value="">-- Select a room --</option>`; // Default option

  // Create an option for each available room
  rooms.forEach(r => {
    const option = document.createElement('option');
    option.value = r;
    option.textContent = r;
    select.appendChild(option);
  });
}

// When the page loads, fetch the list of available rooms from the server
window.addEventListener('DOMContentLoaded', () => {
  const tempSocket = new WebSocket('ws://localhost:3000');

  // Ask for the room list when connected
  tempSocket.onopen = () => {
    tempSocket.send(JSON.stringify({ type: 'getRooms' }));
  };

  // Receive and update the room list
  tempSocket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === 'rooms') {
      updateRoomList(msg.rooms);
      tempSocket.close(); // Close the temporary socket after fetching rooms
    }
  };
});
