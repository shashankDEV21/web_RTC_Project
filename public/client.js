const socket=io('/')
const vidgrid=document.getElementById('video-grid')
const mypeer=new Peer(undefined,{
    host:'/',
    port:3001
})
const peers={}
const myvideo=document.createElement('video')
myvideo.muted=true

navigator.mediaDevices.getUserMedia({
  audio:true,
  video:true
}).then(stream=>{
  addVideoStream(myvideo,stream)
  
  mypeer.on('call',call=>{
    call.answer(stream)
    const vid=document.createElement('video')
    call.on('stream',userVideoStream=>{
      addVideoStream(vid,userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
  connectednewUser(userId,stream)
  })
  
})
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

mypeer.on('open',id=>{
    socket.emit('join-room',ROOM_CODE,id)
})

function connectednewUser(userId,stream){
const call=mypeer.call(userId,stream)
const video=document.createElement('video')
call.on('stream',userVideoStream=>{
  addVideoStream(video,userVideoStream)
})
call.on('close',()=>{
  video.remove()
})
peers[userId]=call
}

function addVideoStream(myvideo,stream){
  myvideo.srcObject=stream
  myvideo.addEventListener('loadedmetadata',()=>{
    myvideo.play()
  })
  vidgrid.append(myvideo)
}
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered refer this link for more html media elements properties

