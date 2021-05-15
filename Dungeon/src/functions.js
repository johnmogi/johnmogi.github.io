const maleFirstNames = [
  "og",
  "zorg",
  "bran",
  "bill",
  "john",
  "danny",
  "sam",
  "skip",
  "koko",
  "sal",
  "roger",
  "roe",
  "simson",
  "soso",
  "jany",
];
const femaleFirstNames = [
  "ruth",
  "gal",
  "cinthya",
  "brolla",
  "georgie",
  "hilda",
  "balbala",
  "loney",
  "merka",
  "jenny",
  "sara",
  "daria",
  "borfa",
  "entrapta",
  "sugar",
];

const charsTypes = [
  "human",
  "orc",
  "elf",
  "hobbit",
  "dwarf",
  "undead",
  "lizard",
  "snake",
  "bear",
  "cat",
  "dino",
  "centaur",
  "mech",
];

const lastName = [
  "banana",
  "cohen",
  "lashala",
  "sonson",
  "rara",
  "moglior",
  "radibia",
  "birdala",
  "poka",
  "rigalux",
];
const proffession = [  'magician', 'witch', 'monk' ,'warrior',  'thief', 'bard', 'pirate', 'acrobat'
]
const chars = {
  boyFirstName: maleFirstNames,
  girlFirstName: femaleFirstNames,
  lastName: lastName,
  type: charsTypes,
  age: genereteNum(),
  proffession: proffession,
  life: '',
  magic: "",
  strength: "",
  rank: "",
  experience: "",
  equipment: "",
  limitations: "",
  weakness: "",
};

const monsterBut = document.getElementById("monsterBut");
const charBut = document.getElementById("characterBut");
const monsterBoard = document.getElementById("monster-board");
const characterBoard = document.getElementById("character-board");

diceBut6.onclick = function () {
  drawDice(6);
};
diceBut10.onclick = function () {
  drawDice(10);
};
diceBut20.onclick = function () {
  drawDice(20);
};
diceBut4.onclick = function () {
  drawDice(4);
};
diceBut12.onclick = function () {
  drawDice(12);
};
diceBut100.onclick = function () {
  drawDice(100);
};
charBut.onclick = function () {
  generetaHero();
};

function genereteNum(num, base) {
  return Math.floor(Math.random() * num + base);
}

function drawDice(num) { 
  // `dice_${num}`
  dice_results.innerText = "";
  let res = Math.floor(Math.random() * num + 1);
  return (dice_results.innerText = res);
}
function randomValue(key) {
  return key[
    Object.keys(key)[Math.floor(Math.random() * Object.keys(key).length)]
  ];
}
function generetaHero() {
  characterBoard.innerText = "";
const br = '<br/>';
const charName = 'Boy Name: '
const girlName = 'Girl Name: '
const lastName = 'Family Name: '
const charType = 'Type: '
const charAge = 'Age: '
const charPro = 'Proffession: '
let magicCaster = 
characterBoard.innerHTML += charName + randomValue(chars.boyFirstName) + br;
characterBoard.innerHTML += girlName + randomValue(chars.girlFirstName)+ br;
characterBoard.innerHTML += lastName + randomValue(chars.lastName)+ br;
characterBoard.innerHTML += charType +  randomValue(chars.type)+ br;
characterBoard.innerHTML += charAge + genereteNum(75,12) + br;
characterBoard.innerHTML += charPro + randomValue(chars.proffession) + br;
characterBoard.innerHTML += "life : " + genereteNum(drawDice(6),6) + br;
console.log(chars.proffession );
if (chars.proffession == proffession[0]){
  
}
characterBoard.innerHTML += "Magic : " + genereteNum(drawDice(6),6);
}

function init(){
  drawDice(6)
  generetaHero();
}

init();