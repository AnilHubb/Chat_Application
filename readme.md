# 💬 Real-Time Chat Application

A simple web-based real-time chat app where users can join or create chat rooms and chat instantly with others.

---

## 🔧 Technologies Used

- HTML, CSS
- JavaScript (ES6+)
- Node.js
- WebSocket (ws)

---

## 🚀 Features

- Create or join chat rooms
- Real-time message exchange
- Unique usernames per room
- Auto-updating room list
- Fully responsive UI for all devices

---

## 📌 How to Run This Project

1. **Install Node.js**  
   - First, download and install Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)  
   - After installation, open your terminal or command prompt and type `node -v` to confirm that Node.js is installed.

2. **Set Up the Project Files**  
   - Place the following files into a single folder:  
     - `index.html` (the main webpage)  
     - `style.css` (for styling the chat UI)  
     - `script.js` (handles frontend WebSocket and user interaction logic)  
     - `server.js` (backend server using Node.js and WebSockets)

3. **Install Dependencies**  
   - Open a terminal or command prompt in the project folder.  
   - Run the command:  
     `npm init -y`  
     This creates a `package.json` file.  
   - Then install the necessary packages:  
     `npm install express ws`  
     This installs Express (web server) and `ws` (WebSocket library).

4. **Start the Server**  
   - In the terminal, run:  
     `node server.js`  
   - If everything works correctly, you'll see:  
     `Server running at http://localhost:3000`

5. **Use the Chat App**  
   - Open your browser and go to:  
     `http://localhost:3000`  
   - Enter a username, choose or create a room, and click **Join Chat**.  
   - Start chatting with others in real-time!

---

## 📝 Notes

- Duplicate usernames in a room are blocked
- Empty messages or no room name are not allowed
- You can create as many rooms as you want
- If all users leave a room, it disappears from the list

---

## Thank You 😊.
