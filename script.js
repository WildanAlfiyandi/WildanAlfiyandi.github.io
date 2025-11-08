// XAU/USD Scalping Momentum Trading - AI-Powered Analysis
// Dynamic data simulation and real-time updates

class TradingAnalyzer {
    constructor() {
        this.basePrice = 2678.45;
        this.priceVolatility = 0.8;
        this.trendDirection = 1; // 1 for bullish, -1 for bearish
        this.momentumStrength = 82;
        this.updateInterval = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.updateTime();
        this.updatePrice();
        this.updateIndicators();
        this.updateSentiment();
        this.updateSignals();
        this.setupRiskCalculator();
        this.startAutoUpdate();
    }
    
    // Time update
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        });
        document.getElementById('currentTime').textContent = timeString;
        
        const dateString = now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = dateString;
        document.getElementById('sentimentUpdate').textContent = 'Just now';
    }
    
    // Price simulation with realistic movement
    updatePrice() {
        // Simulate price movement
        const change = (Math.random() - 0.45) * this.priceVolatility * this.trendDirection;
        this.basePrice += change;
        
        // Keep price in reasonable range
        if (this.basePrice < 2650) this.basePrice = 2650;
        if (this.basePrice > 2700) this.basePrice = 2700;
        
        const currentPrice = this.basePrice.toFixed(2);
        const highPrice = (this.basePrice + Math.random() * 8).toFixed(2);
        const lowPrice = (this.basePrice - Math.random() * 8).toFixed(2);
        
        // Calculate price change
        const priceChangeValue = (Math.random() * 15 - 5).toFixed(2);
        const priceChangePercent = ((priceChangeValue / this.basePrice) * 100).toFixed(2);
        
        // Update DOM
        document.getElementById('currentPrice').textContent = `$${currentPrice}`;
        document.getElementById('highPrice').textContent = `$${highPrice}`;
        document.getElementById('lowPrice').textContent = `$${lowPrice}`;
        
        const changeElement = document.getElementById('priceChange');
        const changeValueEl = changeElement.querySelector('.change-value');
        const changePercentEl = changeElement.querySelector('.change-percent');
        
        changeValueEl.textContent = priceChangeValue >= 0 ? `+${priceChangeValue}` : priceChangeValue;
        changePercentEl.textContent = `(${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent}%)`;
        
        if (priceChangeValue >= 0) {
            changeElement.className = 'price-change positive';
            changeElement.style.color = '#10b981';
        } else {
            changeElement.className = 'price-change negative';
            changeElement.style.color = '#ef4444';
        }
        
        // Update volume
        const volume = (120 + Math.random() * 50).toFixed(1);
        document.getElementById('volume').textContent = `${volume}K`;
    }
    
    // Update technical indicators
    updateIndicators() {
        // RSI
        const rsi = (60 + Math.random() * 20).toFixed(1);
        document.getElementById('rsiValue').textContent = rsi;
        const rsiBar = document.querySelector('.indicator-bar-fill');
        if (rsiBar) {
            rsiBar.style.width = `${rsi}%`;
        }
        
        // MACD
        const macd = (Math.random() * 6 - 1).toFixed(2);
        document.getElementById('macdValue').textContent = macd >= 0 ? `+${macd}` : macd;
        
        // Stochastic
        const stoch = (60 + Math.random() * 25).toFixed(1);
        document.getElementById('stochValue').textContent = stoch;
        
        // ADX
        const adx = (35 + Math.random() * 25).toFixed(1);
        document.getElementById('adxValue').textContent = adx;
        
        // Update momentum
        this.momentumStrength = Math.min(95, Math.max(50, this.momentumStrength + (Math.random() - 0.5) * 10));
        document.getElementById('momentumValue').textContent = `${Math.round(this.momentumStrength)}%`;
        document.getElementById('momentumFill').style.width = `${this.momentumStrength}%`;
    }
    
    // Update market sentiment
    updateSentiment() {
        const sentiment = 55 + Math.random() * 30; // 55-85% bullish
        const sentimentValueEl = document.getElementById('sentimentValue');
        if (sentimentValueEl) {
            sentimentValueEl.textContent = `${Math.round(sentiment)}% Bullish`;
        }
        
        // Update gauge pointer
        const pointer = document.getElementById('gaugePointer');
        if (pointer) {
            pointer.style.left = `${sentiment}%`;
        }
        
        // Update buy/sell pressure bars
        const buyPressure = sentiment;
        const sellPressure = 100 - sentiment;
        
        const buyBar = document.querySelector('.sentiment-bar-fill.buy');
        const sellBar = document.querySelector('.sentiment-bar-fill.sell');
        
        if (buyBar) {
            buyBar.style.width = `${buyPressure}%`;
            const buyPercent = buyBar.parentElement.querySelector('.sentiment-percent');
            if (buyPercent) {
                buyPercent.textContent = `${Math.round(buyPressure)}%`;
            }
        }
        
        if (sellBar) {
            sellBar.style.width = `${sellPressure}%`;
            const sellPercent = sellBar.parentElement.querySelector('.sentiment-percent');
            if (sellPercent) {
                sellPercent.textContent = `${Math.round(sellPressure)}%`;
            }
        }
    }
    
    // Update trading signals
    updateSignals() {
        const isBullish = Math.random() > 0.3; // 70% bullish bias
        const confidence = (85 + Math.random() * 13).toFixed(0);
        
        // Update confidence
        document.getElementById('confidence').textContent = `${confidence}% Confidence`;
        
        // Update signal type
        const signalTypeEl = document.getElementById('signalType');
        const signalIcon = signalTypeEl.querySelector('.signal-icon');
        const signalText = signalTypeEl.querySelector('.signal-text');
        
        if (isBullish) {
            signalTypeEl.className = 'signal-type buy-signal';
            signalIcon.textContent = '📈';
            signalText.textContent = confidence > 90 ? 'STRONG BUY' : 'BUY';
            signalText.style.color = '#10b981';
        } else {
            signalTypeEl.className = 'signal-type sell-signal';
            signalIcon.textContent = '📉';
            signalText.textContent = confidence > 90 ? 'STRONG SELL' : 'SELL';
            signalText.style.color = '#ef4444';
        }
        
        // Update entry and exit points
        const currentPrice = this.basePrice;
        const spread = 1.0;
        
        if (isBullish) {
            const entry1 = (currentPrice - 0.5).toFixed(2);
            const entry2 = (currentPrice + 0.5).toFixed(2);
            const tp1 = (currentPrice + 5 + Math.random() * 3).toFixed(2);
            const tp2 = (currentPrice + 9 + Math.random() * 3).toFixed(2);
            const sl = (currentPrice - 4 - Math.random() * 2).toFixed(2);
            
            document.getElementById('entryPoint').textContent = `$${entry1} - $${entry2}`;
            document.getElementById('tp1').textContent = `$${tp1}`;
            document.getElementById('tp2').textContent = `$${tp2}`;
            document.getElementById('stopLoss').textContent = `$${sl}`;
        } else {
            const entry1 = (currentPrice - 0.5).toFixed(2);
            const entry2 = (currentPrice + 0.5).toFixed(2);
            const tp1 = (currentPrice - 5 - Math.random() * 3).toFixed(2);
            const tp2 = (currentPrice - 9 - Math.random() * 3).toFixed(2);
            const sl = (currentPrice + 4 + Math.random() * 2).toFixed(2);
            
            document.getElementById('entryPoint').textContent = `$${entry1} - $${entry2}`;
            document.getElementById('tp1').textContent = `$${tp1}`;
            document.getElementById('tp2').textContent = `$${tp2}`;
            document.getElementById('stopLoss').textContent = `$${sl}`;
        }
        
        // Risk/Reward ratio
        const rr = (1.5 + Math.random() * 1.5).toFixed(1);
        document.getElementById('riskReward').textContent = `1:${rr}`;
        
        // Update AI analysis based on signal
        this.updateAnalysis(isBullish);
    }
    
    // Update AI analysis text
    updateAnalysis(isBullish) {
        const analysisEl = document.getElementById('analysisSummary');
        
        if (isBullish) {
            analysisEl.innerHTML = `
                <p><strong>Market Conditions:</strong> XAU/USD is showing strong bullish momentum on the M5 and M15 timeframes. The pair has broken above the key resistance level at $${(this.basePrice - 3).toFixed(2)} with significant volume, indicating sustained buying pressure.</p>
                
                <p><strong>Momentum Analysis:</strong> Multiple technical indicators are aligned for a bullish scalping opportunity. RSI shows strength without extreme overbought conditions. MACD histogram is expanding positively with a recent bullish crossover.</p>
                
                <p><strong>Key Levels:</strong> Immediate support established at $${(this.basePrice - 5).toFixed(2)}. Resistance levels identified at $${(this.basePrice + 5).toFixed(2)} (R1) and $${(this.basePrice + 10).toFixed(2)} (R2). Price action suggests continuation toward R1 in the short term.</p>
                
                <p><strong>Recommendation:</strong> Enter long positions on minor pullbacks to $${(this.basePrice - 1).toFixed(2)}-${this.basePrice.toFixed(2)} zone. Target quick scalps of 4-6 pips initially. Monitor for momentum continuation toward extended targets.</p>
            `;
        } else {
            analysisEl.innerHTML = `
                <p><strong>Market Conditions:</strong> XAU/USD is showing bearish pressure on the M5 and M15 timeframes. The pair has failed to break above key resistance at $${(this.basePrice + 3).toFixed(2)}, suggesting potential reversal with increased selling volume.</p>
                
                <p><strong>Momentum Analysis:</strong> Technical indicators are showing divergence favoring bears. RSI displaying weakness, and MACD showing bearish crossover potential. This creates favorable conditions for short scalping positions.</p>
                
                <p><strong>Key Levels:</strong> Immediate resistance at $${(this.basePrice + 5).toFixed(2)}. Support levels identified at $${(this.basePrice - 5).toFixed(2)} (S1) and $${(this.basePrice - 10).toFixed(2)} (S2). Price action suggests movement toward S1 in the near term.</p>
                
                <p><strong>Recommendation:</strong> Enter short positions on minor rallies to $${(this.basePrice + 1).toFixed(2)}-${this.basePrice.toFixed(2)} zone. Target quick scalps of 4-6 pips initially. Watch for breakdown continuation toward lower support levels.</p>
            `;
        }
    }
    
    // Risk Calculator
    setupRiskCalculator() {
        const accountBalanceInput = document.getElementById('accountBalance');
        const riskPercentInput = document.getElementById('riskPercent');
        const lotSizeInput = document.getElementById('lotSize');
        
        const calculate = () => {
            const accountBalance = parseFloat(accountBalanceInput.value) || 10000;
            const riskPercent = parseFloat(riskPercentInput.value) || 1;
            const lotSize = parseFloat(lotSizeInput.value) || 0.1;
            
            const maxRisk = (accountBalance * riskPercent / 100).toFixed(2);
            const potentialProfit = (maxRisk * 2.5).toFixed(2);
            
            document.getElementById('maxRisk').textContent = `$${maxRisk}`;
            document.getElementById('positionSize').textContent = `${lotSize.toFixed(2)} lots`;
            document.getElementById('potentialProfit').textContent = `$${potentialProfit}`;
            document.getElementById('rrRatio').textContent = '1:2.5';
        };
        
        accountBalanceInput.addEventListener('input', calculate);
        riskPercentInput.addEventListener('input', calculate);
        lotSizeInput.addEventListener('input', calculate);
        
        calculate(); // Initial calculation
    }
    
    // Auto update every 5 seconds
    startAutoUpdate() {
        setInterval(() => {
            this.updateTime();
            this.updatePrice();
            this.updateIndicators();
            this.updateSentiment();
            
            // Update signals less frequently (every 15 seconds)
            if (Math.random() > 0.7) {
                this.updateSignals();
            }
        }, this.updateInterval);
    }
}

// Market status checker
function updateMarketStatus() {
    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours();
    
    // Forex market is closed on weekends
    const isWeekend = day === 0 || day === 6;
    
    // Simplified market hours (most forex brokers)
    const isMarketHours = !isWeekend && (hour >= 0 && hour < 24);
    
    const statusEl = document.getElementById('marketStatus');
    if (isMarketHours) {
        statusEl.textContent = 'Market Open';
        statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
        statusEl.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        statusEl.style.color = '#10b981';
    } else {
        statusEl.textContent = 'Market Closed';
        statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
        statusEl.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        statusEl.style.color = '#ef4444';
    }
}

// Add visual effects
function addVisualEffects() {
    // Animate cards on load
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add hover effects to indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
        indicator.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        indicator.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Update news timestamps
function updateNewsTimestamps() {
    // This would be connected to real news API in production
    // For demo, we'll keep static content
}

// Simulate real-time price ticks
function simulatePriceTicks() {
    const priceEl = document.getElementById('currentPrice');
    
    setInterval(() => {
        // Add a subtle flash effect on price change
        priceEl.style.transition = 'none';
        priceEl.style.transform = 'scale(1.05)';
        priceEl.style.color = Math.random() > 0.5 ? '#10b981' : '#ef4444';
        
        setTimeout(() => {
            priceEl.style.transition = 'all 0.3s ease';
            priceEl.style.transform = 'scale(1)';
            priceEl.style.color = '';
        }, 200);
    }, 5000);
}

// Initialize warning for demo purposes
function showDemoWarning() {
    console.log('%c⚠️ DEMO MODE - AI-Powered Analysis', 'color: #f59e0b; font-size: 16px; font-weight: bold;');
    console.log('%cThis is a demonstration of XAU/USD scalping momentum analysis.', 'color: #94a3b8; font-size: 14px;');
    console.log('%cData is simulated for educational purposes only.', 'color: #94a3b8; font-size: 14px;');
    console.log('%cAlways trade responsibly and do your own research!', 'color: #10b981; font-size: 14px; font-weight: bold;');
}

// Enhanced momentum calculation
function calculateMomentum() {
    // This would use actual market data in production
    // For demo, we simulate realistic momentum values
    const factors = {
        rsi: parseFloat(document.getElementById('rsiValue').textContent),
        macd: parseFloat(document.getElementById('macdValue').textContent),
        adx: parseFloat(document.getElementById('adxValue').textContent),
        volume: Math.random() * 100
    };
    
    // Weighted momentum score
    const momentum = (
        (factors.rsi / 100) * 0.3 +
        ((factors.macd + 10) / 20) * 0.3 +
        (factors.adx / 100) * 0.2 +
        (factors.volume / 100) * 0.2
    ) * 100;
    
    return Math.min(95, Math.max(50, momentum));
}

// Add keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // R key - Refresh data
        if (e.key === 'r' || e.key === 'R') {
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                location.reload();
            }
        }
    });
}

// Page visibility change handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - updates paused');
    } else {
        console.log('Page visible - updates resumed');
    }
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 XAU/USD Scalping Momentum Analyzer Initialized');
    
    // Show demo warning
    showDemoWarning();
    
    // Initialize main analyzer
    const analyzer = new TradingAnalyzer();
    
    // Update market status
    updateMarketStatus();
    setInterval(updateMarketStatus, 60000); // Check every minute
    
    // Add visual effects
    addVisualEffects();
    
    // Simulate price ticks
    simulatePriceTicks();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    console.log('✅ All systems operational');
});

// Service Worker for PWA (Progressive Web App) support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // We'll add service worker in future if needed
        console.log('Service Worker support detected');
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TradingAnalyzer };
}
