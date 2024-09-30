import { Button, Container, Stack, TextField, Typography } from '@mui/material'
import React, { Component,useEffect, useMemo, useState } from 'react'
import {io} from 'socket.io-client'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const App=()=>{
  const [message,setMessage]=useState('')
  const [room,setRoom]= useState('')
  const [socketId,setSocketId]= useState('')
  const [messages,setMessages] = useState([])
  const [roomName,setRoomName] = useState([])

  const socket = useMemo(()=>io('http://localhost:3000'),[])
  console.log(">>>>>>>messages",messages);
  
  useEffect(() => {
    socket.on('connect',()=>{
      console.log(`>>>>>connected front end - ${socket.id}`);
      setSocketId(socket.id)
    })

    socket.on('message',(data)=>{
      console.log(`>>>>>on welcome - ${socket.id}`,data);
    })
    socket.on('welcome',(data)=>{
      console.log(`>>>>>broadcast - ${socket.id}`,data);
    })

    socket.on('message-received',(data)=>{
      setMessages((messages)=>[...messages,data])
    })

    console.log("received-----",messages);
    return()=>{
      socket.disconnect()
    }
    
  }, [])
  
  const handleSubmit=(e)=>{
    e.preventDefault()
    
    socket.emit('submit',{message,room})

  }

  const handleRoom=(e)=>{
    e.preventDefault()
    socket.emit('join-room',roomName)
    setRoomName('')
  }

  const leaveRoom=(e)=>{
    e.preventDefault()
    socket.disconnect()
  }
  
  return (
    <Container maxWidth='sm'>
      <Typography variant='h3' component='div' gutterBottom align='center'> Chat App</Typography>
      <div style={{textAlign:'center',margin:20}}><Typography>User Name - {socketId}</Typography></div>
      <form>
        <div style={{display:'flex',justifyContent:'space-evenly',margin:20}}>
          <TextField
            id='outlined-basic' 
            label='Room Name' 
            value={roomName}
            onChange={(e)=>setRoomName(e.target.value)}     
          />
          <Button variant='contained' color='primary' onClick={(e)=>handleRoom(e)} >
            Join
          </Button>
          <Button variant='contained' color='error' onClick={(e)=>leaveRoom(e)}>
            Leave
          </Button>
          </div>
      </form>
      <form onSubmit={handleSubmit}>        
        <div style={{display:'flex',justifyContent:'space-evenly'}}>
        <TextField
          id='outlined-basic' 
          label='Input' 
          value={message}
          onChange={(e)=>setMessage(e.target.value)}     
        />
        <TextField
          id='outlined-basic' 
          label='Room' 
          value={room}
          onChange={(e)=>setRoom(e.target.value)}     
        />
        <Button variant='contained' color='primary' type='submit'>
          Send
        </Button>
        </div>
      </form>
<Stack spacing={2}>
    {messages?.map((m, i) => (
        <Card key={i} variant="outlined">
            <CardContent>
                <Typography variant='h6'>
                    User reply - {m}
                </Typography>
            </CardContent>
        </Card>
    ))}
</Stack>
    </Container>
  )
}

export default App