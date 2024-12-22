
let count=0;
function win(){
    count+=1;
    console.log('line no:',count);
    if(count>=1){
        console.log('WIN');
        socket.emit('win',{name:data.name,roomId:data.roomId});
        for(let cell of document.querySelectorAll('.cell')){
            cell.removeAttribute('onclick');
        }
    }
}

// 5x5 matrix
let matrix=new Array(5).fill().map(()=>new Array(5).fill(0));

function drawLine(cellId,line){
    for(let child of document.getElementById(cellId).children){
        console.log(child.className);
        if(child.className==line){
            console.log('returned');
            return;
        }
    }
    win();
    let cell;
    for(let i=0;i<5;i++){
        if(line=='rowLine'){cell=document.getElementById(`${cellId[0]-'0'}${i}`);}
        else if(line=='colLine'){cell=document.getElementById(`${i}${cellId[1]-'0'}`);}
        else if(line=='leftDiagonalLine'){cell=document.getElementById(`${i}${i}`);}
        else{cell=document.getElementById(`${i}${5-i-1}`);}
        let lines=document.createElement('div');
        lines.classList.add(line);
        cell.append(lines);
    }
}
let left=0;
let right=0;
async function matching(cellId){
    let rowSum=0;
    let colSum=0;
    let leftDiagonalSum=0;
    let rightDiagonalSum=0;
    for(let i=0;i<5;i++){
        rowSum+=matrix[cellId[0]-'0'][i];
        colSum+=matrix[i][cellId[1]-'0'];
        leftDiagonalSum+=matrix[i][i];
        rightDiagonalSum+=matrix[i][5-i-1];
    }
    if(rowSum==5){await drawLine(cellId,'rowLine')}
    if(colSum==5){await drawLine(cellId,'colLine')}
    if(leftDiagonalSum==5 && left==0){await drawLine(cellId,'leftDiagonalLine');left=1;}
    if(rightDiagonalSum==5 && right==0){await drawLine(cellId,'rightDiagonalLine');right=1;}
}

function joinRoomPop(){
    const joinRoomPop=document.getElementById('joinRoomPop');
    if(joinRoomPop.classList.value=='hidden'){
        joinRoomPop.classList.remove('hidden');
        joinRoomPop.classList.add('visible');
    }else{
        joinRoomPop.classList.remove('visible');
        joinRoomPop.classList.add('hidden');
    }
}
function createRoomPop(){
    const createRoomPop=document.getElementById('createRoomPop');
    if(createRoomPop.classList.value=='hidden'){
        createRoomPop.classList.remove('hidden');
        createRoomPop.classList.add('visible');
    }else{
        createRoomPop.classList.remove('visible');
        createRoomPop.classList.add('hidden');
    }
}
function hide(){
    document.getElementById('joinRoomPop').classList.add('hidden');
    document.getElementById('joinRoomPop').classList.remove('visible');
    document.getElementById('createRoomPop').classList.add('hidden');
    document.getElementById('createRoomPop').classList.remove('visible');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('result').classList.remove('visible');
}

let clk=0;
function clicked(cellId){
    return new Promise((resolve)=>{
        // console.log('Clicked');       
        const cell=document.getElementById(cellId);
        let circle=document.createElement('div');
        circle.classList.add('circle');
        cell.append(circle);
        matrix[cellId[0]-'0'][cellId[1]-'0']=1;
        matching(cellId);
        console.log(cell.innerText);
        
        clickedNo=cell.innerText;
        socket.emit('clicked',{roomId:data.roomId,cell:cell.innerText});
        clk=1;
        remainingTime=0;
        resolve();
    })
}

const box=document.getElementById('outerBox');
const array=new Array(25).fill(0);
for(let i=0;i<25;i++){
    const cell=document.createElement('div');
    cell.classList.add('cell');
    box.append(cell);
    cell.id=`${Math.floor(i/5)}${i%5}`;
    cell.setAttribute('onclick',`clicked('${cell.id}')`);
    let ran;
    do{
        ran=Math.floor(Math.random()*26);
    }while(array[ran]==1 || ran==0);
    cell.innerText=ran;
    cell.setAttribute('value',ran);
    array[ran]=1;
}
