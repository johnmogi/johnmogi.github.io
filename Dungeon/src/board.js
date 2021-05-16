
const boardMaker = document.getElementById('boardMaker');


function generateBoard(num){  
    numberOfSquares.style.border = '1px solid black';
    let baseCol = parseInt(12 / num)
    for (let i = 0; i < num; i++) {
        for (let j = 0; j < num; j++) {
            const div = document.createElement('div');
            div.classList = `col-${baseCol} card-square`
            div.id = 'square' + i + j
            boardMaker.appendChild(div)     
  }
}
}

numberOfSquares.onchange = function () {
    let boxNumber = numberOfSquares.value
    draw(boxNumber);
  };

function validate(boxNumber){
    console.log(boxNumber);
    
     // don't use 5, 7, (remove 1) 9 (add some?)
      isNaN(boxNumber) ? messageBoard.innerHTML = 'enter a number' : null; 
    if (!boxNumber){
        messageBoard.style.border = '1px solid red';
        messageBoard.innerHTML = 'enter a number'
    } 
    if(boxNumber == 5 || boxNumber == 7){
       return boxNumber = boxNumber--
    }
}

function draw(boxNumber){
    boardMaker.innerHTML= '';
    !boxNumber ? boxNumber = 4 : validate(boxNumber);


    generateBoard(boxNumber)
    createEntrance(boxNumber)
}


function createEntrance(boxNumber){
   let x = Math.floor(Math.random() * 2)
   if(x%2==0) {console.log('true');
   }
}
draw();
