import express from 'express'
const app=express()
import  http from 'http'
import cors from 'cors'
import {Server} from 'socket.io'

app.use(cors())

const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("clientConnection",(data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
  
    socket.on("send_message", (data) => {
        console.log(data);
      socket.to(data.room).emit("receive_message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });


server.listen(3001,()=>{
    console.log("server runninng");
})




