// ===============================================
// SMM Panel Premium - Main Application
// ===============================================

// Global State
let currentUser = null;
let selectedService = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
});

// Initialize Application
async function initializeApp() {
    try {
        // Initialize database
        await initDatabase();
        await seedDatabase();
        
        // Initialize splash screen
        await showSplashScreen();
        
        // Check for saved session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            if (currentUser.role === 'admin') {
                showPage('adminPage');
            } else {
                showPage('dashboardPage');
            }
            updateUserUI();
        }
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize particles
        createParticles();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('Error', 'Gagal memuat aplikasi', 'error');
    }
}

// Splash Screen
async function showSplashScreen() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const splashScreen = document.getElementById('splashScreen');
            const app = document.getElementById('app');
            
            splashScreen.classList.add('fade-out');
            app.classList.remove('hidden');
            
            setTimeout(() => {
                splashScreen.style.display = 'none';
                resolve();
            }, 500);
        }, 2500);
    });
}

// Create Particles
function createParticles() {
    const container = document.getElementById('splashParticles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Sidebar Navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
    
    // Notification Button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotificationPanel);
    }
    
    // Service Category Change
    const serviceCategory = document.getElementById('serviceCategory');
    if (serviceCategory) {
        serviceCategory.addEventListener('change', handleCategoryChange);
    }
    
    // Service Select Change
    const serviceSelect = document.getElementById('serviceSelect');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', handleServiceChange);
    }
    
    // Order Quantity Change
    const orderQuantity = document.getElementById('orderQuantity');
    if (orderQuantity) {
        orderQuantity.addEventListener('input', calculateOrderTotal);
    }
    
    // Submit Order
    const submitOrder = document.getElementById('submitOrder');
    if (submitOrder) {
        submitOrder.addEventListener('click', handleSubmitOrder);
    }
    
    // Submit Deposit
    const submitDeposit = document.getElementById('submitDeposit');
    if (submitDeposit) {
        submitDeposit.addEventListener('click', handleSubmitDeposit);
    }
    
    // Ticket Form
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', handleSubmitTicket);
    }
    
    // Order Filters
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', filterOrders);
    }
    
    const orderSearch = document.getElementById('orderSearch');
    if (orderSearch) {
        orderSearch.addEventListener('input', filterOrders);
    }
    
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('userMenu');
        const notificationPanel = document.getElementById('notificationPanel');
        
        if (userMenu && !e.target.closest('.user-avatar') && !e.target.closest('.user-menu')) {
            userMenu.classList.add('hidden');
        }
        
        if (notificationPanel && !e.target.closest('.notification-btn') && !e.target.closest('.notification-panel')) {
            notificationPanel.classList.add('hidden');
        }
    });
}

// Authentication Handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');
    
    try {
        const user = await UserDB.authenticate(username, password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            if (user.role === 'admin') {
                showPage('adminPage');
                initAdminDashboard();
            } else {
                showPage('dashboardPage');
                initUserDashboard();
            }
            
            updateUserUI();
            showToast('Berhasil', 'Selamat datang, ' + user.username + '!', 'success');
        } else {
            errorElement.textContent = 'Username atau password salah!';
            errorElement.classList.add('show');
            setTimeout(() => errorElement.classList.remove('show'), 3000);
        }
    } catch (error) {
        console.error('Login error:', error);
        errorElement.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        errorElement.classList.add('show');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const errorElement = document.getElementById('registerError');
    
    if (password !== confirmPassword) {
        errorElement.textContent = 'Password tidak cocok!';
        errorElement.classList.add('show');
        setTimeout(() => errorElement.classList.remove('show'), 3000);
        return;
    }
    
    if (password.length < 6) {
        errorElement.textContent = 'Password minimal 6 karakter!';
        errorElement.classList.add('show');
        setTimeout(() => errorElement.classList.remove('show'), 3000);
        return;
    }
    
    try {
        await UserDB.register({ username, email, password });
        showToast('Berhasil', 'Akun berhasil dibuat! Silakan login.', 'success');
        showPage('loginPage');
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.classList.add('show');
        setTimeout(() => errorElement.classList.remove('show'), 3000);
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('loginPage');
    showToast('Logout', 'Anda telah keluar dari sistem', 'info');
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Close sidebar on mobile
    closeSidebar();
    closeAdminSidebar();
}

function navigateTo(contentId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(contentId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === contentId) {
            item.classList.add('active');
        }
    });
    
    // Load content based on section
    if (contentId === 'servicesContent') {
        loadServiceCategories();
    } else if (contentId === 'ordersContent') {
        loadUserOrders();
    } else if (contentId === 'depositContent') {
        loadDepositHistory();
    } else if (contentId === 'ticketContent') {
        loadUserTickets();
    }
    
    closeSidebar();
}

// Sidebar Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    sidebar.classList.remove('active');
    menuToggle?.classList.remove('active');
}

function closeAdminSidebar() {
    const adminSidebar = document.getElementById('adminSidebar');
    adminSidebar?.classList.remove('active');
}

// User Menu
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('hidden');
}

function toggleAdminMenu() {
    const adminMenu = document.getElementById('adminMenu');
    adminMenu.classList.toggle('hidden');
}

// Update User UI
function updateUserUI() {
    if (!currentUser) return;
    
    // Update balance displays
    const balanceDisplays = ['userBalance'];
    balanceDisplays.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = formatCurrency(currentUser.balance);
        }
    });
    
    // Update username displays
    const usernameDisplays = ['menuUserName', 'sidebarUserName', 'welcomeUserName'];
    usernameDisplays.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = currentUser.username;
        }
    });
    
    // Update email displays
    const emailEl = document.getElementById('menuUserEmail');
    if (emailEl) {
        emailEl.textContent = currentUser.email;
    }
    
    // Update role displays
    const roleEl = document.getElementById('sidebarUserRole');
    if (roleEl) {
        roleEl.textContent = currentUser.role === 'admin' ? 'Admin' : 'Member';
    }
    
    // Update avatar
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=6366f1&color=fff`;
    document.querySelectorAll('#userAvatarImg, #menuAvatarImg, #sidebarAvatarImg').forEach(img => {
        if (img) img.src = avatarUrl;
    });
    
    // Update API key
    const apiKeyEl = document.getElementById('userApiKey');
    if (apiKeyEl && currentUser.apiKey) {
        apiKeyEl.dataset.key = currentUser.apiKey;
    }
}

// Initialize User Dashboard
async function initUserDashboard() {
    if (!currentUser) return;
    
    try {
        // Load user stats
        const orders = await UserDB.getOrders(currentUser.id);
        const completedOrders = orders.filter(o => o.status === 'completed');
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
        const totalSpent = orders.reduce((sum, o) => sum + (o.price || 0), 0);
        
        // Update stats
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('completedOrders').textContent = completedOrders.length;
        document.getElementById('pendingOrders').textContent = pendingOrders.length;
        document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
        
        // Load recent orders
        loadRecentOrders(orders.slice(-5).reverse());
        
        // Load notifications
        await loadNotifications();
        
    } catch (error) {
        console.error('Failed to init dashboard:', error);
    }
}

// Load Recent Orders
function loadRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Belum ada order</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.serviceName || 'N/A'}</td>
            <td>${order.quantity?.toLocaleString('id-ID') || 0}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${formatDate(order.createdAt)}</td>
        </tr>
    `).join('');
}

// Service Functions
async function loadServiceCategories() {
    try {
        const categories = await ServiceDB.getCategories();
        const categorySelect = document.getElementById('serviceCategory');
        
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>' +
                categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

async function handleCategoryChange(e) {
    const category = e.target.value;
    const serviceSelect = document.getElementById('serviceSelect');
    const serviceDetails = document.getElementById('serviceDetails');
    
    if (!category) {
        serviceSelect.innerHTML = '<option value="">-- Pilih Layanan --</option>';
        serviceSelect.disabled = true;
        serviceDetails.classList.add('hidden');
        return;
    }
    
    try {
        const services = await ServiceDB.getByCategory(category);
        const activeServices = services.filter(s => s.status === 'active');
        
        serviceSelect.innerHTML = '<option value="">-- Pilih Layanan --</option>' +
            activeServices.map(s => `<option value="${s.id}">${s.name} - ${formatCurrency(s.pricePerK)}/1K</option>`).join('');
        serviceSelect.disabled = false;
        serviceDetails.classList.add('hidden');
    } catch (error) {
        console.error('Failed to load services:', error);
    }
}

async function handleServiceChange(e) {
    const serviceId = parseInt(e.target.value);
    const serviceDetails = document.getElementById('serviceDetails');
    
    if (!serviceId) {
        serviceDetails.classList.add('hidden');
        selectedService = null;
        return;
    }
    
    try {
        selectedService = await Database.get(STORES.SERVICES, serviceId);
        
        if (selectedService) {
            document.getElementById('servicePrice').textContent = formatCurrency(selectedService.pricePerK) + '/1K';
            document.getElementById('serviceMin').textContent = selectedService.min.toLocaleString('id-ID');
            document.getElementById('serviceMax').textContent = selectedService.max.toLocaleString('id-ID');
            document.getElementById('serviceEstimate').textContent = selectedService.estimate;
            
            serviceDetails.classList.remove('hidden');
            calculateOrderTotal();
        }
    } catch (error) {
        console.error('Failed to load service:', error);
    }
}

function calculateOrderTotal() {
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 0;
    const orderTotal = document.getElementById('orderTotal');
    
    if (selectedService && quantity > 0) {
        const total = Math.ceil((quantity / 1000) * selectedService.pricePerK);
        orderTotal.textContent = formatCurrency(total);
    } else {
        orderTotal.textContent = formatCurrency(0);
    }
}

async function handleSubmitOrder() {
    if (!currentUser) {
        showToast('Error', 'Silakan login terlebih dahulu', 'error');
        return;
    }
    
    if (!selectedService) {
        showToast('Error', 'Pilih layanan terlebih dahulu', 'error');
        return;
    }
    
    const link = document.getElementById('targetLink').value.trim();
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 0;
    
    if (!link) {
        showToast('Error', 'Masukkan link target', 'error');
        return;
    }
    
    if (quantity < selectedService.min || quantity > selectedService.max) {
        showToast('Error', `Jumlah harus antara ${selectedService.min} - ${selectedService.max}`, 'error');
        return;
    }
    
    const totalPrice = Math.ceil((quantity / 1000) * selectedService.pricePerK);
    
    if (currentUser.balance < totalPrice) {
        showToast('Error', 'Saldo tidak mencukupi. Silakan deposit terlebih dahulu.', 'error');
        return;
    }
    
    try {
        // Create order
        const orderId = await OrderDB.create({
            userId: currentUser.id,
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            category: selectedService.category,
            quantity: quantity,
            price: totalPrice,
            link: link,
            status: 'pending',
            startCount: 0,
            remains: quantity
        });
        
        // Deduct balance
        await UserDB.updateBalance(currentUser.id, -totalPrice);
        currentUser.balance -= totalPrice;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserUI();
        
        // Reset form
        document.getElementById('targetLink').value = '';
        document.getElementById('orderQuantity').value = '';
        document.getElementById('orderTotal').textContent = formatCurrency(0);
        
        showToast('Berhasil', `Order #${orderId} berhasil dibuat!`, 'success');
        
        // Add notification
        await Database.add(STORES.NOTIFICATIONS, {
            userId: currentUser.id,
            title: 'Order Dibuat',
            message: `Order #${orderId} ${selectedService.name} sedang diproses`,
            type: 'info',
            read: false
        });
        
        // Refresh dashboard
        initUserDashboard();
        
    } catch (error) {
        console.error('Failed to submit order:', error);
        showToast('Error', 'Gagal membuat order. Silakan coba lagi.', 'error');
    }
}

// User Orders
async function loadUserOrders() {
    if (!currentUser) return;
    
    try {
        const orders = await UserDB.getOrders(currentUser.id);
        renderOrdersList(orders.reverse());
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

function renderOrdersList(orders) {
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state-large">
                <i class="fas fa-inbox"></i>
                <h3>Belum Ada Order</h3>
                <p>Mulai order layanan SMM sekarang!</p>
                <button class="btn btn-primary" onclick="navigateTo('servicesContent')">
                    <i class="fas fa-shopping-cart"></i> Order Sekarang
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">#${order.id}</span>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
            <div class="order-body">
                <div class="order-detail">
                    <span>Layanan</span>
                    <span>${order.serviceName}</span>
                </div>
                <div class="order-detail">
                    <span>Jumlah</span>
                    <span>${order.quantity?.toLocaleString('id-ID')}</span>
                </div>
                <div class="order-detail">
                    <span>Harga</span>
                    <span>${formatCurrency(order.price)}</span>
                </div>
                <div class="order-detail">
                    <span>Sisa</span>
                    <span>${order.remains?.toLocaleString('id-ID')}</span>
                </div>
                <div class="order-detail">
                    <span>Link</span>
                    <span class="order-link">${truncateText(order.link, 30)}</span>
                </div>
                <div class="order-detail">
                    <span>Tanggal</span>
                    <span>${formatDate(order.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

async function filterOrders() {
    if (!currentUser) return;
    
    const status = document.getElementById('orderStatusFilter').value;
    const search = document.getElementById('orderSearch').value.toLowerCase();
    
    try {
        let orders = await UserDB.getOrders(currentUser.id);
        
        if (status) {
            orders = orders.filter(o => o.status === status);
        }
        
        if (search) {
            orders = orders.filter(o => 
                o.serviceName?.toLowerCase().includes(search) ||
                o.link?.toLowerCase().includes(search) ||
                o.id?.toString().includes(search)
            );
        }
        
        renderOrdersList(orders.reverse());
    } catch (error) {
        console.error('Failed to filter orders:', error);
    }
}

// Deposit Functions
function setDepositAmount(amount) {
    document.getElementById('depositAmount').value = amount;
}

async function handleSubmitDeposit() {
    if (!currentUser) {
        showToast('Error', 'Silakan login terlebih dahulu', 'error');
        return;
    }
    
    const amount = parseInt(document.getElementById('depositAmount').value) || 0;
    const method = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (amount < 10000) {
        showToast('Error', 'Minimal deposit Rp 10.000', 'error');
        return;
    }
    
    try {
        const depositId = await DepositDB.create({
            userId: currentUser.id,
            amount: amount,
            method: method,
            status: 'pending'
        });
        
        // Simulate auto-approval for demo
        setTimeout(async () => {
            await DepositDB.approve(depositId);
            
            // Update current user balance
            currentUser.balance += amount;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserUI();
            
            showToast('Deposit Berhasil', `Deposit ${formatCurrency(amount)} telah dikonfirmasi!`, 'success');
            
            // Add notification
            await Database.add(STORES.NOTIFICATIONS, {
                userId: currentUser.id,
                title: 'Deposit Berhasil',
                message: `Deposit ${formatCurrency(amount)} telah masuk ke saldo Anda`,
                type: 'success',
                read: false
            });
            
            loadDepositHistory();
            loadNotifications();
        }, 2000);
        
        showToast('Proses', 'Deposit sedang diproses...', 'info');
        document.getElementById('depositAmount').value = '';
        
        loadDepositHistory();
        
    } catch (error) {
        console.error('Failed to submit deposit:', error);
        showToast('Error', 'Gagal membuat deposit. Silakan coba lagi.', 'error');
    }
}

async function loadDepositHistory() {
    if (!currentUser) return;
    
    try {
        const deposits = await UserDB.getDeposits(currentUser.id);
        const container = document.getElementById('depositHistoryList');
        
        if (!container) return;
        
        if (deposits.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wallet"></i>
                    <p>Belum ada riwayat deposit</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = deposits.reverse().map(deposit => `
            <div class="deposit-item">
                <div class="deposit-info">
                    <span class="deposit-amount">+${formatCurrency(deposit.amount)}</span>
                    <span class="deposit-meta">${getPaymentMethodName(deposit.method)} • ${formatDate(deposit.createdAt)}</span>
                </div>
                <span class="status-badge status-${deposit.status}">${deposit.status}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load deposit history:', error);
    }
}

function getPaymentMethodName(method) {
    const methods = {
        'bank_transfer': 'Bank Transfer',
        'ewallet': 'E-Wallet',
        'qris': 'QRIS'
    };
    return methods[method] || method;
}

// Ticket Functions
async function handleSubmitTicket(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showToast('Error', 'Silakan login terlebih dahulu', 'error');
        return;
    }
    
    const subject = document.getElementById('ticketSubject').value.trim();
    const priority = document.getElementById('ticketPriority').value;
    const message = document.getElementById('ticketMessage').value.trim();
    
    if (!subject || !message) {
        showToast('Error', 'Lengkapi semua field', 'error');
        return;
    }
    
    try {
        const ticketId = await TicketDB.create({
            userId: currentUser.id,
            subject: subject,
            priority: priority,
            message: message
        });
        
        showToast('Berhasil', `Tiket #${ticketId} berhasil dibuat!`, 'success');
        
        // Reset form
        document.getElementById('ticketSubject').value = '';
        document.getElementById('ticketMessage').value = '';
        
        loadUserTickets();
        
    } catch (error) {
        console.error('Failed to submit ticket:', error);
        showToast('Error', 'Gagal membuat tiket. Silakan coba lagi.', 'error');
    }
}

async function loadUserTickets() {
    if (!currentUser) return;
    
    try {
        const tickets = await UserDB.getTickets(currentUser.id);
        const container = document.getElementById('userTicketsList');
        
        if (!container) return;
        
        if (tickets.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <p>Belum ada tiket support</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = tickets.reverse().map(ticket => `
            <div class="ticket-item">
                <div class="ticket-header">
                    <span class="ticket-subject">${ticket.subject}</span>
                    <span class="priority-badge priority-${ticket.priority}">${ticket.priority}</span>
                </div>
                <p class="ticket-preview">${truncateText(ticket.message, 100)}</p>
                <div class="ticket-footer">
                    <span class="ticket-date">${formatDate(ticket.createdAt)}</span>
                    <span class="status-badge status-${ticket.status === 'open' ? 'pending' : 'completed'}">${ticket.status}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load tickets:', error);
    }
}

// Notification Functions
function toggleNotificationPanel() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('hidden');
}

async function loadNotifications() {
    if (!currentUser) return;
    
    try {
        const notifications = await UserDB.getNotifications(currentUser.id);
        const unreadCount = notifications.filter(n => !n.read).length;
        
        // Update badge
        const badge = document.getElementById('notifBadge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        
        // Render notifications
        const container = document.getElementById('notificationsList');
        if (container) {
            if (notifications.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-bell"></i>
                        <p>Tidak ada notifikasi</p>
                    </div>
                `;
            } else {
                container.innerHTML = notifications.reverse().map(notif => `
                    <div class="notification-item ${notif.read ? '' : 'unread'}">
                        <div class="notification-icon ${getNotificationColor(notif.type)}">
                            <i class="${getNotificationIcon(notif.type)}"></i>
                        </div>
                        <div class="notification-content">
                            <h4>${notif.title}</h4>
                            <p>${notif.message}</p>
                            <span class="notification-time">${formatDate(notif.createdAt)}</span>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Failed to load notifications:', error);
    }
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fas fa-check',
        'error': 'fas fa-times',
        'warning': 'fas fa-exclamation',
        'info': 'fas fa-info'
    };
    return icons[type] || 'fas fa-bell';
}

function getNotificationColor(type) {
    const colors = {
        'success': 'gradient-green',
        'error': 'gradient-red',
        'warning': 'gradient-yellow',
        'info': 'gradient-blue'
    };
    return colors[type] || 'gradient-blue';
}

async function markAllNotificationsRead() {
    if (!currentUser) return;
    
    try {
        const notifications = await UserDB.getNotifications(currentUser.id);
        
        for (const notif of notifications) {
            if (!notif.read) {
                notif.read = true;
                await Database.update(STORES.NOTIFICATIONS, notif);
            }
        }
        
        loadNotifications();
        showToast('Berhasil', 'Semua notifikasi ditandai sudah dibaca', 'success');
    } catch (error) {
        console.error('Failed to mark notifications:', error);
    }
}

// API Key Functions
function toggleApiKey() {
    const apiKeyEl = document.getElementById('userApiKey');
    if (apiKeyEl.textContent === '••••••••••••••••') {
        apiKeyEl.textContent = apiKeyEl.dataset.key || currentUser?.apiKey || 'N/A';
    } else {
        apiKeyEl.textContent = '••••••••••••••••';
    }
}

function copyApiKey() {
    const key = currentUser?.apiKey || '';
    navigator.clipboard.writeText(key).then(() => {
        showToast('Copied!', 'API Key berhasil disalin', 'success');
    });
}

async function regenerateApiKey() {
    if (!currentUser) return;
    
    if (!confirm('Apakah Anda yakin ingin regenerate API Key? Key lama tidak akan berlaku lagi.')) {
        return;
    }
    
    try {
        const newKey = generateApiKey();
        currentUser.apiKey = newKey;
        await Database.update(STORES.USERS, currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        const apiKeyEl = document.getElementById('userApiKey');
        if (apiKeyEl) {
            apiKeyEl.dataset.key = newKey;
            apiKeyEl.textContent = '••••••••••••••••';
        }
        
        showToast('Berhasil', 'API Key berhasil di-regenerate', 'success');
    } catch (error) {
        console.error('Failed to regenerate API key:', error);
        showToast('Error', 'Gagal regenerate API Key', 'error');
    }
}

// Password Toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Modal Functions
function showModal(content) {
    const overlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = content;
    overlay.classList.remove('hidden');
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('hidden');
}

// Toast Notifications
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check',
        error: 'fas fa-times',
        warning: 'fas fa-exclamation',
        info: 'fas fa-info'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Utility Functions
function formatCurrency(amount) {
    return 'Rp ' + (amount || 0).toLocaleString('id-ID');
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function truncateText(text, maxLength) {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Export functions for global access
window.showPage = showPage;
window.navigateTo = navigateTo;
window.handleLogout = handleLogout;
window.toggleUserMenu = toggleUserMenu;
window.toggleAdminMenu = toggleAdminMenu;
window.togglePassword = togglePassword;
window.setDepositAmount = setDepositAmount;
window.toggleApiKey = toggleApiKey;
window.copyApiKey = copyApiKey;
window.regenerateApiKey = regenerateApiKey;
window.markAllNotificationsRead = markAllNotificationsRead;
window.showModal = showModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.closeSidebar = closeSidebar;
window.closeAdminSidebar = closeAdminSidebar;
window.initUserDashboard = initUserDashboard;
window.currentUser = currentUser;
