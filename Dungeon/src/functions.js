const diceBut = document.getElementById('diceBut')
const monsterBut = document.getElementById('monsterBut')


var canvas = document.getElementById("dice_6");
var ctx = canvas.getContext("2d");
ctx.font = "50px Arial";

diceBut.onclick = function() {drawDice()};


function drawDice(){
    canvas.width += 0

    let num = Math.floor(Math.random() * 6);
    return ctx.fillText(num, 10, 50);
   }
