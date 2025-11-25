// SMM Panel - JavaScript

// Configuration
const CONFIG = {
    adminUser: 'admin',
    adminPass: 'admin2024',
    appName: 'SMM Panel',
    version: '1.0.0'
};

// State
let currentUser = null;
let currentSection = 'dashboard';
let orders = [];
let services = [];
let users = [];

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');
const sidebar = document.getElementById('sidebar');
const navToggle = document.getElementById('navToggle');
const navItems = document.querySelectorAll('.nav-item');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hide');
    }, 1500);
    
    initializeApp();
    setupEventListeners();
    checkAuth();
    initPWA();
});

function initializeApp() {
    // Generate sample data
    generateSampleOrders();
    generateSampleServices();
    generateSampleUsers();
    
    // Update stats
    updateStats();
}

function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
    
    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Theme buttons
    const themeBtns = document.querySelectorAll('.theme-btn[data-theme]');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            setTheme(theme);
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Color buttons
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshData();
        });
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === CONFIG.adminUser && password === CONFIG.adminPass) {
        currentUser = {
            username: username,
            role: 'admin',
            loginTime: new Date()
        };
        
        sessionStorage.setItem('smmUser', JSON.stringify(currentUser));
        showDashboard();
    } else {
        showError('Invalid username or password!');
    }
}

function handleLogout() {
    currentUser = null;
    sessionStorage.removeItem('smmUser');
    loginPage.classList.add('active');
    dashboardPage.classList.remove('active');
    loginForm.reset();
}

function checkAuth() {
    const savedUser = sessionStorage.getItem('smmUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
}

function showDashboard() {
    loginPage.classList.remove('active');
    dashboardPage.classList.add('active');
    userDisplay.textContent = currentUser.username;
    
    // Render initial data
    renderRecentOrders();
    renderOrdersTable();
    renderServices();
    renderUsersTable();
}

function showError(message) {
    loginError.textContent = message;
    loginError.classList.add('show');
    setTimeout(() => {
        loginError.classList.remove('show');
    }, 3000);
}

function navigateTo(page) {
    // Update navigation
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // Update content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(page + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    currentSection = page;
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
}

function generateSampleOrders() {
    const services = [
        'Instagram Followers',
        'Facebook Likes',
        'YouTube Views',
        'Twitter Followers',
        'TikTok Likes'
    ];
    
    const statuses = ['pending', 'processing', 'completed', 'cancelled'];
    
    for (let i = 1; i <= 50; i++) {
        orders.push({
            id: 1000 + i,
            service: services[Math.floor(Math.random() * services.length)],
            link: 'https://instagram.com/user' + i,
            quantity: Math.floor(Math.random() * 5000) + 100,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            amount: (Math.random() * 50 + 5).toFixed(2),
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
}

function generateSampleServices() {
    services = [
        {
            id: 1,
            name: 'Instagram Followers',
            description: 'High quality Instagram followers',
            category: 'Instagram',
            price: 2.50,
            minOrder: 100,
            maxOrder: 10000,
            icon: 'fab fa-instagram'
        },
        {
            id: 2,
            name: 'Facebook Page Likes',
            description: 'Real Facebook page likes',
            category: 'Facebook',
            price: 3.00,
            minOrder: 100,
            maxOrder: 5000,
            icon: 'fab fa-facebook'
        },
        {
            id: 3,
            name: 'YouTube Views',
            description: 'Organic YouTube video views',
            category: 'YouTube',
            price: 1.50,
            minOrder: 1000,
            maxOrder: 100000,
            icon: 'fab fa-youtube'
        },
        {
            id: 4,
            name: 'Twitter Followers',
            description: 'Active Twitter followers',
            category: 'Twitter',
            price: 4.00,
            minOrder: 100,
            maxOrder: 5000,
            icon: 'fab fa-twitter'
        },
        {
            id: 5,
            name: 'TikTok Likes',
            description: 'Fast TikTok video likes',
            category: 'TikTok',
            price: 2.00,
            minOrder: 100,
            maxOrder: 10000,
            icon: 'fab fa-tiktok'
        },
        {
            id: 6,
            name: 'Instagram Likes',
            description: 'Instant Instagram post likes',
            category: 'Instagram',
            price: 1.00,
            minOrder: 100,
            maxOrder: 5000,
            icon: 'fab fa-instagram'
        }
    ];
}

function generateSampleUsers() {
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
    
    for (let i = 1; i <= 20; i++) {
        users.push({
            id: i,
            name: names[Math.floor(Math.random() * names.length)],
            email: 'user' + i + '@example.com',
            balance: (Math.random() * 500).toFixed(2),
            orders: Math.floor(Math.random() * 50) + 1,
            status: Math.random() > 0.2 ? 'active' : 'inactive',
            registered: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
}

function updateStats() {
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalUsersEl = document.getElementById('totalUsers');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalServicesEl = document.getElementById('totalServices');
    
    if (totalOrdersEl) {
        animateValue(totalOrdersEl, 0, orders.length, 1000);
    }
    if (totalUsersEl) {
        animateValue(totalUsersEl, 0, users.length * 100, 1000);
    }
    if (totalRevenueEl) {
        const revenue = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
        totalRevenueEl.textContent = '$' + revenue.toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
    if (totalServicesEl) {
        animateValue(totalServicesEl, 0, services.length, 1000);
    }
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function renderRecentOrders() {
    const recentOrdersEl = document.getElementById('recentOrders');
    if (!recentOrdersEl) return;
    
    const recent = orders.slice(0, 5);
    
    recentOrdersEl.innerHTML = recent.map(order => `
        <div class="order-item">
            <div class="order-icon">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="order-details">
                <h5>#${order.id} - ${order.service}</h5>
                <p>${new Date(order.date).toLocaleString()}</p>
            </div>
            <span class="badge badge-${getStatusClass(order.status)}">${order.status}</span>
        </div>
    `).join('');
}

function renderOrdersTable() {
    const ordersTableEl = document.getElementById('ordersTable');
    if (!ordersTableEl) return;
    
    ordersTableEl.innerHTML = orders.slice(0, 20).map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.service}</td>
            <td><a href="${order.link}" target="_blank">${truncate(order.link, 30)}</a></td>
            <td>${order.quantity.toLocaleString()}</td>
            <td><span class="badge badge-${getStatusClass(order.status)}">${order.status}</span></td>
            <td>$${order.amount}</td>
            <td>${formatDate(order.date)}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderServices() {
    const servicesGridEl = document.getElementById('servicesGrid');
    if (!servicesGridEl) return;
    
    servicesGridEl.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h4>${service.name}</h4>
            <p>${service.description}</p>
            <div class="service-price">$${service.price}</div>
            <p style="font-size: 0.75rem; color: var(--text-secondary);">
                Min: ${service.minOrder} | Max: ${service.maxOrder.toLocaleString()}
            </p>
            <button class="btn btn-primary btn-sm" style="width: 100%;">
                <i class="fas fa-shopping-cart"></i> Order Now
            </button>
        </div>
    `).join('');
}

function renderUsersTable() {
    const usersTableEl = document.getElementById('usersTable');
    if (!usersTableEl) return;
    
    usersTableEl.innerHTML = users.map(user => `
        <tr>
            <td>#${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>$${user.balance}</td>
            <td>${user.orders}</td>
            <td><span class="badge badge-${user.status === 'active' ? 'success' : 'danger'}">${user.status}</span></td>
            <td>${formatDate(user.registered)}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewUser(${user.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    const classes = {
        'pending': 'warning',
        'processing': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return classes[status] || 'info';
}

function truncate(str, length) {
    return str.length > length ? str.substring(0, length) + '...' : str;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function refreshData() {
    // Show loading animation
    const refreshBtn = document.getElementById('refreshBtn');
    const icon = refreshBtn.querySelector('i');
    icon.classList.add('fa-spin');
    
    // Simulate data refresh
    setTimeout(() => {
        updateStats();
        renderRecentOrders();
        renderOrdersTable();
        renderServices();
        renderUsersTable();
        icon.classList.remove('fa-spin');
        
        showNotification('Data refreshed successfully!', 'success');
    }, 1000);
}

function showNotification(message, type = 'info') {
    // Create toast notification element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--info)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        // Create a better UI for order details instead of alert
        showNotification(`Order #${order.id}: ${order.service} - ${order.status}`, 'info');
        // In a production app, this would open a modal with full details
    }
}

function viewUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        // Create a better UI for user details instead of alert
        showNotification(`User: ${user.name} - Balance: $${user.balance}`, 'info');
        // In a production app, this would open a modal with full details
    }
}

// PWA Installation
let deferredPrompt;

function initPWA() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is installed');
        return;
    }
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed');
        hideInstallPrompt();
    });
}

function showInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    const dismissBtn = document.getElementById('dismissInstall');
    
    if (installPrompt && deferredPrompt) {
        installPrompt.style.display = 'block';
        
        installBtn.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
            hideInstallPrompt();
        });
        
        dismissBtn.addEventListener('click', () => {
            hideInstallPrompt();
        });
    }
}

function hideInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}
