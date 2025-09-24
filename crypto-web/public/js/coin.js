// Coin Detail Functions
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
        useProxy: true
    }
];

let currentApiProvider = 0;

async function getCoin(coinId) {
    // Try each API provider in sequence
    for (let i = currentApiProvider; i < API_PROVIDERS.length; i++) {
        try {
            const provider = API_PROVIDERS[i];
            console.log(`Trying ${provider.name} API for coin ${coinId}...`);

            let url;
            if (provider.name === 'cryptocompare') {
                // CryptoCompare doesn't have detailed coin info, skip to next provider
                continue;
            } else if (provider.name === 'coingecko') {
                // CoinGecko format
                url = `${provider.baseUrl}/coins/${coinId}`;
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
