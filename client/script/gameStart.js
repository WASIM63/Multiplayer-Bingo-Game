let remainingTime=0;

function timer(player){
    return new Promise((resolve)=>{
        const duration = 5;
        remainingTime = duration;
        
        const circle = player;
        // const timerText = document.getElementById('timer');
        const interval = setInterval(async() => {
            remainingTime--;
            // timerText.textContent = remainingTime;
            const percentage = (remainingTime / duration) * 100;
            if(percentage>=25){
                circle.style.background = `conic-gradient(yellow ${percentage}%, transparent ${percentage}%)`;
            }else{
                circle.style.background = `conic-gradient(red ${percentage}%, transparent ${percentage}%)`;
            }
            if (remainingTime <= 0) {
                clearInterval(interval);
                resolve();
            }
        }, 1000);
    })
}
let autoClk=0;
function clicked2(cellId){
    const cell=document.getElementById(cellId);
    let circle=document.createElement('div');
    circle.classList.add('circle');
    cell.append(circle);
    matrix[cellId[0]-'0'][cellId[1]-'0']=1;
    matching(cellId);
    console.log(cell.innerText);
    clickedNo=cell.innerText;
}

function autoClick(player){
    return new Promise(async (resolve)=>{
        if(player==data.name){
            let randomCell='';
            do{
                randomCell='';
                randomCell+=`${Math.floor(Math.random()*5)}`;
                randomCell+=`${Math.floor(Math.random()*5)}`;
            }while(document.getElementById(randomCell).children.length);
            const cell=document.getElementById(randomCell);
            socket.emit('autoClicked',{roomId:data.roomId,cell:cell.innerText});
        }
        setTimeout(()=>{
            resolve();
        },1000)
    })
}

let isBreak=0;
let s=0;
async function startGame(){
    for(let player of document.querySelectorAll('.timerRing')){
        if(isBreak) break;
        if(player.id==data.name){
            clickable('hidden');
        }
        if(player.id!='won'){
            temp=await timer(player);
        }
        clickable('visible');
        if(clk==0){
            await autoClick(player.id);
        }
        clk=0;
    }
    if(s==0){
        startGame();
    }
}

// '','/images/1st.png','/images/2nd.png','/images/3rd.png',`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
let winner=0;
const winningData=['','1st 🥇','2nd 🥈','3rd 🥉','th'];
const winners=[];

function finish(winners){
    s=1;
    isBreak=1;
    remainingTime=0;
    clickable('visible');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result').classList.add('visible');
    let resultDisplay=document.getElementById('resultDisplay');
    let i;
    for(i=0;i<winners.length-1;i++){
        let para=document.createElement('p');
        let position=(i<=3)?`${winningData[i+1]}`:`${i}+${winningData[4]}`;
        para.innerText=`${winners[i]} :: ${position}`;
        position='';
        resultDisplay.append(para);
    }
    let para=document.createElement('p');
    para.innerText=`${winners[i]} :: Last😭🤧`;
    resultDisplay.append(para);
}

function afterWinning(name){
    winner+=1;
    console.log('winners :',winner," ",totalPlayers);
    remainingTime=0;
    winners.push(name);
    for(let player of document.querySelectorAll('.timerRing')){
        if(player.id==name){
            if(winner<=3){
                // player.style.backgroundImage=`url(${winningData[winner]})`;
                player.innerText=`${name}\n${winningData[winner]}`;
            }else{
                // player.style.backgroundColor=`${winningData[4]}`;
                player.innerText=`${name}\n${winner+winningData[4]}`;
            }
            console.log(player,player.innerText);
            player.id='won';
        }
    }
    if((totalPlayers-1==winner) && (name==data.name)){
        console.log('called');
        socket.emit('finished',{roomId:data.roomId,winners});
    }
}