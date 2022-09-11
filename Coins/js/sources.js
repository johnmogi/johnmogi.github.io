/// <reference path="./lib/jquery-3.4.1.js" />

const config = {
    allCoins: "https://api.coingecko.com/api/v3/coins/list/",
    fiftyCoins: "https://api.coingecko.com/api/v3/coins/"
}
const api = {
    retreiveCurrencies: function () {
        return new Promise((resolve) => {
            $.ajax({
                url: config.fiftyCoins,
                method: "GET",
                success: function (currencies) {
                    resolve(currencies)
                },
                error: function () {
                    alert("error")
                    // alert(xhr.status);
                    // alert(thrownError);
                }
            })
        })
    }
    // ,
    // retrieveCurrencyId: function (id) {
    //     return new Promise((resolve) => {
    //         $.ajax({
    //             url: `${config.allCoins}/${id}`,
    //             method: "GET",
    //             success: function (coinso) {
    //                 resolve(coinso)
    //             }
    //         })
    //     })

    // }

}