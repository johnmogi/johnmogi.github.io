// Portfolio Tracker Functions - Uses shared API module
let liveUpdateInterval = null;
let countdownInterval = null;
let countdownValue = 30;

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

// Generate dummy data for testing
function generateDummyData(coinId, days = 30) {
    const basePrice = 1000 + Math.random() * 50000;
    const data = [];

    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Create realistic price movement
        const volatility = 0.02 + Math.random() * 0.05; // 2-7% daily volatility
        const trend = Math.sin(i * 0.1) * 0.1; // Gentle trend
        const randomWalk = (Math.random() - 0.5) * volatility;

        const price = basePrice * (1 + trend + randomWalk);
        data.push([date.getTime(), Math.max(price, 0.01)]);
    }

    return {
        prices: data
    };
}

// Live price simulation for demo mode
let priceSimulationInterval = null;

function startLivePriceSimulation() {
    if (priceSimulationInterval) {
        clearInterval(priceSimulationInterval);
    }

    priceSimulationInterval = setInterval(() => {
        // Simulate live price updates for all coins in tracker
        const favorites = getFavorites();
        if (favorites.length === 0) return;

        // Update each coin's price slightly
        favorites.forEach(coinId => {
            const priceElement = document.querySelector(`[data-coin="${coinId}"] .coin-price`);
            if (priceElement) {
                const currentPrice = parseFloat(priceElement.textContent.replace('$', '').replace(',', ''));
                const change = (Math.random() - 0.5) * 0.02; // ±1% change
                const newPrice = Math.max(currentPrice * (1 + change), 0.01);
                priceElement.textContent = `$${newPrice.toFixed(2)}`;
            }
        });
    }, 2000); // Update every 2 seconds
}

function stopLivePriceSimulation() {
    if (priceSimulationInterval) {
        clearInterval(priceSimulationInterval);
        priceSimulationInterval = null;
    }
}

// Chart management functions
let currentChart = null;

function updateChart(coinsData) {
    const chartContainer = document.getElementById('chartContainer');
    if (!chartContainer) return;

    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }

    const ctx = document.createElement('canvas');
    chartContainer.innerHTML = '';
    chartContainer.appendChild(ctx);

    // Prepare datasets for multiple coins
    const datasets = coinsData.map((coin, index) => {
        const colors = [
            'rgb(59, 130, 246)',   // Blue
            'rgb(16, 185, 129)',   // Green
            'rgb(245, 101, 101)',  // Red
            'rgb(139, 92, 246)',   // Purple
            'rgb(251, 146, 60)'    // Orange
        ];

        return {
            label: coin.id.toUpperCase(),
            data: coin.data.prices,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6
        };
    });

    // Create new chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
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
                            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

// Live tracking functionality
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
        // Add swipe/fade animation to chart container
        const chartContainer = document.getElementById('chartContainer');
        if (chartContainer) {
            // Add swipe effect
            chartContainer.classList.add('chart-swipe-in');
            setTimeout(() => {
                chartContainer.classList.remove('chart-swipe-in');
                // Add fade effect after swipe
                chartContainer.classList.add('chart-fade-in');
                setTimeout(() => {
                    chartContainer.classList.remove('chart-fade-in');
                }, 500);
            }, 300);
        }

        await loadTrackerData();
        showNotification('Live update completed', 'info');
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
                countdownEl.classList.add('text-red-600', 'animate-pulse', 'font-bold');
                countdownEl.classList.remove('text-blue-600');
            } else {
                countdownEl.classList.add('text-blue-600');
                countdownEl.classList.remove('text-red-600', 'animate-pulse', 'font-bold');
            }

            // Add a subtle pulse effect when reaching zero
            if (countdownValue <= 0) {
                countdownEl.classList.add('live-indicator', 'text-green-600', 'animate-bounce');
                setTimeout(() => {
                    countdownEl.classList.remove('live-indicator', 'text-green-600', 'animate-bounce');
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

function removeFromFavorites(coinId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(coinId);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        showToast(`${coinId} removed from favorites`, 'info');
        loadTrackerData(); // Reload data
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
            showNotification(`Successfully loaded ${coinsData.length} coins`, 'success');
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
                <div class="favorites-pill ${errorClass} px-3 py-1 rounded-full text-sm flex items-center chart-swipe-in" ${title} style="animation-delay: ${index * 0.1}s">
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
        chartContainerEl.classList.add('chart-fade-in');
        const lastRefreshEl = document.getElementById('lastRefresh');
        if (lastRefreshEl) {
            lastRefreshEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        }

        // Reset countdown if live updates are enabled
        if (liveUpdateInterval) {
            countdownValue = parseInt(document.getElementById('refreshInterval').value);
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                countdownEl.textContent = countdownValue;
            }
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
            <div class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center chart-swipe-in" title="Using demo data">
                <span class="capitalize">${coinId}</span>
                <button onclick="removeFromFavorites('${coinId}')" class="ml-2 text-blue-600 hover:text-blue-800">×</button>
            </div>
        `).join('');

        updateChart(dummyData);
        favoritesContainerEl.classList.remove('hidden');
        chartContainerEl.classList.remove('hidden');
        chartContainerEl.classList.add('chart-fade-in');
        const lastRefreshEl = document.getElementById('lastRefresh');
        if (lastRefreshEl) {
            lastRefreshEl.textContent = `Last updated: ${new Date().toLocaleTimeString()} (Demo Mode - Network Issues)`;
        }

        // Show notification about demo mode
        showNotification('All APIs are currently unavailable. Using demo data with beautiful animations!', 'warning');
    } finally {
        loadingEl.classList.add('hidden');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Load initial data
    await loadTrackerData();

    // Start live updates by default (no toggle needed)
    startLiveUpdates();

    // Set up event listeners
    document.getElementById('refreshBtn').addEventListener('click', async () => {
        const refreshBtn = document.getElementById('refreshBtn');

        // Add loading animation to button
        refreshBtn.classList.add('animate-pulse', 'bg-green-400');
        refreshBtn.textContent = 'Refreshing...';

        try {
            await loadTrackerData();
            showNotification('Portfolio updated', 'success');
        } catch (error) {
            showNotification('Refresh failed', 'error');
        } finally {
            // Remove loading animation
            refreshBtn.classList.remove('animate-pulse', 'bg-green-400');
            refreshBtn.textContent = 'Refresh Now';
        }
    });

    document.getElementById('refreshInterval').addEventListener('change', () => {
        stopLiveUpdates();
        startLiveUpdates();
    });

    document.getElementById('dummyModeToggle').addEventListener('change', async (e) => {
        if (e.target.checked) {
            // Start live price simulation when demo mode is enabled
            startLivePriceSimulation();
        } else {
            // Stop live price simulation when demo mode is disabled
            stopLivePriceSimulation();
        }

        await loadTrackerData();
        showNotification(`Demo mode ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
    });
});
