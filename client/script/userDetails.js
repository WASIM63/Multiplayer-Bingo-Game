// const imageInput = document.getElementById('img');
// const imageContainer = document.getElementById('player');
// imageInput.addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             console.log(`url(${e.target.result})`);
//             imageContainer.style.backgroundImage = `url(${e.target.result})`;
//         };
//         reader.readAsDataURL(file);
//     }
// });

const data={//player's data
    image:null,
    name:null,
    board:null,
    roomId:null,
    isJoinning:false
}

async function api(roomId){
    let board;
    for(let option of document.getElementsByName('boxSize')){//getting radio value
        if(option.checked){
            board=option.value;
        }
    }
    data.image=document.getElementById('img') || null;
    data.name=document.getElementById('name').value;
    data.board=board;
    data.roomId=roomId;
    socket.emit('room',data);
}

function displayRoom(){
    let idNo=document.getElementById('idNo');
    idNo.innerText=`ROOM  :  ${data.roomId}`;

    let room2=document.getElementById('room2');
    room2.classList.remove('hidden');
    room2.classList.add('visible');
}

function createRoom(){
    if(document.getElementById('name').value==''){
        alert('Plese enter your name⚠️');
        return;
    }
    let roomId;
    do{
        roomId=Math.floor(Math.random()*1000000);
    }while(roomId<100000);
    hide();//to hide the create room pop up
    api(roomId);
    return roomId;
}

function joinRoom(){
    if(document.getElementById('Jname').value==''){
        alert('Plese enter your name⚠️');
        return;
    }
    data.image=document.getElementById('Jimg').value || null,
    data.name=document.getElementById('Jname').value,
    data.roomId=+(document.getElementById('roomId').value);
    data.isJoinning=true;
    socket.emit('room',data);
    hide();
}

function leave(){
    let room2=document.getElementById('room2');
    room2.classList.add('hidden');
    room2.classList.remove('visible');
    socket.emit('leaveRoom',data);
    socket.emit('room-close',{roomId:data.roomId,count:totalPlayers-1});
    location.reload();
}


// const data={
//     image:document.getElementById('img'),
//     name:document.getElementById('name'),
//     roomId:document.getElementById('roomId'),
//     image:document.getElementsByName('boxSize'),
// }