// Chart Management
let portfolioChart = null;

function updateChart(coinsData) {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    const chartContainer = document.getElementById('chartContainer');
    const colors = [
        'rgba(59, 130, 246, 1)',  // blue
        'rgba(16, 185, 129, 1)',  // green
        'rgba(239, 68, 68, 1)',   // red
        'rgba(139, 92, 246, 1)',  // purple
        'rgba(245, 158, 11, 1)'   // yellow
    ];

    // Filter out coins with invalid data
    const validCoinsData = coinsData.filter(coin => {
        return coin && coin.data && coin.data.prices && Array.isArray(coin.data.prices) && coin.data.prices.length > 0;
    });

    if (validCoinsData.length === 0) {
        showNotification('No valid chart data available', 'warning');
        return;
    }

    // Add fade-out animation to existing chart
    if (portfolioChart) {
        chartContainer.style.transition = 'opacity 0.3s ease-in-out';
        chartContainer.style.opacity = '0.3';

        setTimeout(() => {
            portfolioChart.destroy();
            portfolioChart = null;

            // Create new chart with fade-in
            createChartWithAnimation(ctx, validCoinsData, colors, chartContainer);
        }, 300);
    } else {
        createChartWithAnimation(ctx, validCoinsData, colors, chartContainer);
    }
}

function createChartWithAnimation(ctx, validCoinsData, colors, chartContainer) {
    const datasets = validCoinsData.map((coin, index) => ({
        label: coin.id.toUpperCase(),
        data: coin.data.prices.map(([timestamp, price]) => ({
            x: new Date(timestamp),
            y: price
        })),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.1)'),
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointBackgroundColor: colors[index % colors.length],
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3
    }));

    portfolioChart = new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM dd'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
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
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    borderWidth: 2,
                    cornerRadius: 12,
                    displayColors: true,
                    padding: 12,
                    callbacks: {
                        title: function(context) {
                            return new Date(context[0].parsed.x).toLocaleDateString();
                        },
                        label: (context) =>
                            `${context.dataset.label}: $${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    }
                }
            }
        }
    });

    // Fade in the new chart
    setTimeout(() => {
        chartContainer.style.opacity = '1';
        chartContainer.style.transition = 'opacity 0.5s ease-in-out';

        // Add a subtle pulse effect to indicate live data
        chartContainer.style.animation = 'chartPulse 2s ease-in-out infinite';
    }, 100);

    // Ensure canvas has proper dimensions
    const canvas = ctx.canvas;
    canvas.style.height = '300px';
    canvas.style.maxHeight = '300px';
    canvas.parentElement.style.height = '300px';
    canvas.parentElement.style.maxHeight = '300px';
}

// Add live data point animation
function addLiveDataPoint(coinId, price) {
    if (!portfolioChart) return;

    const timestamp = Date.now();
    const coinIndex = portfolioChart.data.datasets.findIndex(dataset =>
        dataset.label.toLowerCase() === coinId.toUpperCase()
    );

    if (coinIndex === -1) return;

    // Add new data point
    portfolioChart.data.datasets[coinIndex].data.push({
        x: new Date(timestamp),
        y: price
    });

    // Keep only last 100 points for performance
    if (portfolioChart.data.datasets[coinIndex].data.length > 100) {
        portfolioChart.data.datasets[coinIndex].data.shift();
    }

    // Animate the update
    portfolioChart.update('active');
}

// Generate dummy data for testing
function generateDummyData(coinId, hours = 24) {
    const data = [];
    let price = 30000 + Math.random() * 20000; // Random price between 30k-50k

    // Use coin name to create consistent but varied data
    const hash = coinId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);

    const basePrice = 10000 + (Math.abs(hash) % 50000); // Base price based on coin name
    const volatility = 0.02 + (Math.abs(hash) % 0.05); // Volatility based on coin name

    const now = Date.now();

    for (let i = hours; i >= 0; i--) {
        const timestamp = now - (i * 60 * 60 * 1000);

        // Create realistic price movement with some trend
        const trend = Math.sin(i * 0.1) * 1000; // Gentle wave pattern
        const randomChange = (Math.random() - 0.5) * basePrice * volatility;
        price = basePrice + trend + randomChange;

        // Ensure price doesn't go negative or too extreme
        price = Math.max(price, basePrice * 0.1);
        price = Math.min(price, basePrice * 3);

        data.push({
            timestamp,
            price: parseFloat(price.toFixed(2))
        });
    }

    return { prices: data.map(d => [d.timestamp, d.price]) };
}

// Simulate live price updates for demo mode
let livePriceSimulation = null;

function startLivePriceSimulation() {
    if (livePriceSimulation) {
        clearInterval(livePriceSimulation);
    }

    livePriceSimulation = setInterval(() => {
        if (portfolioChart && portfolioChart.data.datasets.length > 0) {
            portfolioChart.data.datasets.forEach((dataset, index) => {
                if (dataset.data.length > 0) {
                    // Get current price from the last data point
                    const lastPoint = dataset.data[dataset.data.length - 1];
                    const currentPrice = lastPoint.y;

                    // Simulate small price changes (±0.5%)
                    const changePercent = (Math.random() - 0.5) * 0.01; // -0.5% to +0.5%
                    const newPrice = currentPrice * (1 + changePercent);

                    // Add the new data point
                    addLiveDataPoint(dataset.label.toLowerCase(), newPrice);

                    // Update the favorites pills with new price
                    updatePriceDisplay(dataset.label.toLowerCase(), newPrice);
                }
            });
        }
    }, 5000); // Update every 5 seconds
}

function stopLivePriceSimulation() {
    if (livePriceSimulation) {
        clearInterval(livePriceSimulation);
        livePriceSimulation = null;
    }
}

// Update price display in favorites pills
function updatePriceDisplay(coinId, price) {
    const favoritesContainer = document.getElementById('favoritesContainer');
    if (!favoritesContainer) return;

    const pills = favoritesContainer.querySelectorAll('div');
    pills.forEach(pill => {
        const coinName = pill.querySelector('span').textContent.toLowerCase();
        if (coinName === coinId) {
            // Add a subtle price indicator (you could expand this)
            pill.title = `Current price: $${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    });
}
