let players=document.getElementById('players');
function addPlayer(name){
    console.log("2 "+name);
    let timerRing=document.createElement('div');
    timerRing.classList.add('timerRing');
    players.append(timerRing);

    let player=document.createElement('div');
    player.classList.add('player');
    timerRing.append(player);

    timerRing.id=name;
    player.id=name;
    player.innerText=name;
    if(data.name==name){
        player.innerText='';
        player.innerText='YOU';
    }
    player.style.backgroundColor='white';
}

// function removePlayer(name){
//     for(let player of document.querySelectorAll('.player')){
//         if(player.id==name){
//             players.removeChild(player);
//         }
//         break;
//     }
// }