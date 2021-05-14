/// <reference path="jquery-3.4.1.js" />

$(() => {

    $('body').bootstrapMaterialDesign();

    const State = {}
    const DOM = {
        mainDiv: document.querySelector("#stage"),
    }
    $(function () {
        api.getAllCurrencies().
        then(res => {
            saveTheCurrencies(res)
        })
    })

    function saveTheCurrencies(result) {

        draw(result)
    }

    function draw(array) {
        DOM.mainDiv.innerHTML = ""
        for (let index = 0; index < 5; index++) {
            drawNote(array[index])
        }
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

        let currencyBodyDiv = document.createElement("div")
        currencyBodyDiv.classList.add("card-body")
        currencyMainDiv.appendChild(currencyBodyDiv)

        let toggleInput = document.createElement("input")
        toggleInput.classList.add("btn.btn-outline-secondary")
        toggleInput.type = "checkbox"
        toggleInput.dataset = "toggle"
        toggleInputautocomplete = "off"
        currencyBodyDiv.appendChild(toggleInput)

        let currencySymbol = document.createElement("h5")
        currencySymbol.classList.add("card-title")
        currencySymbol.innerHTML = symbol
        currencyBodyDiv.appendChild(currencySymbol)

        let currencyName = document.createElement("p")
        currencyName.classList.add("card-text")
        currencyName.innerHTML = name
        currencyBodyDiv.appendChild(currencyName)

        let moreInfoButton = document.createElement("button")
        moreInfoButton.classList.add("btn", "btn-primary")
        moreInfoButton.innerHTML = "More Info"
        moreInfoButton.addEventListener("click", showMoreInfo)
        currencyBodyDiv.appendChild(moreInfoButton)

        mainDiv.appendChild(currencyMainDiv)
    }

    function showMoreInfo() {
        const mainDivId = this.parentElement.parentElement.id
        api.getCurrencyInfo(mainDivId).then(res => {
            console.log(res);

        })
    }
}); //RF