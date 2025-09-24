// Tracker-specific API and Chart Functions
// API Configuration - Multiple providers with fallbacks
const API_PROVIDERS = [
    {
        name: 'cryptocompare',
        baseUrl: 'https://min-api.cryptocompare.com/data',
        useProxy: false
    },
    {
        name: 'coingecko',
        baseUrl: 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3',
        useProxy: true,
        maxRetries: 3,
        retryDelay: 1000
    }
];

let currentApiProvider = 0;

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
async function getMarketChart(coinId, days = 30) {
    // Try each API provider in sequence
    for (let i = 0; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            console.log(`Trying ${provider.name} API for ${coinId}...`);

            let url;
            if (provider.name === 'cryptocompare') {
                // CryptoCompare format: https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30
                url = `${provider.baseUrl}/v2/histoday?fsym=${coinId.toUpperCase()}&tsym=USD&limit=${days}`;
            } else if (provider.name === 'coingecko') {
                // CoinGecko format: https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily
                url = `${provider.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
                console.log(`Fetching from CoinGecko: ${url}`);
            }

            const response = await fetchWithRetry(url, provider.maxRetries, provider.retryDelay);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Chart data received for ${coinId} from ${provider.name}:`, data);

            // Transform data based on provider
            const transformedData = await transformChartData(data, provider.name, coinId);
            console.log(`Successfully loaded chart data for ${coinId} from ${provider.name}`);

            return transformedData;

        } catch (error) {
            console.warn(`${API_PROVIDERS[i].name} API failed for ${coinId}:`, error.message);

            // If it's a rate limit error, wait longer before trying next provider
            if (error.message.includes('429') || error.message.includes('rate limit')) {
                console.log('Rate limit detected, waiting before trying next provider...');
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
            }
            continue;
        }
    }

    // If all APIs fail, throw error
    throw new Error('All API providers failed');
}

async function transformChartData(data, providerName, coinId) {
    if (providerName === 'cryptocompare') {
        // Handle CryptoCompare error responses
        if (data.Response === 'Error') {
            throw new Error(`CryptoCompare API Error: ${data.Message}`);
        }

        // Transform CryptoCompare format to match CoinGecko format
        if (data.Data && Array.isArray(data.Data)) {
            return {
                prices: data.Data.map(item => [item.time * 1000, item.close])
            };
        }

        throw new Error('Invalid CryptoCompare response format');
    } else if (providerName === 'coingecko') {
        // Handle CoinGecko format (existing logic)
        if (data && data.status && data.status.error_code) {
            if (data.status.error_code === 429) {
                throw new Error('CoinGecko API rate limit exceeded. Please wait a moment and try again.');
            }
            throw new Error(`API Error ${data.status.error_code}: ${data.status.error_message || 'Unknown error'}`);
        }

        if (data && typeof data === 'object' && data.status && !Array.isArray(data)) {
            throw new Error(`API returned error status: ${JSON.stringify(data.status)}`);
        }

        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response format');
        }

        if (!data.prices || !Array.isArray(data.prices)) {
            throw new Error('No price data available');
        }

        return data;
    }

    throw new Error(`Unknown provider: ${providerName}`);
}

// Live tracking functionality
let liveUpdateInterval = null;
let countdownInterval = null;
let countdownValue = 30;

function startLiveUpdates() {
    if (liveUpdateInterval) {
        clearInterval(liveUpdateInterval);
    }

    const interval = parseInt(document.getElementById('refreshInterval').value) * 1000;
    countdownValue = parseInt(document.getElementById('refreshInterval').value);

    // Start live price simulation if in demo mode
    const dummyMode = document.getElementById('dummyModeToggle').checked;
    if (dummyMode) {
        startLivePriceSimulation();
    }

    liveUpdateInterval = setInterval(async () => {
        await loadTrackerData();
        showToast('Live update completed', 'info');
    }, interval);

    startCountdown();
    document.getElementById('nextRefresh').classList.remove('hidden');
}

function stopLiveUpdates() {
    if (liveUpdateInterval) {
        clearInterval(liveUpdateInterval);
        liveUpdateInterval = null;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    stopLivePriceSimulation();
    document.getElementById('nextRefresh').classList.add('hidden');
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        countdownValue--;
        document.getElementById('countdown').textContent = countdownValue;

        if (countdownValue <= 0) {
            countdownValue = parseInt(document.getElementById('refreshInterval').value);
        }
    }, 1000);
}

// Favorites management
const FAVORITES_KEY = 'crypto_favorites';
const MAX_FAVORITES = 5;

function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

function removeFavorite(coinId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(coinId);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
    }
    return false;
}

// Load and display tracker data
async function loadTrackerData() {
    const favorites = getFavorites();
    const loadingEl = document.getElementById('loading');
    const emptyStateEl = document.getElementById('emptyState');
    const chartContainerEl = document.getElementById('chartContainer');
    const favoritesContainerEl = document.getElementById('favoritesContainer');
    const errorStateEl = document.getElementById('errorState');

    // Show loading state
    loadingEl.classList.remove('hidden');
    emptyStateEl.classList.add('hidden');
    chartContainerEl.classList.add('hidden');
    errorStateEl.classList.add('hidden');

    if (favorites.length === 0) {
        loadingEl.classList.add('hidden');
        emptyStateEl.classList.remove('hidden');
        return;
    }

    try {
        const dummyMode = document.getElementById('dummyModeToggle').checked;
        const coinDataPromises = favorites.map(async (coinId) => {
            try {
                if (dummyMode) {
                    return { id: coinId, data: generateDummyData(coinId, 30) };
                } else {
                    const data = await getMarketChart(coinId, 30);
                    return { id: coinId, data };
                }
            } catch (error) {
                console.error(`Failed to load data for ${coinId}:`, error);
                // Return dummy data as fallback for failed coins
                return { id: coinId, data: generateDummyData(coinId, 30), fallback: true };
            }
        });

        const results = await Promise.all(coinDataPromises);
        const coinsData = results.filter(result => result.data !== null);

        if (coinsData.length === 0) {
            throw new Error('No coin data could be loaded');
        }

        // Show warnings for fallback coins
        const fallbackCoins = results.filter(result => result.fallback);
        if (fallbackCoins.length > 0) {
            showNotification(`Using demo data for ${fallbackCoins.length} coin(s) - API may be unavailable`, 'warning');
            console.warn('Using fallback data for coins:', fallbackCoins.map(c => c.id));
        } else {
            // Show success message only if no fallbacks were used
            const provider = API_PROVIDERS[currentApiProvider];
            showNotification(`Successfully loaded ${coinsData.length} coins from ${provider.name}`, 'success');
        }

        // Update favorites pills
        favoritesContainerEl.innerHTML = favorites.map(coinId => {
            const fallback = fallbackCoins.some(f => f.id === coinId);
            const errorClass = fallback ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
            const title = fallback ? `title="Using demo data"` : '';

            return `
                <div class="${errorClass} px-3 py-1 rounded-full text-sm flex items-center" ${title}>
                    <span class="capitalize">${coinId}</span>
                    <button onclick="removeFromFavorites('${coinId}')" class="ml-2 text-blue-600 hover:text-blue-800">×</button>
                </div>
            `;
        }).join('');

        // Create or update chart
        updateChart(coinsData);

        // Update UI
        favoritesContainerEl.classList.remove('hidden');
        chartContainerEl.classList.remove('hidden');
        document.getElementById('lastRefresh').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

        // Reset countdown if live updates are enabled
        if (liveUpdateInterval) {
            countdownValue = parseInt(document.getElementById('refreshInterval').value);
            document.getElementById('countdown').textContent = countdownValue;
        }
    } catch (error) {
        console.error('Error loading tracker data:', error);

        // Check if this is an API rate limit error
        const isRateLimit = error.message.includes('rate limit') || error.message.includes('429');

        if (isRateLimit) {
            showNotification('API rate limit reached. Switching to demo mode for now.', 'warning');
        } else {
            showNotification('API unavailable. Using demo data as fallback.', 'warning');
        }

        // Use dummy data as complete fallback
        console.warn('Using complete dummy data fallback');
        const dummyData = favorites.map(coinId => ({
            id: coinId,
            data: generateDummyData(coinId, 30)
        }));

        // Update favorites pills
        favoritesContainerEl.innerHTML = favorites.map(coinId => `
            <div class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center" title="Using demo data">
                <span class="capitalize">${coinId}</span>
                <button onclick="removeFromFavorites('${coinId}')" class="ml-2 text-blue-600 hover:text-blue-800">×</button>
            </div>
        `).join('');

        updateChart(dummyData);
        favoritesContainerEl.classList.remove('hidden');
        chartContainerEl.classList.remove('hidden');
        document.getElementById('lastRefresh').textContent = `Last updated: ${new Date().toLocaleTimeString()} (Demo Mode)`;
    } finally {
        loadingEl.classList.add('hidden');
    }
}
