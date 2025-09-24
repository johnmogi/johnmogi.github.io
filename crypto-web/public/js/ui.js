// UI Functions and Rendering
function renderCoinsGrid(coins) {
    const grid = document.getElementById('coinsGrid');
    if (!grid) return;

    // Ensure coins is an array
    if (!Array.isArray(coins)) {
        console.error('Coins data is not an array:', coins);
        showNotification('Error: Invalid data format received', 'error');
        return;
    }

    if (coins.length === 0) {
        showNotification('No coins data available', 'info');
        return;
    }

    grid.innerHTML = coins.map(coin => `
        <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-2">
                <img src="${coin.image}" alt="${coin.name}" class="w-8 h-8 mr-2">
                <div>
                    <h3 class="font-bold text-gray-800">${coin.name}</h3>
                    <p class="text-gray-600 text-sm">${coin.symbol.toUpperCase()}</p>
                </div>
            </div>
            <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-bold text-green-600">$${coin.current_price.toLocaleString()}</span>
                <span class="text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}">
                    ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
                </span>
            </div>
            <button onclick="addToFavorites('${coin.id}')" class="w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">
                Add to Tracker
            </button>
        </div>
    `).join('');
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

function isMaxFavorites() {
    return getFavorites().length >= MAX_FAVORITES;
}

// Fallback sample data when API is unavailable
function getSampleCoinsData() {
    return [
        {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 43250.75,
            market_cap: 847500000000,
            price_change_percentage_24h: 2.45
        },
        {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 2650.32,
            market_cap: 318900000000,
            price_change_percentage_24h: -1.23
        },
        {
            id: 'tether',
            symbol: 'usdt',
            name: 'Tether',
            image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
            current_price: 1.00,
            market_cap: 91500000000,
            price_change_percentage_24h: 0.01
        },
        {
            id: 'solana',
            symbol: 'sol',
            name: 'Solana',
            image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
            current_price: 98.45,
            market_cap: 45200000000,
            price_change_percentage_24h: 5.67
        },
        {
            id: 'mantle',
            symbol: 'mnt',
            name: 'Mantle',
            image: 'https://assets.coingecko.com/coins/images/30980/large/token-logo.png',
            current_price: 0.85,
            market_cap: 2750000000,
            price_change_percentage_24h: 12.34
        }
    ];
}
