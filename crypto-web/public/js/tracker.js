function throttleNotification(message, type = 'info', cooldown = DEFAULT_NOTIFICATION_COOLDOWN) {
    const key = `${type}:${message}`;
    const now = Date.now();
    const lastShown = notificationCooldowns.get(key) || 0;

    if (now - lastShown < cooldown) {
        return;
    }

    notificationCooldowns.set(key, now);
    showNotification(message, type);
}

// Portfolio Tracker Functions - Uses shared API module
let liveUpdateInterval = null;
let countdownInterval = null;
let countdownValue = 30;

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
const notificationCooldowns = new Map();
const DEFAULT_NOTIFICATION_COOLDOWN = 2 * 60 * 1000; // 2 minutes

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
let trackerInitialized = false;

function updateChart(coinsData) {
    const chartContainer = document.getElementById('chartContainer');
    if (!chartContainer) return;

    const canvas = document.getElementById('portfolioChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Prepare datasets for multiple coins
    const datasets = coinsData.map((coin, index) => {
        const colors = [
            'rgb(59, 130, 246)',   // Blue
            'rgb(16, 185, 129)',   // Green
            'rgb(245, 101, 101)',  // Red
            'rgb(139, 92, 246)',   // Purple
            'rgb(251, 146, 60)'    // Orange
        ];

        const color = colors[index % colors.length];
        return {
            label: coin.id.toUpperCase(),
            data: coin.data.prices.map(([timestamp, price]) => ({
                x: timestamp,
                y: price
            })),
            borderColor: color,
            backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6
        };
    });

    // Update existing chart with animation when available
    if (currentChart) {
        const existingDatasets = currentChart.data.datasets;
        const newLabels = datasets.map(dataset => dataset.label);

        // Update or add datasets
        datasets.forEach(newDataset => {
            const existingDataset = existingDatasets.find(dataset => dataset.label === newDataset.label);
            if (existingDataset) {
                existingDataset.borderColor = newDataset.borderColor;
                existingDataset.backgroundColor = newDataset.backgroundColor;
                existingDataset.tension = newDataset.tension;
                existingDataset.pointRadius = newDataset.pointRadius;
                existingDataset.pointHoverRadius = newDataset.pointHoverRadius;
                existingDataset.data.length = 0;
                newDataset.data.forEach(point => existingDataset.data.push(point));
            } else {
                existingDatasets.push(newDataset);
            }
        });

        // Remove datasets no longer present
        for (let i = existingDatasets.length - 1; i >= 0; i--) {
            if (!newLabels.includes(existingDatasets[i].label)) {
                existingDatasets.splice(i, 1);
            }
        }

        currentChart.update('none');
        return;
    }

    // Create new chart on first render
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            parsing: false,
            normalized: true,
            animation: false,
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
        // Show live update state on chart
        showChartRefreshState('loading');
        
        try {
            await loadTrackerData();
            // Success state is handled in loadTrackerData
        } catch (error) {
            showChartRefreshState('error');
        }
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

            // More responsive visual feedback for fast intervals
            const interval = parseInt(document.getElementById('refreshInterval').value);
            if (interval <= 30) {
                // For fast intervals (1s, 5s, 30s), show urgency earlier
                if (countdownValue <= Math.max(interval * 0.3, 2)) {
                    countdownEl.classList.add('text-red-600', 'animate-pulse', 'font-bold');
                    countdownEl.classList.remove('text-blue-600');
                } else {
                    countdownEl.classList.add('text-blue-600');
                    countdownEl.classList.remove('text-red-600', 'animate-pulse', 'font-bold');
                }
            } else {
                // For slower intervals, more subtle feedback
                if (countdownValue <= 10) {
                    countdownEl.classList.add('text-orange-600');
                    countdownEl.classList.remove('text-blue-600');
                } else {
                    countdownEl.classList.add('text-blue-600');
                    countdownEl.classList.remove('text-orange-600');
                }

                if (countdownValue <= 3) {
                    countdownEl.classList.add('animate-pulse');
                } else {
                    countdownEl.classList.remove('animate-pulse');
                }
            }
        }

        if (countdownValue <= 0) {
            countdownValue = parseInt(document.getElementById('refreshInterval').value);
        }
    }, 1000);
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
        showNotification(`${coinId} removed from favorites`, 'info');
        loadTrackerData(); // Reload data
        return true;
    }
    return false;
}

// Enhanced chart refresh UX
function showChartRefreshState(state) {
    const chartContainer = document.getElementById('chartContainer');
    if (!chartContainer) return;

    // Remove all previous states
    chartContainer.classList.remove('chart-refreshing', 'chart-success');
    
    // Remove any existing overlays
    const existingOverlay = chartContainer.querySelector('.chart-loading-overlay');
    const existingStream = chartContainer.querySelector('.data-stream');
    const existingIndicator = chartContainer.querySelector('.refresh-indicator');
    
    if (existingOverlay) existingOverlay.remove();
    if (existingStream) existingStream.remove();
    if (existingIndicator) existingIndicator.remove();

    switch (state) {
        case 'loading':
            chartContainer.classList.add('chart-refreshing');
            
            // Add data stream animation
            const dataStream = document.createElement('div');
            dataStream.className = 'data-stream';
            chartContainer.appendChild(dataStream);
            
            // Add refresh indicator
            const refreshIndicator = document.createElement('div');
            refreshIndicator.className = 'refresh-indicator';
            refreshIndicator.innerHTML = '🔄 Live Update';
            chartContainer.appendChild(refreshIndicator);
            break;

        case 'success':
            chartContainer.classList.add('chart-success');
            
            // Add success indicator
            const successIndicator = document.createElement('div');
            successIndicator.className = 'refresh-indicator';
            successIndicator.style.background = 'rgba(16, 185, 129, 0.9)';
            successIndicator.innerHTML = '✓ Updated';
            chartContainer.appendChild(successIndicator);
            
            // Remove success state after animation
            setTimeout(() => {
                chartContainer.classList.remove('chart-success');
                if (successIndicator.parentNode) {
                    successIndicator.remove();
                }
            }, 2000);
            break;

        case 'error':
            // Add error indicator
            const errorIndicator = document.createElement('div');
            errorIndicator.className = 'refresh-indicator';
            errorIndicator.style.background = 'rgba(239, 68, 68, 0.9)';
            errorIndicator.innerHTML = '⚠ Error';
            chartContainer.appendChild(errorIndicator);
            
            // Remove error state after delay
            setTimeout(() => {
                if (errorIndicator.parentNode) {
                    errorIndicator.remove();
                }
            }, 3000);
            break;

        case 'manual':
            chartContainer.classList.add('chart-refreshing');
            
            // Add manual refresh overlay
            const manualOverlay = document.createElement('div');
            manualOverlay.className = 'chart-loading-overlay';
            manualOverlay.innerHTML = `
                <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <div class="text-blue-600 font-medium">Refreshing Charts...</div>
                </div>
            `;
            chartContainer.appendChild(manualOverlay);
            break;

        case 'clear':
        default:
            // Clear all states - already done above
            break;
    }
}

// View coin details
function viewCoinDetails(coinId) {
    // Navigate to coin detail page with the selected coin
    window.location.href = `coin.html?coin=${coinId}`;
}

// Load and display tracker data
async function loadTrackerData(forceRefresh = false) {
    const favorites = getFavorites();
    const loadingEl = document.getElementById('loading');
    const emptyStateEl = document.getElementById('emptyState');
    const chartContainerEl = document.getElementById('chartContainer');
    const favoritesContainerEl = document.getElementById('favoritesContainer');
    const errorStateEl = document.getElementById('errorState');

    // Show appropriate loading state
    const chartVisible = chartContainerEl && !chartContainerEl.classList.contains('hidden');

    if (forceRefresh && chartVisible) {
        // Manual refresh - show chart overlay
        showChartRefreshState('manual');
    } else if (!chartVisible) {
        // Initial load or returning from empty state - show main loading
        loadingEl.classList.remove('hidden');
        emptyStateEl.classList.add('hidden');
        if (chartContainerEl) {
            chartContainerEl.classList.add('hidden');
        }
        errorStateEl.classList.add('hidden');
    } else {
        loadingEl.classList.add('hidden');
        errorStateEl.classList.add('hidden');
    }

    if (favorites.length === 0) {
        loadingEl.classList.add('hidden');
        emptyStateEl.classList.remove('hidden');
        if (chartContainerEl) {
            chartContainerEl.classList.add('hidden');
        }
        trackerInitialized = false;
        showChartRefreshState('clear');
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
                    console.log(`📊 Fetching${forceRefresh ? ' fresh' : ''} data for ${coinId}`);
                    const data = await getMarketChart(coinId, 30, forceRefresh);
                    return { id: coinId, data };
                }
            } catch (error) {
                if (error && (error.code === 'MARKET_CHART_RECENT_FAILURE' || error.code === 'MARKET_CHART_FORBIDDEN')) {
                    console.warn(`⚠️ Skipping API call for ${coinId} due to recent ${error.status || 'error'} from ${error.provider || 'provider'}`);
                } else {
                    console.error(`❌ Failed to load data for ${coinId}:`, error.message);
                }

                const fallbackData = generateDummyData(coinId, 30);
                const fallbackInfo = {
                    id: coinId,
                    data: fallbackData,
                    fallback: true,
                    failure: error && (error.code || error.message)
                };
                return fallbackInfo;
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
            throttleNotification(`${failedCoins.length} coin(s) failed to load - using demo data`, 'warning');
            showChartRefreshState('error');
        } else if (fallbackCoins.length > 0) {
            console.warn(`⚠️ ${fallbackCoins.length} coins using fallback data:`, fallbackCoins.map(c => c.id));
            throttleNotification(`Using demo data for ${fallbackCoins.length} coin(s) - API may be unavailable`, 'warning');
            showChartRefreshState('success');
        } else {
            const refreshType = forceRefresh ? 'fresh data loaded' : 'data loaded';
            showNotification(`Successfully updated with ${refreshType}`, 'success');
            showChartRefreshState('success');
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
                    <button onclick="viewCoinDetails('${coinId}')" class="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200" title="View Details">👁</button>
                    <button onclick="removeFromFavorites('${coinId}')" class="ml-2 text-red-600 hover:text-red-800 transition-colors duration-200">×</button>
                </div>
            `;
        }).join('');

        // Create or update chart
        updateChart(coinsData);

        // Update UI with smooth transitions
        favoritesContainerEl.classList.remove('hidden');
        chartContainerEl.classList.remove('hidden');
        chartContainerEl.classList.add('chart-fade-in');
        trackerInitialized = true;
        const lastRefreshEl = document.getElementById('lastRefresh');
        if (lastRefreshEl) {
            const refreshType = forceRefresh ? 'Manual refresh' : 'Auto update';
            lastRefreshEl.textContent = `${refreshType}: ${new Date().toLocaleTimeString()}`;
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
        const isNetworkError = error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('429') || error.message.includes('All API providers failed') || error.message.includes('CORS_BLOCKED') || error.message.includes('BROWSER_ENVIRONMENT');

        if (isNetworkError) {
            console.log('🌐 Network/CORS/API error detected - switching to demo mode');
            throttleNotification('Network issues detected. Using demo data for reliable experience.', 'warning');
        } else {
            showNotification('API unavailable. Using demo data as fallback.', 'warning');
        }

        showChartRefreshState('error');

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
                <button onclick="viewCoinDetails('${coinId}')" class="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200" title="View Details">👁</button>
                <button onclick="removeFromFavorites('${coinId}')" class="ml-2 text-red-600 hover:text-red-800 transition-colors duration-200">×</button>
            </div>
        `).join('');

        updateChart(dummyData);
        favoritesContainerEl.classList.remove('hidden');
        chartContainerEl.classList.remove('hidden');
        chartContainerEl.classList.add('chart-fade-in');
        trackerInitialized = true;
        const lastRefreshEl = document.getElementById('lastRefresh');
        if (lastRefreshEl) {
            lastRefreshEl.textContent = `Last updated: ${new Date().toLocaleTimeString()} (Demo Mode - Network Issues)`;
        }

        // Show notification about demo mode
        showNotification('All APIs are currently unavailable. Using demo data with beautiful animations!', 'warning');
    } finally {
        loadingEl.classList.add('hidden');
        // Clear manual refresh overlay after a delay
        if (forceRefresh) {
            setTimeout(() => {
                showChartRefreshState('clear');
            }, 1000);
        }
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
        const originalText = refreshBtn.textContent;

        // Add loading animation to button
        refreshBtn.classList.add('loading', 'refresh-button');
        refreshBtn.innerHTML = '<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>Refreshing...';
        refreshBtn.disabled = true;

        try {
            await loadTrackerData();

            // Show success state
            refreshBtn.classList.remove('loading');
            refreshBtn.classList.add('success');
            refreshBtn.innerHTML = '<span class="mr-2">✓</span>Updated!';

            showNotification('Portfolio updated successfully!', 'success');

            // Reset button after 2 seconds
            setTimeout(() => {
                refreshBtn.classList.remove('success');
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 2000);

        } catch (error) {
            // Show error state
            refreshBtn.classList.remove('loading');
            refreshBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            refreshBtn.innerHTML = '<span class="mr-2">✗</span>Failed';

            showNotification('Refresh failed - please try again', 'error');

            // Reset button after 3 seconds
            setTimeout(() => {
                refreshBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 3000);
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
