/// <reference path="./jquery-3.6.0.min.js" />
const DOM = document.getElementById("mainDiv")

const coinStorage = [];
const currencyStorage = [];
let fetchedCoin = [];

const config = {
    allCoins: "https://api.coingecko.com/api/v3/coins/list/",
    fiftyCoins: "https://api.coingecko.com/api/v3/coins/",
}

const api = {
    getCoins: function (url) {
        return new Promise((resolve) => {
            $.ajax({
                url: url,
                method: "GET",
                success: function (coins) {
                    resolve(coins)
                },
                error: function () {
                    alert("error")
                    // alert(xhr.status);
                    // alert(thrownError);
                }
            })
        })
    }
}


function bringData(){
         api.getCoins(config.allCoins).
         then(res => {
             coinStorage.push(res)
         }),
         api.getCoins(config.fiftyCoins).
         then(res => {
            currencyStorage.push(res)
            draw(currencyStorage)
         })
 }
function coinInfo(coin){
    const url = `https://api.coingecko.com/api/v3/coins/${coin}`
    api.getCoins(url).
    then(res => {
        fetchedCoin.push(res)
    })
}
$(() => {
    init();
});

function init(){
    coinInfo("bitcoin") // demo look up coin
    console.log(fetchedCoin);
        bringData();
    console.log(currencyStorage, coinStorage);


    

}

function drawNote(currency) {
    const {
        mainDiv
    } = DOM
    const {
        name,
        symbol,
        id
    } = currency


     let currencyMainDiv = document.createElement("div")
     currencyMainDiv.classList.add("card", "col-sm", "currencyDiv")
     currencyMainDiv.id = id

    // let currencyBodyDiv = document.createElement("div")
    // currencyBodyDiv.classList.add("card-body")
    // currencyMainDiv.appendChild(currencyBodyDiv)

    // let toggleInput = document.createElement("input")
    // toggleInput.classList.add("btn.btn-outline-secondary")
    // toggleInput.type = "checkbox"
    // toggleInput.dataset = "toggle"
    // toggleInputautocomplete = "off"
    // currencyBodyDiv.appendChild(toggleInput)

    // let currencySymbol = document.createElement("h5")
    // currencySymbol.classList.add("card-title")
    // currencySymbol.innerHTML = symbol
    // currencyBodyDiv.appendChild(currencySymbol)

    // let currencyName = document.createElement("p")
    // currencyName.classList.add("card-text")
    // currencyName.innerHTML = name
    // currencyBodyDiv.appendChild(currencyName)

    // let moreInfoButton = document.createElement("button")
    // moreInfoButton.classList.add("btn", "btn-primary")
    // moreInfoButton.innerHTML = "More Info"
    // // moreInfoButton.addEventListener("click", showMoreInfo)
    // currencyBodyDiv.appendChild(moreInfoButton)

    DOM.appendChild(currencyMainDiv)
}

function draw(data){
    DOM.innerHTML = "";
    
    for (const key in data) {
        for (let i = 0; i < data.length; i++) {
            console.log(key[i]);
            
        }
   
    }

    // drawNote([i])
    


}










// console.log(currencyStorage, coinStorage);

// build a new
// function draw(array) {

    // DOM.mainDiv.innerHTML = ""
    // for (let index = 0; index < 5; index++) {
    //     drawNote(array[index])
    // }
