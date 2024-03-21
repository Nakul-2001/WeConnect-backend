const express = require('express');
const app = express();

const http = require('http');
const {Server} = require('socket.io');

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        credentials:true,
    }
})

const usersSocketMap = {};  //{useId : socketId}

const getReceiverSocketId = (receiverId) => {
    return usersSocketMap[receiverId];
}

io.on("connection",(socket)=>{

    console.log("user connected",socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) usersSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers',Object.keys(usersSocketMap));

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
        delete usersSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(usersSocketMap));
    })
})

module.exports = {app,server,io,getReceiverSocketId};