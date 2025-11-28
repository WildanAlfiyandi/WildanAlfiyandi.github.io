// ===============================================
// SMM Panel Premium - Real-time Features
// ===============================================

// Configuration constants
const REALTIME_CONFIG = {
    UPDATE_INTERVAL: 30000,         // Real-time update interval (30 seconds)
    ORDER_PROCESSING_INTERVAL: 10000, // Order processing check interval (10 seconds)
    EVENT_SIMULATION_INTERVAL: 15000, // WebSocket event simulation interval (15 seconds)
    PROCESSING_START_CHANCE: 0.3,   // Chance for pending order to start processing (30%)
    PROGRESS_INCREMENT_MAX: 200,    // Max progress increment per processing cycle
    EVENT_TRIGGER_CHANCE: 0.1,      // Chance for simulated event (10%)
    START_COUNT_MAX: 1000           // Max random start count
};

// Real-time simulation interval
let realtimeInterval = null;
let orderProcessingInterval = null;

// Initialize real-time features
function initRealtime() {
    // Start real-time updates
    startRealtimeUpdates();
    
    // Start order processing simulation
    startOrderProcessing();
    
    // Initialize WebSocket simulation (for demo)
    initWebSocketSimulation();
}

// Start Real-time Updates
function startRealtimeUpdates() {
    // Update every configured interval
    realtimeInterval = setInterval(async () => {
        await updateRealtimeData();
    }, REALTIME_CONFIG.UPDATE_INTERVAL);
    
    // Initial update
    updateRealtimeData();
}

// Update Real-time Data
async function updateRealtimeData() {
    try {
        // Update stats if on dashboard
        if (currentUser) {
            if (currentUser.role === 'admin') {
                await updateAdminRealtimeStats();
            } else {
                await updateUserRealtimeStats();
            }
        }
    } catch (error) {
        console.error('Real-time update error:', error);
    }
}

// Update Admin Real-time Stats
async function updateAdminRealtimeStats() {
    try {
        const users = await Database.getAll(STORES.USERS);
        const orders = await Database.getAll(STORES.ORDERS);
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
        const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
        
        // Animate counter updates
        animateCounter('adminStatUsers', users.length);
        animateCounter('adminStatOrders', orders.length);
        animateCounter('adminStatPending', pendingOrders.length);
        
        // Update nav stats
        const navUsers = document.getElementById('adminTotalUsers');
        const navOrders = document.getElementById('adminTotalOrders');
        if (navUsers) navUsers.textContent = users.length;
        if (navOrders) navOrders.textContent = orders.length;
        
        // Update revenue with animation
        const revenueEl = document.getElementById('adminStatRevenue');
        if (revenueEl) {
            revenueEl.textContent = formatCurrency(totalRevenue);
        }
    } catch (error) {
        console.error('Admin stats update error:', error);
    }
}

// Update User Real-time Stats
async function updateUserRealtimeStats() {
    if (!currentUser) return;
    
    try {
        // Reload user data
        const user = await Database.get(STORES.USERS, currentUser.id);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUserUI();
        }
        
        // Update order stats
        const orders = await UserDB.getOrders(currentUser.id);
        const completedOrders = orders.filter(o => o.status === 'completed');
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
        const totalSpent = orders.reduce((sum, o) => sum + (o.price || 0), 0);
        
        animateCounter('totalOrders', orders.length);
        animateCounter('completedOrders', completedOrders.length);
        animateCounter('pendingOrders', pendingOrders.length);
        
        // Update notifications
        await loadNotifications();
    } catch (error) {
        console.error('User stats update error:', error);
    }
}

// Animate Counter
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
    
    if (currentValue === targetValue) return;
    
    const duration = 500;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const value = Math.floor(currentValue + (targetValue - currentValue) * easeOutQuart);
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Order Processing Simulation
function startOrderProcessing() {
    // Process orders at configured interval
    orderProcessingInterval = setInterval(async () => {
        await processOrders();
    }, REALTIME_CONFIG.ORDER_PROCESSING_INTERVAL);
}

// Process Orders (Simulation)
async function processOrders() {
    try {
        const orders = await Database.getAll(STORES.ORDERS);
        
        for (const order of orders) {
            if (order.status === 'pending') {
                // Chance to start processing based on config
                if (Math.random() < REALTIME_CONFIG.PROCESSING_START_CHANCE) {
                    order.status = 'processing';
                    order.startCount = Math.floor(Math.random() * REALTIME_CONFIG.START_COUNT_MAX);
                    await Database.update(STORES.ORDERS, order);
                    
                    // Notify user
                    if (order.userId === currentUser?.id) {
                        showToast('Order Update', `Order #${order.id} sedang diproses`, 'info');
                    }
                    
                    // Add activity
                    await Database.add(STORES.ACTIVITIES, {
                        type: 'order',
                        icon: 'fas fa-cog',
                        title: 'Order mulai diproses',
                        description: `Order #${order.id} - ${order.serviceName}`,
                        color: 'gradient-blue'
                    });
                }
            } else if (order.status === 'processing') {
                // Simulate progress
                const progress = Math.floor(Math.random() * REALTIME_CONFIG.PROGRESS_INCREMENT_MAX);
                order.remains = Math.max(0, (order.remains || order.quantity) - progress);
                
                if (order.remains <= 0) {
                    order.status = 'completed';
                    order.remains = 0;
                    
                    // Notify user
                    if (order.userId === currentUser?.id) {
                        showToast('Order Selesai', `Order #${order.id} telah selesai!`, 'success');
                        
                        // Add notification
                        await Database.add(STORES.NOTIFICATIONS, {
                            userId: order.userId,
                            title: 'Order Selesai',
                            message: `Order #${order.id} ${order.serviceName} telah selesai`,
                            type: 'success',
                            read: false
                        });
                    }
                    
                    // Add activity
                    await Database.add(STORES.ACTIVITIES, {
                        type: 'order',
                        icon: 'fas fa-check-circle',
                        title: 'Order selesai',
                        description: `Order #${order.id} - ${order.serviceName}`,
                        color: 'gradient-green'
                    });
                }
                
                await Database.update(STORES.ORDERS, order);
            }
        }
        
        // Refresh UI if needed
        if (currentUser?.role === 'admin') {
            // Refresh admin activity feed
            loadAdminActivity();
        }
    } catch (error) {
        console.error('Order processing error:', error);
    }
}

// WebSocket Simulation (for demo purposes)
function initWebSocketSimulation() {
    // Simulate incoming events at configured interval
    setInterval(() => {
        if (Math.random() < REALTIME_CONFIG.EVENT_TRIGGER_CHANCE) {
            simulateIncomingEvent();
        }
    }, REALTIME_CONFIG.EVENT_SIMULATION_INTERVAL);
}

// Simulate Incoming Event
function simulateIncomingEvent() {
    const events = [
        {
            type: 'new_user',
            handler: () => {
                if (currentUser?.role === 'admin') {
                    addActivityItem({
                        icon: 'fas fa-user-plus',
                        title: 'User baru mendaftar',
                        description: 'newuser' + Math.floor(Math.random() * 1000) + '@email.com',
                        color: 'gradient-purple'
                    });
                }
            }
        },
        {
            type: 'new_order',
            handler: () => {
                if (currentUser?.role === 'admin') {
                    const services = ['Instagram Followers', 'YouTube Views', 'TikTok Likes', 'Twitter Followers'];
                    addActivityItem({
                        icon: 'fas fa-shopping-cart',
                        title: 'Order baru masuk',
                        description: services[Math.floor(Math.random() * services.length)],
                        color: 'gradient-blue'
                    });
                }
            }
        },
        {
            type: 'new_deposit',
            handler: () => {
                if (currentUser?.role === 'admin') {
                    const amounts = [50000, 100000, 250000, 500000];
                    addActivityItem({
                        icon: 'fas fa-money-bill-wave',
                        title: 'Deposit baru',
                        description: formatCurrency(amounts[Math.floor(Math.random() * amounts.length)]),
                        color: 'gradient-green'
                    });
                }
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event.handler();
}

// Add Activity Item (with animation)
function addActivityItem(activity) {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.style.animation = 'slideIn 0.3s ease';
    
    item.innerHTML = `
        <div class="activity-icon ${activity.color}">
            <i class="${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
        </div>
        <span class="activity-time">Baru saja</span>
    `;
    
    // Insert at the beginning
    if (feed.firstChild) {
        feed.insertBefore(item, feed.firstChild);
    } else {
        feed.appendChild(item);
    }
    
    // Remove old items if more than 10
    while (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
    
    // Save to database
    Database.add(STORES.ACTIVITIES, {
        ...activity,
        createdAt: new Date().toISOString()
    }).catch(console.error);
}

// Live Notification System
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.subscribers = [];
    }
    
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }
    
    notify(notification) {
        this.notifications.push(notification);
        this.subscribers.forEach(callback => callback(notification));
    }
    
    async push(userId, notification) {
        // Save to database
        await Database.add(STORES.NOTIFICATIONS, {
            userId,
            ...notification,
            read: false
        });
        
        // Notify if current user
        if (currentUser && currentUser.id === userId) {
            this.notify(notification);
            showToast(notification.title, notification.message, notification.type || 'info');
            loadNotifications();
        }
    }
}

const notificationManager = new NotificationManager();

// Real-time Balance Updates
async function checkBalanceUpdates() {
    if (!currentUser) return;
    
    try {
        const user = await Database.get(STORES.USERS, currentUser.id);
        if (user && user.balance !== currentUser.balance) {
            const diff = user.balance - currentUser.balance;
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUserUI();
            
            if (diff > 0) {
                showToast('Saldo Bertambah', `+${formatCurrency(diff)}`, 'success');
            } else {
                showToast('Saldo Berkurang', formatCurrency(diff), 'info');
            }
        }
    } catch (error) {
        console.error('Balance check error:', error);
    }
}

// Check balance every 5 seconds
setInterval(checkBalanceUpdates, 5000);

// Typing Indicator Simulation
function showTypingIndicator(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const dots = document.createElement('span');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    element.appendChild(dots);
    
    return () => dots.remove();
}

// Online Status Simulation
function updateOnlineStatus() {
    const indicators = document.querySelectorAll('.status-indicator.online');
    indicators.forEach(indicator => {
        // Randomly toggle some users offline/online
        if (Math.random() < 0.1) {
            indicator.classList.toggle('online');
            indicator.classList.toggle('offline');
        }
    });
}

setInterval(updateOnlineStatus, 30000);

// Progress Animation
function animateProgress(elementId, targetPercent) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = targetPercent / 50;
    
    const animation = setInterval(() => {
        current += increment;
        if (current >= targetPercent) {
            current = targetPercent;
            clearInterval(animation);
        }
        element.style.width = current + '%';
    }, 20);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (realtimeInterval) clearInterval(realtimeInterval);
    if (orderProcessingInterval) clearInterval(orderProcessingInterval);
});

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for app initialization
    setTimeout(initRealtime, 3000);
});

// Export for global access
window.initRealtime = initRealtime;
window.notificationManager = notificationManager;
window.animateCounter = animateCounter;
window.animateProgress = animateProgress;
