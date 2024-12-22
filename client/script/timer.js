function showStart(what){
    let startbtn=document.getElementById('start');
    if(what=='visible'){
        startbtn.classList.remove('hidden');
        startbtn.classList.add('visible');
        clickable('visible');
    }else{
        startbtn.classList.remove('visible');
        startbtn.classList.add('hidden');
    }
}

let pass=0;
let totalPlayers=0;
function start(){
    let count=0;
    for(let player of document.querySelectorAll('.player')){
        count+=1;
    }
    console.log(count);
    if(count>=2){
        socket.emit('ready',data.roomId);
        showStart('hidden');
        pass+=1;
        let host=document.querySelector('.player');
        if(host.id==data.name){
            totalPlayers=count;
            socket.emit('room-close',{roomId:data.roomId,count});
        }
    }else{
        alert('awaiting for opponent');
    }
}
function clickable(what){
    let block=document.getElementById('block');
    if(what=='visible'){
        block.classList.remove('hidden');
        block.classList.add('visible');
    }else{
        block.classList.remove('visible');
        block.classList.add('hidden');
    }
}

function isReady(){
    let play=0;
    for(let player of document.querySelectorAll('.player')){
        play+=1;
    }
    if(play!=ready){
        alert('All players are not ready');
    }
    console.log(play,ready);
}