import express from 'express';
import http from 'http'
import {Server as socketio} from 'socket.io';

const app= express()
const server = http.createServer(app)
const io = new socketio(server,{
    cors:{
        origin:'*',
        methods:['GET','POST'],
        credentials:true
    }
})
app.use(express.static('public'));

io.on('connection',async(socket)=>{
    console.log(">>>>>>Connected",socket.id)
    // to only client who send it
    
    socket.emit('message','welcome to chatbot')
    // socket.broadcast.emit('welcome',`brodcast to ${socket.id}`)

    // below code for emit with acknowledgement
    //after 5 sec it will give Error: operation has timed out
    /* try {
        const result = await socket.timeout(5000).emitWithAck('message','welcome to chatbot')
        console.log(">>>>.res",result);     
    } catch (error) {
        console.log(">>>>error",error);
        
    } */

    socket.on('message',(data)=>{
        console.log(">>>>>>>message",data)
        // to all sockets
        io.emit('message-received',data)
    })


    // is used for broadcasting messages to all other clients except the sender.
    //socket.broadcast.emit('welcome all except the sender')
    
    socket.on('disconnect',()=>{
        console.log(">>>>>diconnected",`${socket.id}`);
        
        io.emit('message','A user has left the chat')
        // (io) this will be` sent to all clients
    })

    // room is just socket id to which socket we are sending
    // can be multiple
    socket.on('submit',(data)=>{
        console.log('>>>>submitted',data)
        io.to(data.room).emit('message-received',data.message)
    })

    //joining a room
    socket.on("join-room",(room)=>{
        socket.join(room)
        console.log(">>>>>>room joined",room);
        
    })
    // leave room
    socket.on("leave-room",(room)=>{
        socket.leave(room)
        console.log(">>>>>>room leaved",room);
        
    })
})


const PORT = 3000

server.listen(PORT,()=>console.log(`>>>>> Server Running on ${PORT}`))