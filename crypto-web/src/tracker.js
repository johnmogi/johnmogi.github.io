// Favorites storage and management
// Will be implemented in Phase 3-6

const FAVORITES_KEY = 'crypto_favorites';
const MAX_FAVORITES = 5;

export function getFavorites() {
    try {
        const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        return favorites;
    } catch (error) {
        console.error('Error loading favorites:', error);
        return [];
    }
}

export function addToFavorites(coinId) {
    const favorites = getFavorites();

    if (favorites.includes(coinId)) {
        return { success: false, message: 'Coin already in favorites' };
    }

    if (favorites.length >= MAX_FAVORITES) {
        return { success: false, message: `Maximum ${MAX_FAVORITES} favorites allowed` };
    }

    favorites.push(coinId);
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return { success: true, message: 'Added to favorites' };
    } catch (error) {
        console.error('Error saving favorites:', error);
        return { success: false, message: 'Error saving favorites' };
    }
}

export function removeFavorite(coinId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(coinId);

    if (index === -1) {
        return { success: false, message: 'Coin not in favorites' };
    }

    favorites.splice(index, 1);
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return { success: true, message: 'Removed from favorites' };
    } catch (error) {
        console.error('Error saving favorites:', error);
        return { success: false, message: 'Error saving favorites' };
    }
}

export function isMaxFavorites() {
    return getFavorites().length >= MAX_FAVORITES;
}

// Dummy data mode functions
export function isDummyMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('dummy') === '1' || document.getElementById('dummyModeToggle')?.checked;
}

export function generateDummyData(coinIds, days = 1) {
    // TODO: Implement dummy data generation
    console.log('Generating dummy data for:', coinIds, 'days:', days);
    return {};
}
