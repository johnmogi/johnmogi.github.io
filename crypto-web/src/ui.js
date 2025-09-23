// UI rendering helpers
// Will be implemented in Phase 3-5

export function renderCoinsGrid(coins) {
    // TODO: Implement coins grid rendering
    console.log('Rendering coins grid:', coins);
}

export function renderCoinDetails(coin, chartData) {
    // TODO: Implement coin details rendering
    console.log('Rendering coin details:', coin, chartData);
}

export function renderPortfolioChart(favorites, chartData) {
    // TODO: Implement portfolio chart rendering
    console.log('Rendering portfolio chart:', favorites, chartData);
}

export function showNotification(message, type = 'info') {
    // TODO: Implement notification system
    console.log(`Notification (${type}):`, message);

    // Basic implementation for now
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
        type === 'error' ? 'bg-red-500' :
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white`;
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}
