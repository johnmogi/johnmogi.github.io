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

// Cache keys for different data types
const CACHE_KEYS = {
    MARKET_DATA: 'market_data',
    COIN_DETAIL: 'coin_detail'
};

// Enhanced fetch with retry logic and exponential backoff
async function fetchWithRetry(url, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🌐 Attempt ${attempt + 1}: Fetching ${url}`);
            const response = await fetch(url);

            // If successful or client error (4xx), don't retry
            if (response.ok || (response.status >= 400 && response.status < 500)) {
                console.log(`✅ Response OK or client error, returning response`);
                return response;
            }

            // For server errors (5xx), retry with exponential backoff
            if (attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
                console.log(`⏰ Server error ${response.status}, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            console.log(`❌ Max retries reached, returning error response`);
            return response; // Return the error response after all retries

        } catch (error) {
            lastError = error;
            console.error(`💥 Network error on attempt ${attempt + 1}:`, error.message);

            // Check for specific error types
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                console.log(`🚫 CORS policy blocked the request - this is expected in browser environment`);
                // Don't retry CORS errors, they're not going to work
                break;
            }

            if (attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`⏰ Network error, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
        }
    }

    console.error(`💀 All ${maxRetries + 1} attempts failed`);
    throw lastError || new Error('Max retries exceeded');
}

// Get cached market data or fetch fresh data
async function listMarkets(forceRefresh = false) {
    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
        const cachedData = apiCache.get(CACHE_KEYS.MARKET_DATA);
        if (cachedData) {
            console.log('📦 Using cached market data');
            return cachedData;
        }
    }

    // Implement simple rate limiting - don't make requests more than once per second
    const now = Date.now();
    if (now - lastRequestTime < 1000) {
        console.log('⏱️ Rate limiting: waiting before making API request');
        await new Promise(resolve => setTimeout(resolve, 1000 - (now - lastRequestTime)));
    }
    lastRequestTime = Date.now();
    requestCount++;

    // Try each API provider in sequence
    for (let i = currentApiProvider; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            console.log(`🌐 Trying ${provider.name} API for market data...`);

            const response = await fetchWithRetry(provider.marketUrl, provider.maxRetries, provider.retryDelay);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`📡 Market data received from ${provider.name}:`, data);

            // Transform data based on provider
            const transformedData = await transformMarketData(data, provider.name);
            console.log(`✅ Successfully loaded market data from ${provider.name}`);

            // Cache the successful data
            apiCache.set(CACHE_KEYS.MARKET_DATA, transformedData);

            // Switch to this provider for future requests
            currentApiProvider = i;
            return transformedData;

        } catch (error) {
            console.warn(`⚠️ ${API_PROVIDERS[i].name} API failed:`, error.message);

            // If it's a rate limit error, wait longer before trying next provider
            if (error.message.includes('429') || error.message.includes('rate limit')) {
                console.log('🚦 Rate limit detected, waiting before trying next provider...');
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            }
            continue;
        }
    }

    // If all APIs fail, try to return cached data if available
    const cachedData = apiCache.get(CACHE_KEYS.MARKET_DATA);
    if (cachedData) {
        console.log('🚨 All APIs failed, using cached data');
        return cachedData;
    }

    // If no cached data, throw error
    throw new Error('All API providers failed and no cached data available');
}

// Get detailed data for a specific coin
async function getCoinDetail(coinId, forceRefresh = false) {
    const cacheKey = `${CACHE_KEYS.COIN_DETAIL}_${coinId}`;

    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
        const cachedData = apiCache.get(cacheKey);
        if (cachedData) {
            console.log(`📦 Using cached detail data for ${coinId}`);
            return cachedData;
        }
    }

    // Try each API provider in sequence
    for (let i = currentApiProvider; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            let url;

            if (provider.name === 'cryptocompare') {
                // CryptoCompare detailed coin data
                url = `${provider.baseUrl}/pricemultifull?fsyms=${coinId.toUpperCase()}&tsyms=USD`;
            } else if (provider.name === 'coingecko') {
                // CoinGecko detailed coin data
                url = `${provider.baseUrl}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
            }

            console.log(`🌐 Trying ${provider.name} API for ${coinId} detail data...`);

            const response = await fetchWithRetry(url, provider.maxRetries, provider.retryDelay);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`📡 Detail data received from ${provider.name} for ${coinId}:`, data);

            // Transform data based on provider
            const transformedData = await transformCoinDetail(data, provider.name, coinId);
            console.log(`✅ Successfully loaded detail data for ${coinId} from ${provider.name}`);

            // Cache the successful data
            apiCache.set(cacheKey, transformedData);

            // Switch to this provider for future requests
            currentApiProvider = i;
            return transformedData;

        } catch (error) {
            console.warn(`⚠️ ${API_PROVIDERS[i].name} API failed for ${coinId}:`, error.message);

            // If it's a rate limit error, wait longer before trying next provider
            if (error.message.includes('429') || error.message.includes('rate limit')) {
                console.log('🚦 Rate limit detected, waiting before trying next provider...');
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            }
            continue;
        }
    }

    // If all APIs fail, try to return cached data if available
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
        console.log(`🚨 All APIs failed for ${coinId}, using cached data`);
        return cachedData;
    }

    throw new Error(`All API providers failed for ${coinId} and no cached data available`);
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

// Transform detailed coin data from different providers
async function transformCoinDetail(data, providerName, coinId) {
    if (providerName === 'cryptocompare') {
        // Handle CryptoCompare detailed coin data format
        if (data.Response === 'Error') {
            throw new Error(`CryptoCompare API Error: ${data.Message}`);
        }

        if (data.DISPLAY && data.DISPLAY.USD) {
            const symbol = Object.keys(data.DISPLAY.USD)[0];
            const displayData = data.DISPLAY.USD[symbol];
            const rawData = data.RAW.USD[symbol];

            return {
                id: coinId,
                symbol: symbol,
                name: displayData.FROMSYMBOL,
                current_price: parseFloat(displayData.PRICE) || 0,
                price_change_percentage_24h: parseFloat(displayData.CHANGEPCT24HOUR) || 0,
                market_cap: parseFloat(displayData.MKTCAP) || 0,
                total_volume: parseFloat(displayData.VOLUME24HOUR) || 0,
                high_24h: parseFloat(rawData.HIGH24HOUR) || 0,
                low_24h: parseFloat(rawData.LOW24HOUR) || 0,
                price_change_24h: parseFloat(rawData.CHANGE24HOUR) || 0,
                last_updated: rawData.LASTUPDATE
            };
        }

        throw new Error('Invalid CryptoCompare coin detail format');
    } else if (providerName === 'coingecko') {
        // Handle CoinGecko detailed coin data format
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

        if (data.id && data.market_data) {
            const marketData = data.market_data;
            return {
                id: data.id,
                symbol: data.symbol,
                name: data.name,
                current_price: marketData.current_price?.usd || 0,
                price_change_percentage_24h: marketData.price_change_percentage_24h || 0,
                market_cap: marketData.market_cap?.usd || 0,
                total_volume: marketData.total_volume?.usd || 0,
                high_24h: marketData.high_24h?.usd || 0,
                low_24h: marketData.low_24h?.usd || 0,
                price_change_24h: marketData.price_change_24h || 0,
                last_updated: marketData.last_updated,
                description: data.description?.en || '',
                image: data.image?.large || '',
                homepage: data.links?.homepage?.[0] || '',
                genesis_date: data.genesis_date || null
            };
        }

        throw new Error('Invalid CoinGecko coin detail format');
    }

    throw new Error(`Unknown provider: ${providerName}`);
}
