// API Configuration and Functions
const API_PROVIDERS = [
    {
        name: 'cryptocompare',
        baseUrl: 'https://min-api.cryptocompare.com/data',
        marketUrl: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,USDT,SOL,MNT&tsyms=USD',
        useProxy: false,
        retryDelay: 2000, // 2 second retry delay
        maxRetries: 2
    },
    {
        name: 'coingecko',
        baseUrl: 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3',
        marketUrl: 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h',
        useProxy: true, // Use proxy for CORS
        retryDelay: 5000, // 5 second retry delay for rate limits
        maxRetries: 2 // Reduce retries to avoid long waits
    }
];

let currentApiProvider = 0;
let requestCount = 0;
let lastRequestTime = 0;

// Enhanced fetch with retry logic and exponential backoff
async function fetchWithRetry(url, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Fetching: ${url}`);
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
            console.log(`Trying ${provider.name} API for market data...`);

            const response = await fetchWithRetry(provider.marketUrl, provider.maxRetries, provider.retryDelay);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Market data received from ${provider.name}:`, data);

            // Transform data based on provider
            const transformedData = await transformMarketData(data, provider.name);
            console.log(`Successfully loaded market data from ${provider.name}`);

            // Switch to this provider for future requests
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

async function transformMarketData(data, providerName) {
    if (providerName === 'cryptocompare') {
        // Handle CryptoCompare market data format
        if (data.Response === 'Error') {
            throw new Error(`CryptoCompare API Error: ${data.Message}`);
        }

        if (data.DISPLAY && data.DISPLAY.USD) {
            return Object.keys(data.DISPLAY.USD).map(symbol => ({
                id: symbol.toLowerCase(),
                symbol: symbol,
                name: data.DISPLAY.USD[symbol].FROMSYMBOL,
                current_price: parseFloat(data.DISPLAY.USD[symbol].PRICE) || 0,
                price_change_percentage_24h: parseFloat(data.DISPLAY.USD[symbol].CHANGEPCT24HOUR) || 0,
                market_cap: parseFloat(data.DISPLAY.USD[symbol].MKTCAP) || 0,
                total_volume: parseFloat(data.DISPLAY.USD[symbol].VOLUME24HOUR) || 0
            }));
        }

        throw new Error('Invalid CryptoCompare market data format');
    } else if (providerName === 'coingecko') {
        // Handle CoinGecko market data format (may be wrapped by proxy)
        if (data.error) {
            throw new Error(`CoinGecko API Error: ${data.error}`);
        }

        // Handle proxy-wrapped response
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new Error('Invalid JSON response from proxy');
            }
        }

        if (Array.isArray(data)) {
            return data.map(coin => ({
                id: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                current_price: coin.current_price || 0,
                price_change_percentage_24h: coin.price_change_percentage_24h || 0,
                market_cap: coin.market_cap || 0,
                total_volume: coin.total_volume || 0
            }));
        }

        throw new Error('Invalid CoinGecko market data format');
    }

    throw new Error(`Unknown provider: ${providerName}`);
}
