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
        maxRetries: 2,
        retryDelay: 5000
    }
];

let currentApiProvider = 0;

// Enhanced fetch with retry logic and exponential backoff
async function fetchWithRetry(url, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🌐 Attempt ${attempt + 1}/${maxRetries + 1}: Fetching ${url}`);
            const response = await fetch(url);

            console.log(`📡 Response status: ${response.status} ${response.statusText}`);

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
async function getMarketChart(coinId, days = 30) {
    console.log(`🔄 Starting API calls for ${coinId}...`);

    // Try each API provider in sequence
    for (let i = 0; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            console.log(`🔍 Trying ${provider.name} API for ${coinId}...`);

            let url;
            if (provider.name === 'cryptocompare') {
                // CryptoCompare format: https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30
                // Map coin IDs to proper CryptoCompare symbols
                const symbolMap = {
                    'bitcoin': 'BTC',
                    'ethereum': 'ETH',
                    'tether': 'USDT',
                    'solana': 'SOL',
                    'mantle': 'MNT'
                };
                const symbol = symbolMap[coinId.toLowerCase()] || coinId.toUpperCase();
                url = `${provider.baseUrl}/v2/histoday?fsym=${symbol}&tsym=USD&limit=${days}`;
                console.log(`📡 CryptoCompare URL: ${url}`);
            } else if (provider.name === 'coingecko') {
                // Use proxy for CORS - direct calls are blocked by browser CORS policy
                url = `${provider.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
                console.log(`📡 CoinGecko proxy URL: ${url}`);
            }

            console.log(`⏳ Making request to ${provider.name}...`);
            const response = await fetchWithRetry(url, provider.maxRetries, provider.retryDelay);

            if (!response.ok) {
                console.error(`❌ ${provider.name} returned HTTP ${response.status} for ${coinId}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(`✅ ${provider.name} returned success for ${coinId}`);
            const data = await response.json();
            console.log(`📊 Raw data from ${provider.name}:`, data);

            // Transform data based on provider
            const transformedData = await transformChartData(data, provider.name, coinId);
            console.log(`🎉 Successfully loaded chart data for ${coinId} from ${provider.name}`);

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

    // If all APIs fail, throw error
    console.error(`💀 All API providers failed for ${coinId}`);
    throw new Error('All API providers failed');
}

async function transformChartData(data, providerName, coinId) {
    console.log(`🔄 Transforming ${providerName} data for ${coinId}:`, data);

    if (providerName === 'cryptocompare') {
        // Handle CryptoCompare error responses
        if (data.Response === 'Error') {
            console.error(`❌ CryptoCompare API error for ${coinId}:`, data.Message);
            throw new Error(`CryptoCompare API Error: ${data.Message}`);
        }

        // Handle different response formats from CryptoCompare
        if (data.Data && Array.isArray(data.Data)) {
            // Standard historical data format
            console.log(`✅ CryptoCompare data structure valid for ${coinId}`);
            return {
                prices: data.Data.map(item => [item.time * 1000, item.close])
            };
        } else if (data.RAW && data.RAW.USD) {
            // Market data format - convert to chart format
            console.log(`📊 Converting CryptoCompare market data to chart format for ${coinId}`);
            const coinData = Object.values(data.RAW.USD)[0];
            if (coinData && coinData.HISTOHISTORY) {
                return {
                    prices: coinData.HISTOHISTORY.map(item => [item.time * 1000, item.close])
                };
            } else {
                console.warn(`⚠️ No historical data in CryptoCompare response for ${coinId}`);
                throw new Error('No historical data available in CryptoCompare response');
            }
        } else if (data.Type === 100 && data.HasWarning === false) {
            // Success response but no data - coin might not exist
            console.warn(`⚠️ CryptoCompare returned success but no data for ${coinId}`);
            throw new Error(`No data available for ${coinId} in CryptoCompare`);
        }

        console.error(`❌ Invalid CryptoCompare response format for ${coinId}:`, data);
        throw new Error('Invalid CryptoCompare response format');
    } else if (providerName === 'coingecko') {
        // Handle CoinGecko format (via proxy)
        if (data.error_code || (data.status && data.status.error_code)) {
            const errorCode = data.error_code || data.status.error_code;
            const errorMessage = data.error_message || data.status.error_message || 'Unknown error';
            console.error(`❌ CoinGecko API error for ${coinId}:`, { errorCode, errorMessage });
            if (errorCode === 429) {
                throw new Error('CoinGecko API rate limit exceeded. Please wait a moment and try again.');
            }
            throw new Error(`CoinGecko API Error ${errorCode}: ${errorMessage}`);
        }

        // Handle proxy-wrapped response
        if (typeof data === 'string') {
            console.log(`📦 CoinGecko data is string, parsing JSON for ${coinId}...`);
            try {
                data = JSON.parse(data);
                console.log(`✅ Parsed proxy response for ${coinId}:`, data);
            } catch (e) {
                console.error(`❌ Failed to parse proxy response for ${coinId}:`, e);
                throw new Error('Invalid JSON response from proxy');
            }
        }

        if (!data || typeof data !== 'object') {
            console.error(`❌ Invalid response format for ${coinId}:`, data);
            throw new Error('Invalid response format');
        }

        if (!data.prices || !Array.isArray(data.prices)) {
            console.error(`❌ No price data available for ${coinId}:`, data);
            throw new Error('No price data available');
        }

        console.log(`✅ CoinGecko data structure valid for ${coinId}`);
        return data;
    }

    console.error(`❌ Unknown provider ${providerName} for ${coinId}`);
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

    const dummyMode = document.getElementById('dummyModeToggle').checked;
    if (dummyMode) {
        startLivePriceSimulation();
    }

    liveUpdateInterval = setInterval(async () => {
        // Add refresh animation to chart container
        const chartContainer = document.getElementById('chartContainer');
        if (chartContainer) {
            chartContainer.classList.add('refresh-animation');
            setTimeout(() => {
                chartContainer.classList.remove('refresh-animation');
            }, 300);
        }

        await loadTrackerData();
        showToast('Live update completed', 'info');
    }, interval);

    startCountdown();
    document.getElementById('nextRefresh').classList.remove('hidden');

    // Add live indicator to chart container
    const chartContainer = document.getElementById('chartContainer');
    const liveIndicator = document.getElementById('liveIndicator');
    if (chartContainer) {
        chartContainer.classList.add('live-badge');
    }
    if (liveIndicator) {
        liveIndicator.classList.remove('hidden');
    }
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

    // Remove live indicator
    const chartContainer = document.getElementById('chartContainer');
    const liveIndicator = document.getElementById('liveIndicator');
    if (chartContainer) {
        chartContainer.classList.remove('live-badge');
    }
    if (liveIndicator) {
        liveIndicator.classList.add('hidden');
    }
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        countdownValue--;
        const countdownEl = document.getElementById('countdown');

        if (countdownEl) {
            countdownEl.textContent = countdownValue;

            // Add visual feedback when countdown is low
            if (countdownValue <= 5) {
                countdownEl.classList.add('text-red-600', 'animate-pulse');
                countdownEl.classList.remove('text-blue-600');
            } else {
                countdownEl.classList.add('text-blue-600');
                countdownEl.classList.remove('text-red-600', 'animate-pulse');
            }

            // Add a subtle pulse effect when reaching zero
            if (countdownValue <= 0) {
                countdownEl.classList.add('live-indicator');
                setTimeout(() => {
                    countdownEl.classList.remove('live-indicator');
                }, 1000);
            }
        }

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
                    console.log(`🎭 Demo mode enabled, using dummy data for ${coinId}`);
                    return { id: coinId, data: generateDummyData(coinId, 30) };
                } else {
                    console.log(`📊 Fetching real data for ${coinId}`);
                    const data = await getMarketChart(coinId, 30);
                    return { id: coinId, data };
                }
            } catch (error) {
                console.error(`❌ Failed to load data for ${coinId}:`, error.message);
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
        const failedCoins = results.filter(result => result.error);

        if (failedCoins.length > 0) {
            console.warn(`❌ ${failedCoins.length} coins failed completely:`, failedCoins.map(c => c.id));
            showNotification(`${failedCoins.length} coin(s) failed to load - using demo data`, 'warning');
        }

        if (fallbackCoins.length > 0 && failedCoins.length === 0) {
            console.warn(`⚠️ ${fallbackCoins.length} coins using fallback data:`, fallbackCoins.map(c => c.id));
            showNotification(`Using demo data for ${fallbackCoins.length} coin(s) - API may be unavailable`, 'warning');
        } else if (failedCoins.length === 0 && fallbackCoins.length === 0) {
            // Show success message only if no fallbacks were used
            const provider = API_PROVIDERS[currentApiProvider];
            showNotification(`Successfully loaded ${coinsData.length} coins from ${provider.name}`, 'success');
        }

        // Update favorites pills with enhanced animations
        favoritesContainerEl.innerHTML = favorites.map((coinId, index) => {
            const fallback = fallbackCoins.some(f => f.id === coinId);
            const failed = failedCoins.some(f => f.id === coinId);
            let errorClass = 'bg-blue-100 text-blue-800';
            let title = '';

            if (failed) {
                errorClass = 'bg-red-100 text-red-800';
                title = 'title="Failed to load data"';
            } else if (fallback) {
                errorClass = 'bg-yellow-100 text-yellow-800';
                title = 'title="Using demo data"';
            }

            return `
                <div class="favorites-pill ${errorClass} px-3 py-1 rounded-full text-sm flex items-center" ${title} style="animation-delay: ${index * 0.1}s">
                    <span class="capitalize">${coinId}</span>
                    <button onclick="removeFromFavorites('${coinId}')" class="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200">×</button>
                </div>
            `;
        }).join('');

        // Create or update chart
        updateChart(coinsData);

        // Update UI with smooth transitions
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

        // Check if this is a CORS or network error
        const isNetworkError = error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError');

        if (isNetworkError) {
            console.log('🌐 Network/CORS error detected - switching to demo mode');
            showNotification('Network issues detected. Using demo data for reliable experience.', 'warning');
        } else {
            showNotification('API unavailable. Using demo data as fallback.', 'warning');
        }

        // Use dummy data as complete fallback
        console.warn('🚨 Using complete dummy data fallback for all coins due to network/API issues');
        const dummyData = favorites.map(coinId => ({
            id: coinId,
            data: generateDummyData(coinId, 30)
        }));

        // Update favorites pills to show demo mode
        favoritesContainerEl.innerHTML = favorites.map(coinId => `
            <div class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center" title="Using demo data">
                <span class="capitalize">${coinId}</span>
                <button onclick="removeFromFavorites('${coinId}')" class="ml-2 text-blue-600 hover:text-blue-800">×</button>
            </div>
        `).join('');

        updateChart(dummyData);
        favoritesContainerEl.classList.remove('hidden');
        chartContainerEl.classList.remove('hidden');
        document.getElementById('lastRefresh').textContent = `Last updated: ${new Date().toLocaleTimeString()} (Demo Mode - Network Issues)`;

        // Show notification about demo mode
        showNotification('All APIs are currently unavailable. Using demo data with beautiful animations!', 'warning');
    } finally {
        loadingEl.classList.add('hidden');
    }
}
