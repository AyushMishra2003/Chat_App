import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

// Import models
import User from './model/user.model.js';
import Message from './model/message.model.js';
import router from './routes/user.routes.js';

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the chat server');
});

app.use("/api/v1", router);

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('establish_connection', async ({ sender, recipient }) => {
    try {
      const senderExists = await User.findOne({ username: sender });
      const recipientExists = await User.findOne({ username: recipient });

      if (senderExists && recipientExists) {
        socket.join(sender);
        socket.join(recipient);

        socket.emit('connection_established', { success: true, message: `Connected to ${recipient}` });

        const messages = await Message.find({
          $or: [
            { sender, recipient },
            { sender: recipient, recipient: sender }
          ]
        }).sort('timestamp');
        socket.emit('message_history', messages);
      } else {
        socket.emit('error', 'Sender or recipient does not exist');
      }
    } catch (error) {
      console.error('Error in establishing connection:', error);
      socket.emit('error', 'Internal Server Error');
    }
  });

  socket.on('send_message', async ({ sender, recipient, content }) => {
    try {
        const message = new Message({ sender, recipient, content });
        await message.save();

        // Ensure messages are sent only once
        if (socket.rooms.has(sender)) {
            io.to(sender).emit('receive_message', message);
        }
        if (socket.rooms.has(recipient)) {
            io.to(recipient).emit('receive_message', message);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
});
  

  socket.on('get_message_history', async ({ sender, recipient }) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender, recipient },
          { sender: recipient, recipient: sender }
        ]
      }).sort('timestamp');

      socket.emit('message_history', messages);
    } catch (error) {
      console.error('Error fetching message history:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Export app and server
export { app, server };
