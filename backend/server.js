const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { handleSocketEvents } = require('./competition');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// socket bağlantılarının dinlenmesi
io.on('connection', (socket) => {
    console.log('A user connected');  
    handleSocketEvents(socket, io);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server running on port 5000');
});
