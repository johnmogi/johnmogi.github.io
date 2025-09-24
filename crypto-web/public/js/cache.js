// Cache management for API responses
class ApiCache {
    constructor() {
        this.cacheKey = 'crypto_api_cache';
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    // Get data from cache
    get(key) {
        const cache = this.loadCache();
        const cachedItem = cache[key];

        if (!cachedItem) {
            return null;
        }

        // Check if cache is expired
        if (Date.now() - cachedItem.timestamp > this.cacheExpiry) {
            this.remove(key);
            return null;
        }

        console.log(`📦 Cache hit for: ${key}`);
        return cachedItem.data;
    }

    // Store data in cache
    set(key, data) {
        const cache = this.loadCache();
        cache[key] = {
            data: data,
            timestamp: Date.now()
        };
        this.saveCache(cache);
        console.log(`💾 Cached data for: ${key}`);
    }

    // Remove specific item from cache
    remove(key) {
        const cache = this.loadCache();
        delete cache[key];
        this.saveCache(cache);
        console.log(`🗑️ Removed cache for: ${key}`);
    }

    // Clear all cache
    clear() {
        this.saveCache({});
        console.log('🧹 Cache cleared');
    }

    // Load cache from localStorage
    loadCache() {
        try {
            const cache = localStorage.getItem(this.cacheKey);
            return cache ? JSON.parse(cache) : {};
        } catch (error) {
            console.error('Error loading cache:', error);
            return {};
        }
    }

    // Save cache to localStorage
    saveCache(cache) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(cache));
        } catch (error) {
            console.error('Error saving cache:', error);
            // If localStorage is full, clear it and try again
            if (error.name === 'QuotaExceededError') {
                this.clear();
                try {
                    localStorage.setItem(this.cacheKey, JSON.stringify(cache));
                } catch (retryError) {
                    console.error('Failed to save cache even after clearing:', retryError);
                }
            }
        }
    }

    // Get cache stats
    getStats() {
        const cache = this.loadCache();
        const keys = Object.keys(cache);
        const totalSize = JSON.stringify(cache).length;
        const expired = keys.filter(key => {
            const item = cache[key];
            return Date.now() - item.timestamp > this.cacheExpiry;
        }).length;

        return {
            totalItems: keys.length,
            totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
            expiredItems: expired
        };
    }
}

// Create global cache instance
const apiCache = new ApiCache();

// Export for use in other modules
window.apiCache = apiCache;
