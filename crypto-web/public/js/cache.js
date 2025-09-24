// Cache management for API responses
class ApiCache {
    constructor() {
        this.cacheKey = 'crypto_api_cache';
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.debug = true; // Enable debug logging
    }

    // Get data from cache
    get(key) {
        try {
            const cache = this.loadCache();
            const cachedItem = cache[key];

            if (!cachedItem) {
                if (this.debug) console.log(`📦 Cache miss for: ${key} (no cached item)`);
                return null;
            }

            // Check if cache is expired
            if (Date.now() - cachedItem.timestamp > this.cacheExpiry) {
                if (this.debug) console.log(`📦 Cache expired for: ${key}`);
                this.remove(key);
                return null;
            }

            if (this.debug) console.log(`📦 Cache hit for: ${key}`);
            return cachedItem.data;
        } catch (error) {
            console.error(`❌ Cache get error for ${key}:`, error);
            return null;
        }
    }

    // Store data in cache
    set(key, data) {
        try {
            const cache = this.loadCache();
            cache[key] = {
                data: data,
                timestamp: Date.now()
            };
            this.saveCache(cache);
            if (this.debug) console.log(`💾 Cached data for: ${key}`);
        } catch (error) {
            console.error(`❌ Cache set error for ${key}:`, error);
        }
    }

    // Remove specific item from cache
    remove(key) {
        try {
            const cache = this.loadCache();
            delete cache[key];
            this.saveCache(cache);
            if (this.debug) console.log(`🗑️ Removed cache for: ${key}`);
        } catch (error) {
            console.error(`❌ Cache remove error for ${key}:`, error);
        }
    }

    // Clear all cache
    clear() {
        try {
            localStorage.removeItem(this.cacheKey);
            if (this.debug) console.log(`🧹 Cleared all cache`);
        } catch (error) {
            console.error(`❌ Cache clear error:`, error);
        }
    }

    // Load cache from localStorage
    loadCache() {
        try {
            const cacheData = localStorage.getItem(this.cacheKey);
            return cacheData ? JSON.parse(cacheData) : {};
        } catch (error) {
            console.error(`❌ Error loading cache:`, error);
            return {};
        }
    }

    // Save cache to localStorage
    saveCache(cache) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(cache));
        } catch (error) {
            console.error(`❌ Error saving cache:`, error);
            // If localStorage is full, try to clear some space
            try {
                localStorage.clear();
                localStorage.setItem(this.cacheKey, JSON.stringify(cache));
            } catch (retryError) {
                console.error('Failed to save cache even after clearing:', retryError);
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
