// Chart Management
let portfolioChart = null;

function updateChart(coinsData) {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
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

    // Destroy existing chart if it exists
    if (portfolioChart) {
        portfolioChart.destroy();
        portfolioChart = null;
    }

    const datasets = validCoinsData.map((coin, index) => ({
        label: coin.id.toUpperCase(),
        data: coin.data.prices.map(([timestamp, price]) => ({
            x: new Date(timestamp),
            y: price
        })),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.1)'),
        borderWidth: 2,
        fill: true,
        tension: 0.1
    }));

    portfolioChart = new Chart(ctx, {
        type: 'line',
        data: { datasets },
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
                            `${context.dataset.label}: $${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    }
                }
            }
        }
    });
}

// Generate dummy data for testing
function generateDummyData(coinId, hours = 24) {
    const data = [];
    let price = 30000 + Math.random() * 20000; // Random price between 30k-50k
    const now = Date.now();

    for (let i = hours; i >= 0; i--) {
        const timestamp = now - (i * 60 * 60 * 1000);
        // Add some random variation
        price += (Math.random() - 0.5) * 1000;
        price = Math.max(price, 1000); // Ensure price doesn't go too low
        data.push({
            timestamp,
            price: parseFloat(price.toFixed(2))
        });
    }
    return { prices: data.map(d => [d.timestamp, d.price]) };
}
