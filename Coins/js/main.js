/// <reference path="./lib/jquery-3.4.1.js" />
// $('body').bootstrapMaterialDesign();

const tempArr = [];

$(() => {

    function init() {
        // tempArr.length = 0;
        $("#stage").html("")
        // spinner("divCoins");
    }

    function spinner() {
        const spin = `
<div class="spinner-grow text-success mx-auto" role="status">
<span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-danger mx-auto" role="status">
<span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-warning mx-auto" role="status">
<span class="sr-only">Loading...</span>
</div>
`;
        $("#stage").html(spin)
    }



    $(() => {

        spinner()
        //* actual demo of retrive delay with spinner:
        // setTimeout(() => {

        api.retreiveCurrencies().
        then(res => {
            saveTheCurrencies(res.slice(0, 8))
        })

        function saveTheCurrencies(result) {
            tempArr.push(result)
            draw(result)
        }

        function getCoin(result) {
            console.log(result)

        }

        function draw(array) {
            init();
            // array.length
            for (let i = 0; i < 8; i++) {
                drawCoin(array[i])
            }
        }


        //? actual demo of retrive delay with spinner:
        // }, 1000);

    });
}); //RF