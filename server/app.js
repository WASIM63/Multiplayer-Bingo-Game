const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const path=require('path');

const port=process.env.PORT || 3000;

const {Server}=require('socket.io');
const io=new Server(server);

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static(path.join(__dirname,'../client/css')));
app.use(express.static(path.join(__dirname,'../client/html')));
app.use(express.static(path.join(__dirname,'../client/script')));
// console.log(path.join(__dirname,'./jsFiles/socketFile.js'));

app.get('/',(req,res)=>{
    res.sendFile('/index.html');
});

let data;
app.post('/create-room',(req,res)=>{
    data=req.body;
    console.log(data);
})

const {socketFunction}=require('./jsFiles/socketFile');
socketFunction(io,data);

server.listen(port,()=>{
    console.log(`http://localhost:${port}`);
});


