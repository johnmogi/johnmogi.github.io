// Coin Detail Functions - Simplified using shared API module

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Simple notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(n => n.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${getNotificationClasses(type)}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationClasses(type) {
    switch (type) {
        case 'success': return 'bg-green-500 text-white';
        case 'error': return 'bg-red-500 text-white';
        case 'warning': return 'bg-yellow-500 text-white';
        default: return 'bg-blue-500 text-white';
    }
}

// Initialize coin detail page
async function initializeCoinPage() {
    const coinId = getUrlParameter('coin');
    if (!coinId) {
        // If no coin specified, try to get the first favorite
        const favorites = getFavorites();
        if (favorites.length > 0) {
            // Redirect to the first favorite coin
            window.location.href = `coin.html?coin=${favorites[0]}`;
            return;
        } else {
            showError('No coin specified and no favorites found');
            return;
        }
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

    // Update navigation title
    const coinTitleEl = document.getElementById('coinTitle');
    if (coinTitleEl) {
        coinTitleEl.textContent = `${coinData.name} Details`;
    }

    // Update header
    const coinHeader = document.getElementById('coinHeader');
    if (coinHeader) {
        coinHeader.innerHTML = `
            <div class="flex items-center justify-between">
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
            </div>
        `;
    }

    // Update stats
    updateCoinStats(coinData);

    // Update description if available
    if (coinData.description) {
        const descriptionEl = document.getElementById('coinDescription');
        if (descriptionEl) {
            const descriptionContent = descriptionEl.querySelector('div') || document.createElement('div');
            descriptionContent.innerHTML = coinData.description;
            descriptionEl.appendChild(descriptionContent);
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

    // Update CoinGecko link
    const coinGeckoLink = document.getElementById('coinGeckoLink');
    if (coinGeckoLink) {
        coinGeckoLink.href = `https://www.coingecko.com/en/coins/${coinData.id}`;
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

// Navigation functions
function goBack() {
    window.location.href = 'tracker.html';
}

// Initialize the coin detail page
document.addEventListener('DOMContentLoaded', () => {
    initializeCoinPage();
});
