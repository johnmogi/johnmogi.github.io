// API Configuration and Functions
const API_PROVIDERS = [
    {
        name: 'cryptocompare',
        baseUrl: 'https://min-api.cryptocompare.com/data',
        marketUrl: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,USDT,SOL,MNT&tsyms=USD',
        useProxy: false
    },
    {
        name: 'coingecko',
        baseUrl: 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3',
        marketUrl: 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h',
        useProxy: true
    }
];

let currentApiProvider = 0;

async function listMarkets() {
    // Try each API provider in sequence
    for (let i = currentApiProvider; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            console.log(`Trying ${provider.name} API...`);

            const response = await fetch(provider.marketUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Raw response from ${provider.name}:`, data);

            // Transform data based on provider
            const transformedData = await transformApiData(data, provider.name);
            console.log(`Successfully loaded ${transformedData.length} coins from ${provider.name}`);

            // If successful, update current provider and return data
            currentApiProvider = i;
            return transformedData;

        } catch (error) {
            console.warn(`${API_PROVIDERS[i].name} API failed:`, error.message);
            continue;
        }
    }

    // If all APIs fail, throw error
    throw new Error('All API providers failed');
}

async function transformApiData(data, providerName) {
    if (providerName === 'cryptocompare') {
        // Transform CryptoCompare format to match our expected format
        if (data.RAW && data.RAW.USD) {
            return Object.entries(data.RAW.USD).map(([symbol, coinData]) => ({
                id: symbol.toLowerCase(),
                symbol: symbol.toLowerCase(),
                name: symbol.toUpperCase(),
                image: `https://assets.coingecko.com/coins/images/1/large/${symbol.toLowerCase()}.png`, // Placeholder
                current_price: coinData.PRICE,
                market_cap: coinData.MKTCAP,
                price_change_percentage_24h: coinData.CHANGEPCT24HOUR
            }));
        }
    } else if (providerName === 'coingecko') {
        // Handle CoinGecko format (existing logic)
        if (data && data.status && data.status.error_code) {
            throw new Error(`API Error ${data.status.error_code}: ${data.status.error_message || 'Unknown error'}`);
        }

        if (data && typeof data === 'object' && data.status && !Array.isArray(data)) {
            throw new Error(`API returned error status: ${JSON.stringify(data.status)}`);
        }

        if (!Array.isArray(data)) {
            throw new Error('API did not return expected data format');
        }

        return data;
    }

    throw new Error(`Unknown provider: ${providerName}`);
}
