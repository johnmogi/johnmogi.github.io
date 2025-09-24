// Coin Detail Functions - Simplified using shared API module

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize coin detail page
async function initializeCoinPage() {
    const coinId = getUrlParameter('coin');
    if (!coinId) {
        showError('No coin specified in URL');
        return;
    }

    console.log(`🔍 Loading coin detail page for: ${coinId}`);

    try {
        // Get detailed coin data (with caching)
        const coinData = await getCoinDetail(coinId);
        console.log(`✅ Loaded coin detail data for ${coinId}:`, coinData);

        // Update page content
        updateCoinPage(coinData);

        // Load chart data for this coin
        await loadCoinChart(coinId);

    } catch (error) {
        console.error(`❌ Error loading coin detail for ${coinId}:`, error);
        showError(`Failed to load coin data: ${error.message}`);
    }
}

// Update coin page with data
function updateCoinPage(coinData) {
    // Update title
    document.title = `${coinData.name} (${coinData.symbol.toUpperCase()}) - Crypto Tracker`;

    // Update header
    const coinHeader = document.getElementById('coinHeader');
    if (coinHeader) {
        coinHeader.innerHTML = `
            <div class="flex items-center space-x-4">
                ${coinData.image ? `<img src="${coinData.image}" alt="${coinData.name}" class="w-16 h-16 rounded-full">` : ''}
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">${coinData.name}</h1>
                    <p class="text-xl text-gray-600 uppercase">${coinData.symbol}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold text-gray-900">$${coinData.current_price.toLocaleString()}</div>
                <div class="text-lg ${coinData.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}">
                    ${coinData.price_change_percentage_24h >= 0 ? '↗' : '↘'} ${Math.abs(coinData.price_change_percentage_24h).toFixed(2)}%
                </div>
            </div>
        `;
    }

    // Update stats
    updateCoinStats(coinData);

    // Update description if available
    if (coinData.description) {
        const descriptionEl = document.getElementById('coinDescription');
        if (descriptionEl) {
            descriptionEl.innerHTML = coinData.description;
        }
    }

    // Update links if available
    if (coinData.homepage) {
        const linksEl = document.getElementById('coinLinks');
        if (linksEl) {
            linksEl.innerHTML = `
                <a href="${coinData.homepage}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">
                    Official Website
                </a>
            `;
        }
    }
}

// Update coin statistics
function updateCoinStats(coinData) {
    const statsContainer = document.getElementById('coinStats');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-600">Market Cap</div>
                <div class="text-lg font-semibold">$${coinData.market_cap?.toLocaleString() || 'N/A'}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-600">24h Volume</div>
                <div class="text-lg font-semibold">$${coinData.total_volume?.toLocaleString() || 'N/A'}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-600">24h High</div>
                <div class="text-lg font-semibold">$${coinData.high_24h?.toLocaleString() || 'N/A'}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-600">24h Low</div>
                <div class="text-lg font-semibold">$${coinData.low_24h?.toLocaleString() || 'N/A'}</div>
            </div>
        </div>
    `;
}

// Load chart data for the coin
async function loadCoinChart(coinId) {
    const chartContainer = document.getElementById('coinChart');
    if (!chartContainer) return;

    try {
        // Show loading state
        chartContainer.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p class="mt-2 text-gray-600">Loading chart...</p></div>';

        // Get chart data using the shared function
        const chartData = await getMarketChart(coinId, 30);

        // Create chart
        createCoinChart(chartData, coinId);

    } catch (error) {
        console.error(`❌ Error loading chart for ${coinId}:`, error);
        chartContainer.innerHTML = '<div class="text-center py-8"><p class="text-red-600">Failed to load chart data</p></div>';
    }
}

// Create chart for coin detail page
function createCoinChart(data, coinId) {
    const chartContainer = document.getElementById('coinChart');
    if (!chartContainer) return;

    // Destroy existing chart if it exists
    if (window.coinDetailChart) {
        window.coinDetailChart.destroy();
    }

    const ctx = document.createElement('canvas');
    chartContainer.innerHTML = '';
    chartContainer.appendChild(ctx);

    // Create new chart
    window.coinDetailChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `${coinId.toUpperCase()} Price`,
                data: data.prices,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Price: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

// Show error message
function showError(message) {
    const errorEl = document.getElementById('errorState');
    const contentEl = document.getElementById('coinContent');

    if (errorEl && contentEl) {
        contentEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorEl.querySelector('p').textContent = message;
    }
}

// Try each API provider in sequence
async function getCoin(coinId) {
    for (let i = currentApiProvider; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            console.log(`Trying ${provider.name} API for ${coinId}...`);

            let url;
            if (provider.name === 'coingecko') {
                // CoinGecko format: https://api.coingecko.com/api/v3/coins/{id}
                url = `${provider.baseUrl}/coins/${coinId}`;
            } else if (provider.name === 'cryptocompare') {
                // CryptoCompare format: https://min-api.cryptocompare.com/data/coin/generalinfo?fsyms=BTC&tsym=USD
                url = `${provider.baseUrl}/data/coin/generalinfo?fsyms=${coinId.toUpperCase()}&tsym=USD`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Coin data received for ${coinId} from ${provider.name}:`, data);

            // Transform data based on provider
            const transformedData = await transformCoinData(data, provider.name);
            console.log(`Successfully loaded coin data for ${coinId} from ${provider.name}`);

            // If successful, update current provider and return data
            currentApiProvider = i;
            return transformedData;

        } catch (error) {
            console.warn(`${API_PROVIDERS[i].name} API failed for coin ${coinId}:`, error.message);
            continue;
        }
    }

    // If all APIs fail, throw error
    throw new Error('All API providers failed');
}

async function getMarketChart(coinId, days = 30) {
    // Try each API provider in sequence
    for (let i = currentApiProvider; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            console.log(`Trying ${provider.name} API for ${coinId} chart...`);

            let url;
            if (provider.name === 'cryptocompare') {
                // CryptoCompare format: https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30
                url = `${provider.baseUrl}/v2/histoday?fsym=${coinId.toUpperCase()}&tsym=USD&limit=${days}`;
            } else if (provider.name === 'coingecko') {
                // CoinGecko format
                url = `${provider.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Chart data received for ${coinId} from ${provider.name}:`, data);

            // Transform data based on provider
            const transformedData = await transformChartData(data, provider.name);
            console.log(`Successfully loaded chart data for ${coinId} from ${provider.name}`);

            // If successful, update current provider and return data
            currentApiProvider = i;
            return transformedData;

        } catch (error) {
            console.warn(`${API_PROVIDERS[i].name} API failed for ${coinId} chart:`, error.message);
            continue;
        }
    }

    // If all APIs fail, throw error
    throw new Error('All API providers failed');
}

async function transformCoinData(data, providerName) {
    if (providerName === 'coingecko') {
        // Handle CoinGecko format
        if (data && data.status && data.status.error_code) {
            throw new Error(`API Error ${data.status.error_code}: ${data.status.error_message || 'Unknown error'}`);
        }

        if (data && typeof data === 'object' && data.status && !Array.isArray(data)) {
            throw new Error(`API returned error status: ${JSON.stringify(data.status)}`);
        }

        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response format');
        }

        if (!data.market_data) {
            throw new Error('No market data available');
        }

        return data;
    }

    throw new Error(`Unknown provider: ${providerName}`);
}

async function transformChartData(data, providerName) {
    if (providerName === 'cryptocompare') {
        // Transform CryptoCompare format to match CoinGecko format
        if (data.Data && Array.isArray(data.Data)) {
            return {
                prices: data.Data.map(item => [item.time * 1000, item.close])
            };
        }
    } else if (providerName === 'coingecko') {
        // Handle CoinGecko format
        if (data && data.status && data.status.error_code) {
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

// Favorites management
const FAVORITES_KEY = 'crypto_favorites';
const MAX_FAVORITES = 5;

function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

function addToFavorites(coinId) {
    const favorites = getFavorites();
    if (favorites.includes(coinId)) {
        showNotification('Coin already in favorites', 'info');
        return false;
    }
    if (favorites.length >= MAX_FAVORITES) {
        showNotification(`Maximum ${MAX_FAVORITES} favorites allowed`, 'error');
        return false;
    }
    favorites.push(coinId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    showNotification('Added to favorites!', 'success');
    return true;
}

// Initialize the coin detail page
function initializeCoinPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const coinId = urlParams.get('id');

    if (!coinId) {
        showNotification('No coin specified', 'error');
        window.location.href = 'index.html';
        return;
    }

    loadCoinDetails(coinId);
}

async function loadCoinDetails(coinId) {
    try {
        const [coinData, marketData] = await Promise.all([
            getCoin(coinId),
            getMarketChart(coinId, 30)
        ]);

        // Update UI with coin data
        document.getElementById('coinLogo').src = coinData.image?.large || '';
        document.getElementById('coinLogo').alt = `${coinData.name} logo`;
        document.getElementById('coinName').textContent = coinData.name;
        document.getElementById('coinSymbol').textContent = coinData.symbol.toUpperCase();
        document.getElementById('coinPrice').textContent =
            `$${coinData.market_data.current_price.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
        document.getElementById('coinMarketCap').textContent =
            `$${coinData.market_data.market_cap.usd.toLocaleString()}`;

        const priceChange24h = coinData.market_data.price_change_percentage_24h;
        const priceChangeElement = document.getElementById('coinChange');
        priceChangeElement.textContent = `${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%`;
        priceChangeElement.className = `text-xl font-bold ${priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`;

        document.getElementById('coinGeckoLink').href = coinData.links?.homepage[0] || `https://www.coingecko.com/en/coins/${coinId}`;

        // Setup add to favorites button
        document.getElementById('addToFavoritesBtn').addEventListener('click', () => {
            if (addToFavorites(coinId)) {
                const button = document.getElementById('addToFavoritesBtn');
                button.textContent = 'Added to Tracker';
                button.disabled = true;
                button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                button.classList.add('bg-green-500', 'cursor-not-allowed');
            }
        });

        // Initialize chart
        const ctx = document.getElementById('priceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Price (USD)',
                    data: marketData.prices.map(([timestamp, price]) => ({
                        x: new Date(timestamp),
                        y: price
                    })),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        },
                        beginAtZero: false
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) =>
                                `$${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
                        }
                    }
                }
            }
        });

        // Show the content
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('coinDetails').classList.remove('hidden');

    } catch (error) {
        console.error('Error loading coin details:', error);

        // Create sample data for demonstration
        const sampleCoinData = {
            id: coinId,
            name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
            symbol: coinId.toUpperCase(),
            image: { large: 'https://via.placeholder.com/128' },
            market_data: {
                current_price: { usd: 1000.00 },
                market_cap: { usd: 50000000000 },
                price_change_percentage_24h: 5.0
            },
            links: { homepage: [`https://example.com/${coinId}`] }
        };

        const sampleMarketData = {
            prices: Array.from({ length: 30 }, (_, i) => [
                Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
                1000 + Math.random() * 200 - 100
            ])
        };

        // Update UI with sample data
        document.getElementById('coinLogo').src = sampleCoinData.image.large;
        document.getElementById('coinLogo').alt = `${sampleCoinData.name} logo`;
        document.getElementById('coinName').textContent = sampleCoinData.name;
        document.getElementById('coinSymbol').textContent = sampleCoinData.symbol;
        document.getElementById('coinPrice').textContent =
            `$${sampleCoinData.market_data.current_price.usd.toFixed(2)}`;
        document.getElementById('coinMarketCap').textContent =
            `$${sampleCoinData.market_data.market_cap.usd.toLocaleString()}`;

        const priceChange24h = sampleCoinData.market_data.price_change_percentage_24h;
        const priceChangeElement = document.getElementById('coinChange');
        priceChangeElement.textContent = `${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%`;
        priceChangeElement.className = `text-xl font-bold ${priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`;

        document.getElementById('coinGeckoLink').href = sampleCoinData.links.homepage[0];

        // Initialize chart with sample data
        const ctx = document.getElementById('priceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Price (USD)',
                    data: sampleMarketData.prices.map(([timestamp, price]) => ({
                        x: new Date(timestamp),
                        y: price
                    })),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        },
                        beginAtZero: false
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) =>
                                `$${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        }
                    }
                }
            }
        });

        // Show the content
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('coinDetails').classList.remove('hidden');
        showNotification('Using demo data - API connection failed', 'warning');
    }
}
