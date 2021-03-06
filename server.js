const express=require('express')
const req = require('express/lib/request')
const app=express()
const server =require('http').Server(app)
const io=require('socket.io')(server)
const port = process.env.PORT||8000
const { v4: uuidV4 } = require('uuid')

app.set('view engine','ejs')
app.use(express.static('public'))
//app.use('/',express.static(__dirname+'/view'))
app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('rooms',{ roomId: req.params.room })
})


io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('user-connected', userId)
      socket.on('disconnect',()=>{
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
      })
     
    })

    
  })
server.listen(port,()=>{
    console.log(`server listening at http://localhost:${port}`)
})
