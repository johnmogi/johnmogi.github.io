fetch("https://johnmogi.github.io/Dungeon/data/character.json")
.then(res => res.json())
.then(data => console.log(data))

const diceBut6 = document.getElementById('diceBut6')
const monsterBut = document.getElementById('monsterBut')

const dice_6 = document.getElementById('dice_6')
const monsterBoard = document.getElementById('monster-board')

diceBut6.onclick = function() {drawDice(6)};
diceBut10.onclick = function() {drawDice(10)};
diceBut20.onclick = function() {drawDice(20)};
monsterBut.onclick = function() {generetaMonster()};


function drawDice(num){
    `dice_${num}`.innerText = ''   
    let res = Math.floor(Math.random() * num +1);
    return dice_6.innerText = res;
   }

   function generetaMonster(){

   }