// API Configuration and Functions
const API_PROVIDERS = [
    {
        name: 'cryptocompare',
        baseUrl: 'https://min-api.cryptocompare.com/data',
        marketUrl: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,USDT,SOL,MNT&tsyms=USD',
        useProxy: false,
        retryDelay: 1000, // 1 second retry delay
        maxRetries: 2
    },
    {
        name: 'coingecko',
        baseUrl: 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3',
        marketUrl: 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h',
        useProxy: true,
        retryDelay: 2000, // 2 second retry delay for rate limits
        maxRetries: 3
    }
];

let currentApiProvider = 0;
let requestCount = 0;
let lastRequestTime = 0;

async function listMarkets() {
    // Implement simple rate limiting - don't make requests more than once per second
    const now = Date.now();
    if (now - lastRequestTime < 1000) {
        console.log('Rate limiting: waiting before making API request');
        await new Promise(resolve => setTimeout(resolve, 1000 - (now - lastRequestTime)));
    }
    lastRequestTime = Date.now();
    requestCount++;

    // Try each API provider in sequence
    for (let i = currentApiProvider; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            console.log(`Trying ${provider.name} API...`);

            const response = await fetchWithRetry(provider.marketUrl, provider.maxRetries, provider.retryDelay);
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

            // If it's a rate limit error, wait longer before trying next provider
            if (error.message.includes('429') || error.message.includes('rate limit')) {
                console.log('Rate limit detected, waiting before trying next provider...');
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            }
            continue;
        }
    }

    // If all APIs fail, throw error
    throw new Error('All API providers failed');
}

// Enhanced fetch with retry logic and exponential backoff
async function fetchWithRetry(url, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);

            // If successful or client error (4xx), don't retry
            if (response.ok || (response.status >= 400 && response.status < 500)) {
                return response;
            }

            // For server errors (5xx), retry with exponential backoff
            if (attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
                console.log(`Server error ${response.status}, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            return response; // Return the error response after all retries

        } catch (error) {
            lastError = error;

            if (attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`Network error, retrying in ${delay}ms...`, error.message);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
        }
    }

    throw lastError || new Error('Max retries exceeded');
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
