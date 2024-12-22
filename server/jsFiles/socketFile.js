let rooms=new Map();


function playersInRoom(roomId,name){
    if(!rooms.has(roomId)){
        rooms.set(roomId,[]); 
    }
    const array=rooms.get(roomId);
    array.push(name);
    rooms.set(roomId,array);
    return rooms.get(roomId);
}

function removePlayerFromRoom(roomId,name){
    const array=rooms.get(roomId);
    const array2=array.filter(player=>player!=name);
    rooms.set(roomId,array2);
    return array2;
}

let closedRoom=[];
function socketFunction(io){
    io.on('connection',(socket)=>{
        console.log(socket.id);
        
        socket.on('room',(data)=>{
            if(data.isJoinning && rooms.has(data.roomId)){
                socket.emit('roomNotExist');
            }
            if(!closedRoom.includes(`${data.roomId}`)){
                console.log(typeof(data.roomId));
                const players=playersInRoom(`${data.roomId}`,data.name);
                console.log(players);
                socket.join(data.roomId);
                // socket.emit('msg',`You have joined to room ID ${data.roomId}`);
                io.to(data.roomId).emit('msg',{msg:`${data.name} has joined`,msg2:'joined',players});
            }else{
                socket.emit('room-closed');
            }
        });
        socket.on('ready',(roomId)=>{
            io.to(roomId).emit('ready',null);
        })

        socket.on('room-close',(data)=>{
            closedRoom.push(`${data.roomId}`);
            io.to(data.roomId).emit('room-close',data.count);
        })

        socket.on('clicked',(data)=>{
            io.to(data.roomId).emit('clicked',data.cell);
        })
        socket.on('autoClicked',(data)=>{
            io.to(data.roomId).emit('autoClicked',data.cell);
        })

        socket.on('win',(data)=>{
            io.to(data.roomId).emit('win',data.name);
        })

        socket.on('leaveRoom',(data)=>{
            const players=removePlayerFromRoom(`${data.roomId}`,data.name);
            socket.leave(data.roomId);
            io.to(data.roomId).emit('msg',{mag:`${data.name} has leave this room`,msg2:'leaved',players});

        })

        socket.on('finished',(data)=>{
            const players=rooms.get(`${data.roomId}`);
            console.log(players,data);
            for(let player of players){
                if(!data.winners.includes(player)) data.winners.push(player);
            }
            io.to(data.roomId).emit('finished',data.winners);
        })
    
        socket.on('disconnect',()=>{
            console.log(`${socket.id} has disconnected.`);
        })
    })
}
module.exports={socketFunction};