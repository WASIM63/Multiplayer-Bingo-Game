const socket=io();

let clickedNo=0;
socket.on('msg',(data)=>{
    console.log(data.msg);
    console.log("1 "+data.players);
    players.replaceChildren();//to remove all players
    if(data.msg2=='joined'){
        displayRoom(roomId);
        showStart('visible');
        for(let player of data.players){
            addPlayer(player);
        }
    }else{
        for(let player of data.players){
            addPlayer(player);
        }
    }
})
socket.on('roomNotExist',()=>{
    alert('Room has not yet created. Create room');
})

let ready=0;
socket.on('ready',()=>{
    ready+=1;
    let play=0;
    for(let player of document.querySelectorAll('.player')){
        play+=1;
    }
    if(play==ready && pass==1){
        startGame(0);
    }
    console.log(play,ready);

})

socket.on('room-close',(count)=>{
    totalPlayers=count;
    document.getElementById('idNo').innerText=`Toral players : ${count}`;
})

socket.on('clicked',(no)=>{
    for(let cell of document.querySelectorAll('.cell')){
        if(cell.innerText==no && no!=clickedNo){
            clicked(cell.id);
            break;
        }
    }
});

socket.on('autoClicked',(cellNo)=>{
    for(let cell of document.querySelectorAll('.cell')){
        if(cell.innerText==cellNo){
            clicked2(cell.id);
            break;
        }
    }
})

socket.on('room-closed',()=>{
    data.roomId=null;
    alert('Not available or game has started');
})

socket.on('win',(name)=>{
    console.log(`${name} won the game`);
    afterWinning(name);
})

socket.on('finished',(winners)=>{
    finish(winners);
})