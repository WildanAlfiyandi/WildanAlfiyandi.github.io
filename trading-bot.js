// XAU/USD Scalping Trading Bot with AI Momentum Detection
class ScalpingBot {
    constructor() {
        this.isRunning = false;
        this.currentPrice = 2650.00; // Starting XAU/USD price
        this.priceHistory = [];
        this.maxHistory = 100;
        this.updateInterval = 2000; // Update every 2 seconds
        this.chart = null;
        this.momentum = 0;
        this.signal = 'NEUTRAL';
        
        // AI Parameters
        this.rsiPeriod = 14;
        this.maPeriod = 20;
        this.volumeWeight = 0.3;
        
        this.initChart();
        this.attachEventListeners();
        this.initializeData();
    }

    initializeData() {
        // Initialize with some historical data
        for (let i = 0; i < 50; i++) {
            const price = this.currentPrice + (Math.random() - 0.5) * 10;
            this.priceHistory.push({
                time: new Date(Date.now() - (50 - i) * 2000),
                price: price,
                volume: Math.random() * 100
            });
        }
        this.calculateMomentum();
        this.updateDisplay();
        this.updateChart();
    }

    initChart() {
        const canvas = document.getElementById('priceChart');
        const ctx = canvas.getContext('2d');
        this.chartContext = ctx;
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            this.updateChart();
        });
    }

    attachEventListeners() {
        document.getElementById('start-bot').addEventListener('click', () => this.start());
        document.getElementById('stop-bot').addEventListener('click', () => this.stop());
        document.getElementById('reset-data').addEventListener('click', () => this.reset());
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('bot-status').textContent = 'Aktif';
        document.getElementById('bot-status').className = 'value status-active';
        document.getElementById('start-bot').disabled = true;
        document.getElementById('stop-bot').disabled = false;
        
        this.addLog('Bot dimulai! Memulai analisis momentum AI...', 'success');
        
        this.intervalId = setInterval(() => this.update(), this.updateInterval);
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.intervalId);
        
        document.getElementById('bot-status').textContent = 'Tidak Aktif';
        document.getElementById('bot-status').className = 'value status-inactive';
        document.getElementById('start-bot').disabled = false;
        document.getElementById('stop-bot').disabled = true;
        
        this.addLog('Bot dihentikan.', 'info');
    }

    reset() {
        this.stop();
        this.priceHistory = [];
        this.currentPrice = 2650.00;
        this.momentum = 0;
        this.signal = 'NEUTRAL';
        
        this.initializeData();
        this.updateDisplay();
        
        document.getElementById('log-container').innerHTML = '';
        this.addLog('Data direset. Bot siap untuk dijalankan kembali.', 'info');
    }

    update() {
        // Simulate price movement with realistic behavior
        const trend = Math.sin(Date.now() / 10000) * 0.5;
        const volatility = 0.5 + Math.random() * 0.5;
        const change = (Math.random() - 0.5 + trend) * volatility;
        
        this.currentPrice += change;
        
        const newData = {
            time: new Date(),
            price: this.currentPrice,
            volume: 50 + Math.random() * 50
        };
        
        this.priceHistory.push(newData);
        
        // Keep only recent history
        if (this.priceHistory.length > this.maxHistory) {
            this.priceHistory.shift();
        }
        
        // Calculate AI momentum
        this.calculateMomentum();
        
        // Update display
        this.updateDisplay();
        
        // Generate trading signal
        this.generateSignal();
        
        // Update chart
        this.updateChart();
    }

    calculateMomentum() {
        if (this.priceHistory.length < this.maPeriod) {
            this.momentum = 0;
            return;
        }
        
        // Calculate RSI (Relative Strength Index)
        const rsi = this.calculateRSI();
        
        // Calculate Moving Average
        const ma = this.calculateMA();
        const currentPrice = this.priceHistory[this.priceHistory.length - 1].price;
        const maDeviation = ((currentPrice - ma) / ma) * 100;
        
        // Calculate Volume Momentum
        const volumeMomentum = this.calculateVolumeMomentum();
        
        // Calculate Price Momentum (rate of change)
        const priceMomentum = this.calculatePriceMomentum();
        
        // AI Weighted Momentum Score (-100 to +100)
        // RSI component: normalized to -50 to +50
        const rsiScore = (rsi - 50);
        
        // MA deviation component: -30 to +30
        const maScore = Math.max(-30, Math.min(30, maDeviation * 3));
        
        // Volume component: -10 to +10
        const volumeScore = volumeMomentum * 10;
        
        // Price momentum component: -10 to +10
        const priceScore = priceMomentum * 10;
        
        // Combine all factors
        this.momentum = rsiScore * 0.4 + maScore * 0.3 + volumeScore * 0.2 + priceScore * 0.1;
        this.momentum = Math.max(-100, Math.min(100, this.momentum));
    }

    calculateRSI() {
        const period = Math.min(this.rsiPeriod, this.priceHistory.length - 1);
        let gains = 0;
        let losses = 0;
        
        for (let i = this.priceHistory.length - period; i < this.priceHistory.length; i++) {
            const change = this.priceHistory[i].price - this.priceHistory[i - 1].price;
            if (change > 0) {
                gains += change;
            } else {
                losses -= change;
            }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        return rsi;
    }

    calculateMA() {
        const period = Math.min(this.maPeriod, this.priceHistory.length);
        let sum = 0;
        
        for (let i = this.priceHistory.length - period; i < this.priceHistory.length; i++) {
            sum += this.priceHistory[i].price;
        }
        
        return sum / period;
    }

    calculateVolumeMomentum() {
        if (this.priceHistory.length < 10) return 0;
        
        const recent = this.priceHistory.slice(-5);
        const older = this.priceHistory.slice(-10, -5);
        
        const recentAvgVol = recent.reduce((sum, d) => sum + d.volume, 0) / recent.length;
        const olderAvgVol = older.reduce((sum, d) => sum + d.volume, 0) / older.length;
        
        return (recentAvgVol - olderAvgVol) / olderAvgVol;
    }

    calculatePriceMomentum() {
        if (this.priceHistory.length < 5) return 0;
        
        const recent = this.priceHistory.slice(-5);
        const firstPrice = recent[0].price;
        const lastPrice = recent[recent.length - 1].price;
        
        return (lastPrice - firstPrice) / firstPrice;
    }

    generateSignal() {
        let newSignal = 'NEUTRAL';
        
        // Strong buy signal
        if (this.momentum > 30) {
            newSignal = 'BUY';
            if (this.signal !== 'BUY') {
                this.addLog(
                    `🟢 SINYAL BUY! Momentum: ${this.momentum.toFixed(2)} | Harga: $${this.currentPrice.toFixed(2)}`,
                    'success'
                );
            }
        }
        // Strong sell signal
        else if (this.momentum < -30) {
            newSignal = 'SELL';
            if (this.signal !== 'SELL') {
                this.addLog(
                    `🔴 SINYAL SELL! Momentum: ${this.momentum.toFixed(2)} | Harga: $${this.currentPrice.toFixed(2)}`,
                    'error'
                );
            }
        }
        // Neutral
        else {
            newSignal = 'NEUTRAL';
        }
        
        this.signal = newSignal;
    }

    updateDisplay() {
        // Update price
        document.getElementById('current-price').textContent = `$${this.currentPrice.toFixed(2)}`;
        
        // Update momentum
        const momentumText = this.momentum > 0 ? '+' : '';
        document.getElementById('momentum').textContent = `${momentumText}${this.momentum.toFixed(2)}`;
        
        // Update signal
        const signalElement = document.getElementById('signal');
        signalElement.textContent = this.signal;
        signalElement.className = 'value';
        
        if (this.signal === 'BUY') {
            signalElement.classList.add('signal-buy');
        } else if (this.signal === 'SELL') {
            signalElement.classList.add('signal-sell');
        } else {
            signalElement.classList.add('signal-neutral');
        }
    }

    updateChart() {
        const canvas = document.getElementById('priceChart');
        const ctx = this.chartContext;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (this.priceHistory.length < 2) return;
        
        // Calculate min and max prices for scaling
        const prices = this.priceHistory.map(d => d.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;
        const padding = priceRange * 0.1;
        
        // Draw grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
            
            // Price labels
            const price = maxPrice + padding - ((priceRange + 2 * padding) / 4) * i;
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px sans-serif';
            ctx.fillText(`$${price.toFixed(2)}`, 5, y - 5);
        }
        
        // Draw price line
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < this.priceHistory.length; i++) {
            const x = (width / (this.priceHistory.length - 1)) * i;
            const price = this.priceHistory[i].price;
            const y = height - ((price - (minPrice - padding)) / (priceRange + 2 * padding)) * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw signal markers
        for (let i = Math.max(0, this.priceHistory.length - 20); i < this.priceHistory.length; i++) {
            const x = (width / (this.priceHistory.length - 1)) * i;
            const price = this.priceHistory[i].price;
            const y = height - ((price - (minPrice - padding)) / (priceRange + 2 * padding)) * height;
            
            // Simplified signal visualization on recent points
            if (i === this.priceHistory.length - 1) {
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                
                if (this.signal === 'BUY') {
                    ctx.fillStyle = '#10b981';
                } else if (this.signal === 'SELL') {
                    ctx.fillStyle = '#ef4444';
                } else {
                    ctx.fillStyle = '#6b7280';
                }
                
                ctx.fill();
            }
        }
    }

    addLog(message, type = 'info') {
        const logContainer = document.getElementById('log-container');
        const timestamp = new Date().toLocaleTimeString('id-ID');
        
        const logEntry = document.createElement('p');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        
        // Keep only last 50 entries
        while (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }
}

// Initialize bot when page loads
document.addEventListener('DOMContentLoaded', () => {
    const bot = new ScalpingBot();
    
    // Make bot accessible globally for debugging
    window.bot = bot;
    
    console.log('XAU/USD Scalping Bot initialized!');
    console.log('Use window.bot to access bot instance for debugging');
});
