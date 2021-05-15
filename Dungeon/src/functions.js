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
function age() {
  return;
}
const chars = {
  boyFirstName: maleFirstNames,
  girlFirstName: femaleFirstNames,
  lastName: lastName,
  type: charsTypes,
  age: genereteNum(),
  proffession: "",
  life: "",
  magic: "",
  strength: "",
  rank: "",
  experience: "",
  equipment: "",
  limitations: "",
  weakness: "",
};

const diceBut6 = document.getElementById("diceBut6");
const monsterBut = document.getElementById("monsterBut");
const charBut = document.getElementById("characterBut");

const dice_6 = document.getElementById("dice_6");
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
charBut.onclick = function () {
  generetaHero();
};

function genereteNum() {
  return Math.floor(Math.random() * 45 + 1);
}

function drawDice(num) {
  `dice_${num}`.innerText = "";
  let res = Math.floor(Math.random() * num + 1);
  return (dice_6.innerText = res);
}
function randomValue(key) {
  console.log(key);
  return key[
    Object.keys(key)[Math.floor(Math.random() * Object.keys(key).length)]
  ];
}
function generetaHero() {
  characterBoard.innerText = "";
  let boyName = randomValue(chars.maleFirstNames);
  console.log(boyName);
  //   characterBoard.innerText += boyName;

  randomValue(chars.girlFirstName);
  randomValue(chars.lastName);
  randomValue(chars.type);
}
