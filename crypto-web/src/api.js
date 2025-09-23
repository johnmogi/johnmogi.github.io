// API functions for cryptocurrency data
// Will be implemented in Phase 2

export async function listMarkets(options = {}) {
    // TODO: Implement CoinGecko API call
    throw new Error('Not implemented yet');
}

export async function getCoin(id) {
    // TODO: Implement CoinGecko API call
    throw new Error('Not implemented yet');
}

export async function getMarketChart(id, options = {}) {
    // TODO: Implement CoinGecko API call
    throw new Error('Not implemented yet');
}

// Cache implementation
const cache = new Map();

export function getCachedData(key, fetchFunction, ttlSeconds = 45) {
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < (ttlSeconds * 1000)) {
        return cached.data;
    }

    return fetchFunction().then(data => {
        cache.set(key, { data, timestamp: now });
        return data;
    });
}
