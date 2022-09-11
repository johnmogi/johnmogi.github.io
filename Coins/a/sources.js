const config = {
    mainUrl: "https://api.coingecko.com/api/v3/coins/list",
    currencyInfoUrl: "https://api.coingecko.com/api/v3/coins"
}
const api = {
    getAllCurrencies: function () {
        return new Promise((resolve) => {
            $.ajax({
                url: config.mainUrl,
                method: "GET",
                success: function (currencies) {
                    resolve(currencies)
                },
            })
        })
    },
    getCurrencyInfo: function (id) {
        return new Promise((resolve) => {
            $.ajax({
                url: `${config.currencyInfoUrl}/${id}`,
                method: "GET",
                success: function (currency) {
                    resolve(currency)
                },
            })
        })

    }

}