# 🚀 Crypto Tracker - Beautiful & Reliable

A stunning cryptocurrency price tracker with real-time charts, beautiful animations, and bulletproof reliability.

## ✨ Features

- **🎨 Beautiful Design**: Modern UI with smooth animations and professional styling
- **📊 Real-time Charts**: Interactive price charts with live updates
- **🔄 Smart Fallback**: Automatically switches to demo data when APIs are unavailable
- **⚡ Live Updates**: Configurable refresh intervals (5s to 10min)
- **🎭 Demo Mode**: Toggle between real API data and realistic demo data
- **📱 Responsive**: Works perfectly on desktop and mobile devices
- **💾 Smart Caching**: API responses cached to avoid rate limits
- **🔧 Production Ready**: Proper Tailwind CSS build process

## 🚀 Quick Start

### Option 1: Auto Setup (Recommended)
```bash
# Linux/Mac
./start-dev.sh

# Windows
start-dev.bat
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Build CSS
npx tailwindcss -i ./public/css/styles.css -o ./public/css/output.css --minify

# 3. Start server
cd public
python -m http.server 8000
```

### Option 3: Open in Browser
```
http://localhost:8000
```

## 🎯 Navigation Guide

1. **Grid Page** (`index.html`):
   - Browse all available cryptocurrencies
   - Click any coin to view detailed information
   - Real-time price updates with caching

2. **Tracker Page** (`tracker.html`):
   - Add favorite coins to your portfolio
   - Multi-coin price charts
   - Live updates with visual countdown

3. **Coin Detail** (`coin.html?id=<coin>`):
   - Comprehensive coin information
   - Historical price charts
   - Market statistics

## 🔧 Configuration

### Demo Mode
- **✅ Enabled by default** for immediate reliable experience
- **🎭 Realistic data** with proper price movements and trends
- **⚡ Live updates** with smooth animations

### Live Updates
- **5-second intervals** for real-time data
- **Visual countdown** showing next update
- **Smooth transitions** between data points

### API Fallback System
1. **CryptoCompare API** (primary) - Fast, reliable for major coins
2. **CoinGecko API** (secondary) - Comprehensive data via proxy
3. **Cached Data** (fallback) - Previously fetched data
4. **Demo Mode** (always works) - Beautiful animations with realistic data

## 💾 Caching System

- **5-minute cache** for API responses
- **Automatic fallback** to cached data when APIs fail
- **Rate limit protection** - avoids hitting API limits
- **Local storage** - persists between browser sessions

## 🎨 Design Features

- **Smooth animations** for all interactions
- **Live indicators** (● LIVE badge, pulsing effects)
- **Color-coded status** (blue=real data, yellow=demo data)
- **Professional typography** and spacing
- **Responsive layout** for all screen sizes

## 🔒 Privacy & Security

- **No data collection** - runs entirely in your browser
- **No external dependencies** - all resources loaded locally
- **CORS-compliant** - uses proxy services for API access
- **Offline-ready** - demo mode works without internet

## 🛠️ Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS (properly built)
- **Charts**: Chart.js with date adapter
- **APIs**: CryptoCompare + CoinGecko with proxy fallback
- **Caching**: localStorage with 5-minute expiry
- **Build Process**: Tailwind CLI with PostCSS

## 📱 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🎉 Enjoy!

Experience the perfect blend of beautiful design and reliable functionality. The tracker works flawlessly whether APIs are available or not, always providing a stunning visual experience with realistic data.

## 🐛 Troubleshooting

### CSS Not Loading
```bash
# Rebuild the CSS
npx tailwindcss -i ./public/css/styles.css -o ./public/css/output.css --minify
```

### Server Not Starting
```bash
# Check if port 8000 is available
netstat -an | grep :8000
# Or use a different port
python -m http.server 8080
```

### APIs Not Working
- The app will automatically fall back to demo mode
- Check browser console for detailed error messages
- Demo mode provides the same beautiful experience

### Performance Issues
- Clear browser cache and localStorage
- Refresh the page
- Demo mode is optimized for smooth performance
