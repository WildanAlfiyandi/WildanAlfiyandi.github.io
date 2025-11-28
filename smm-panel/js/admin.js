// ===============================================
// SMM Panel Premium - Admin Panel
// ===============================================

// Admin Dashboard Initialization
async function initAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    try {
        await loadAdminStats();
        await loadAdminActivity();
        initAdminCharts();
        setupAdminEventListeners();
        updateCurrentDate();
    } catch (error) {
        console.error('Failed to init admin dashboard:', error);
    }
}

// Setup Admin Event Listeners
function setupAdminEventListeners() {
    // Admin Menu Toggle
    const adminMenuToggle = document.getElementById('adminMenuToggle');
    if (adminMenuToggle) {
        adminMenuToggle.addEventListener('click', toggleAdminSidebar);
    }
    
    // Admin Sidebar Navigation
    document.querySelectorAll('#adminSidebar .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateAdminTo(page);
        });
    });
    
    // User Search
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
    
    // User Role Filter
    const userRoleFilter = document.getElementById('userRoleFilter');
    if (userRoleFilter) {
        userRoleFilter.addEventListener('change', filterUsers);
    }
    
    // Admin Order Search
    const adminOrderSearch = document.getElementById('adminOrderSearch');
    if (adminOrderSearch) {
        adminOrderSearch.addEventListener('input', filterAdminOrders);
    }
    
    // Admin Order Status Filter
    const adminOrderStatus = document.getElementById('adminOrderStatus');
    if (adminOrderStatus) {
        adminOrderStatus.addEventListener('change', filterAdminOrders);
    }
}

// Toggle Admin Sidebar
function toggleAdminSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('active');
}

// Navigate Admin Sections
function navigateAdminTo(contentId) {
    // Hide all admin content sections
    document.querySelectorAll('#adminPage .content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(contentId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update sidebar active state
    document.querySelectorAll('#adminSidebar .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === contentId) {
            item.classList.add('active');
        }
    });
    
    // Load content based on section
    switch (contentId) {
        case 'adminUsers':
            loadAdminUsers();
            break;
        case 'adminOrders':
            loadAdminOrders();
            break;
        case 'adminServices':
            loadAdminServices();
            break;
        case 'adminDeposits':
            loadAdminDeposits();
            break;
        case 'adminTickets':
            loadAdminTickets();
            break;
    }
    
    closeAdminSidebar();
}

// Update Current Date
function updateCurrentDate() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Load Admin Stats
async function loadAdminStats() {
    try {
        const users = await Database.getAll(STORES.USERS);
        const orders = await Database.getAll(STORES.ORDERS);
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
        const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
        
        // Update stats display
        document.getElementById('adminStatUsers').textContent = users.length;
        document.getElementById('adminStatOrders').textContent = orders.length;
        document.getElementById('adminStatRevenue').textContent = formatCurrency(totalRevenue);
        document.getElementById('adminStatPending').textContent = pendingOrders.length;
        
        // Update nav stats
        document.getElementById('adminTotalUsers').textContent = users.length;
        document.getElementById('adminTotalOrders').textContent = orders.length;
    } catch (error) {
        console.error('Failed to load admin stats:', error);
    }
}

// Load Admin Activity Feed
async function loadAdminActivity() {
    try {
        const activities = await Database.getAll(STORES.ACTIVITIES);
        const container = document.getElementById('activityFeed');
        
        if (!container) return;
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-stream"></i>
                    <p>Belum ada aktivitas</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = activities.reverse().slice(0, 10).map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.color || 'gradient-blue'}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <span class="activity-time">${formatTimeAgo(activity.createdAt)}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load activity:', error);
    }
}

// Initialize Charts
function initAdminCharts() {
    initOrdersChart();
    initRevenueChart();
}

function initOrdersChart() {
    const ctx = document.getElementById('ordersChart');
    if (!ctx) return;
    
    // Sample data - in real app, this would come from database
    const data = {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [{
            label: 'Orders',
            data: [12, 19, 15, 25, 22, 30, 28],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        }
    });
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Facebook', 'Telegram'],
        datasets: [{
            data: [35, 25, 20, 10, 7, 3],
            backgroundColor: [
                '#E1306C',
                '#FF0000',
                '#000000',
                '#1DA1F2',
                '#1877F2',
                '#0088CC'
            ],
            borderWidth: 0
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Load Admin Users
async function loadAdminUsers() {
    try {
        const users = await Database.getAll(STORES.USERS);
        renderUsersTable(users);
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>Tidak ada user</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>#${user.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff" 
                         style="width: 32px; height: 32px; border-radius: 8px;">
                    ${user.username}
                </div>
            </td>
            <td>${user.email}</td>
            <td>${formatCurrency(user.balance)}</td>
            <td><span class="badge badge-${getRoleBadgeClass(user.role)}">${user.role}</span></td>
            <td><span class="status-badge status-${user.status === 'active' ? 'completed' : 'cancelled'}">${user.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editUser(${user.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn view" onclick="addBalanceModal(${user.id})" title="Add Balance">
                        <i class="fas fa-plus"></i>
                    </button>
                    ${user.role !== 'admin' ? `
                    <button class="action-btn delete" onclick="deleteUser(${user.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function getRoleBadgeClass(role) {
    const classes = {
        'admin': 'danger',
        'reseller': 'warning',
        'user': 'primary'
    };
    return classes[role] || 'primary';
}

async function filterUsers() {
    const search = document.getElementById('userSearch').value.toLowerCase();
    const role = document.getElementById('userRoleFilter').value;
    
    try {
        let users = await Database.getAll(STORES.USERS);
        
        if (search) {
            users = users.filter(u => 
                u.username?.toLowerCase().includes(search) ||
                u.email?.toLowerCase().includes(search)
            );
        }
        
        if (role) {
            users = users.filter(u => u.role === role);
        }
        
        renderUsersTable(users);
    } catch (error) {
        console.error('Failed to filter users:', error);
    }
}

// User Management Functions
function showAddUserModal() {
    const content = `
        <div class="modal-header">
            <h3><i class="fas fa-user-plus"></i> Add New User</h3>
            <button class="modal-close" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="addUserForm">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="newUserUsername" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="newUserEmail" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="newUserPassword" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select id="newUserRole" class="form-select">
                        <option value="user">User</option>
                        <option value="reseller">Reseller</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Initial Balance</label>
                    <input type="number" id="newUserBalance" class="form-input" value="0" min="0">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="submitAddUser()">
                <i class="fas fa-plus"></i> Add User
            </button>
        </div>
    `;
    
    showModal(content);
}

async function submitAddUser() {
    const username = document.getElementById('newUserUsername').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    const balance = parseInt(document.getElementById('newUserBalance').value) || 0;
    
    if (!username || !email || !password) {
        showToast('Error', 'Lengkapi semua field', 'error');
        return;
    }
    
    try {
        await Database.add(STORES.USERS, {
            username,
            email,
            password,
            role,
            balance,
            apiKey: generateApiKey(),
            status: 'active'
        });
        
        showToast('Berhasil', 'User berhasil ditambahkan', 'success');
        closeModal();
        loadAdminUsers();
        loadAdminStats();
        
        // Add activity
        await Database.add(STORES.ACTIVITIES, {
            type: 'user',
            icon: 'fas fa-user-plus',
            title: 'User baru ditambahkan',
            description: `Admin menambahkan user ${username}`,
            color: 'gradient-purple'
        });
        
    } catch (error) {
        console.error('Failed to add user:', error);
        showToast('Error', 'Gagal menambahkan user', 'error');
    }
}

async function editUser(userId) {
    try {
        const user = await Database.get(STORES.USERS, userId);
        if (!user) return;
        
        const content = `
            <div class="modal-header">
                <h3><i class="fas fa-user-edit"></i> Edit User</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="editUserForm">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="editUserUsername" class="form-input" value="${user.username}" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="editUserEmail" class="form-input" value="${user.email}" required>
                    </div>
                    <div class="form-group">
                        <label>New Password (leave blank to keep current)</label>
                        <input type="password" id="editUserPassword" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select id="editUserRole" class="form-select">
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="reseller" ${user.role === 'reseller' ? 'selected' : ''}>Reseller</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="editUserStatus" class="form-select">
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="banned" ${user.status === 'banned' ? 'selected' : ''}>Banned</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitEditUser(${userId})">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </div>
        `;
        
        showModal(content);
    } catch (error) {
        console.error('Failed to load user:', error);
    }
}

async function submitEditUser(userId) {
    try {
        const user = await Database.get(STORES.USERS, userId);
        if (!user) return;
        
        user.username = document.getElementById('editUserUsername').value.trim();
        user.email = document.getElementById('editUserEmail').value.trim();
        user.role = document.getElementById('editUserRole').value;
        user.status = document.getElementById('editUserStatus').value;
        
        const newPassword = document.getElementById('editUserPassword').value;
        if (newPassword) {
            user.password = newPassword;
        }
        
        await Database.update(STORES.USERS, user);
        
        showToast('Berhasil', 'User berhasil diupdate', 'success');
        closeModal();
        loadAdminUsers();
    } catch (error) {
        console.error('Failed to update user:', error);
        showToast('Error', 'Gagal update user', 'error');
    }
}

function addBalanceModal(userId) {
    const content = `
        <div class="modal-header">
            <h3><i class="fas fa-plus-circle"></i> Add Balance</h3>
            <button class="modal-close" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Amount</label>
                <input type="number" id="addBalanceAmount" class="form-input" placeholder="10000" min="1000">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-success" onclick="submitAddBalance(${userId})">
                <i class="fas fa-plus"></i> Add Balance
            </button>
        </div>
    `;
    
    showModal(content);
}

async function submitAddBalance(userId) {
    const amount = parseInt(document.getElementById('addBalanceAmount').value) || 0;
    
    if (amount < 1000) {
        showToast('Error', 'Minimal Rp 1.000', 'error');
        return;
    }
    
    try {
        await UserDB.updateBalance(userId, amount);
        showToast('Berhasil', `Saldo ${formatCurrency(amount)} berhasil ditambahkan`, 'success');
        closeModal();
        loadAdminUsers();
    } catch (error) {
        console.error('Failed to add balance:', error);
        showToast('Error', 'Gagal menambah saldo', 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    
    try {
        await Database.delete(STORES.USERS, userId);
        showToast('Berhasil', 'User berhasil dihapus', 'success');
        loadAdminUsers();
        loadAdminStats();
    } catch (error) {
        console.error('Failed to delete user:', error);
        showToast('Error', 'Gagal menghapus user', 'error');
    }
}

// Load Admin Orders
async function loadAdminOrders() {
    try {
        const orders = await Database.getAll(STORES.ORDERS);
        const users = await Database.getAll(STORES.USERS);
        
        // Create user lookup
        const userLookup = {};
        users.forEach(u => userLookup[u.id] = u.username);
        
        renderAdminOrdersTable(orders.reverse(), userLookup);
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

function renderAdminOrdersTable(orders, userLookup) {
    const tbody = document.getElementById('adminOrdersBody');
    if (!tbody) return;
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tidak ada order</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${userLookup[order.userId] || 'Unknown'}</td>
            <td>${order.serviceName || 'N/A'}</td>
            <td>${order.quantity?.toLocaleString('id-ID')}</td>
            <td>${formatCurrency(order.price)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${formatDate(order.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewOrderDetails(${order.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="changeOrderStatus(${order.id})" title="Change Status">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function filterAdminOrders() {
    const search = document.getElementById('adminOrderSearch').value.toLowerCase();
    const status = document.getElementById('adminOrderStatus').value;
    
    try {
        let orders = await Database.getAll(STORES.ORDERS);
        const users = await Database.getAll(STORES.USERS);
        
        const userLookup = {};
        users.forEach(u => userLookup[u.id] = u.username);
        
        if (search) {
            orders = orders.filter(o => 
                o.serviceName?.toLowerCase().includes(search) ||
                o.link?.toLowerCase().includes(search) ||
                o.id?.toString().includes(search) ||
                userLookup[o.userId]?.toLowerCase().includes(search)
            );
        }
        
        if (status) {
            orders = orders.filter(o => o.status === status);
        }
        
        renderAdminOrdersTable(orders.reverse(), userLookup);
    } catch (error) {
        console.error('Failed to filter orders:', error);
    }
}

async function viewOrderDetails(orderId) {
    try {
        const order = await Database.get(STORES.ORDERS, orderId);
        if (!order) return;
        
        const user = await Database.get(STORES.USERS, order.userId);
        
        const content = `
            <div class="modal-header">
                <h3><i class="fas fa-info-circle"></i> Order Details #${order.id}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="detail-card glass-morphism" style="margin-bottom: 16px;">
                    <div class="detail-row">
                        <span>User:</span>
                        <strong>${user?.username || 'Unknown'}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Service:</span>
                        <strong>${order.serviceName}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Link:</span>
                        <strong style="word-break: break-all;">${order.link}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Quantity:</span>
                        <strong>${order.quantity?.toLocaleString('id-ID')}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Price:</span>
                        <strong>${formatCurrency(order.price)}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Status:</span>
                        <strong><span class="status-badge status-${order.status}">${order.status}</span></strong>
                    </div>
                    <div class="detail-row">
                        <span>Start Count:</span>
                        <strong>${order.startCount?.toLocaleString('id-ID') || 0}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Remains:</span>
                        <strong>${order.remains?.toLocaleString('id-ID') || 0}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Created:</span>
                        <strong>${formatDate(order.createdAt)}</strong>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        `;
        
        showModal(content);
    } catch (error) {
        console.error('Failed to load order:', error);
    }
}

async function changeOrderStatus(orderId) {
    try {
        const order = await Database.get(STORES.ORDERS, orderId);
        if (!order) return;
        
        const content = `
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> Change Order Status</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Order #${order.id} - ${order.serviceName}</label>
                    <select id="newOrderStatus" class="form-select">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitOrderStatus(${orderId})">
                    <i class="fas fa-save"></i> Update Status
                </button>
            </div>
        `;
        
        showModal(content);
    } catch (error) {
        console.error('Failed to load order:', error);
    }
}

async function submitOrderStatus(orderId) {
    const newStatus = document.getElementById('newOrderStatus').value;
    
    try {
        await OrderDB.updateStatus(orderId, newStatus);
        
        showToast('Berhasil', 'Status order berhasil diupdate', 'success');
        closeModal();
        loadAdminOrders();
        loadAdminStats();
    } catch (error) {
        console.error('Failed to update order:', error);
        showToast('Error', 'Gagal update status', 'error');
    }
}

// Load Admin Services
async function loadAdminServices() {
    try {
        const services = await Database.getAll(STORES.SERVICES);
        renderServicesTable(services);
    } catch (error) {
        console.error('Failed to load services:', error);
    }
}

function renderServicesTable(services) {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;
    
    if (services.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-server"></i>
                    <p>Tidak ada layanan</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = services.map(service => `
        <tr>
            <td>#${service.id}</td>
            <td>${service.category}</td>
            <td>${service.name}</td>
            <td>${formatCurrency(service.pricePerK)}/1K</td>
            <td>${service.min?.toLocaleString('id-ID')}</td>
            <td>${service.max?.toLocaleString('id-ID')}</td>
            <td><span class="status-badge status-${service.status === 'active' ? 'completed' : 'cancelled'}">${service.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editService(${service.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteService(${service.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddServiceModal() {
    const content = `
        <div class="modal-header">
            <h3><i class="fas fa-plus"></i> Add New Service</h3>
            <button class="modal-close" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="addServiceForm">
                <div class="form-group">
                    <label>Category</label>
                    <select id="newServiceCategory" class="form-select">
                        <option value="Instagram">Instagram</option>
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Telegram">Telegram</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Service Name</label>
                    <input type="text" id="newServiceName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Price per 1000</label>
                    <input type="number" id="newServicePrice" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Min Order</label>
                    <input type="number" id="newServiceMin" class="form-input" value="100" required>
                </div>
                <div class="form-group">
                    <label>Max Order</label>
                    <input type="number" id="newServiceMax" class="form-input" value="100000" required>
                </div>
                <div class="form-group">
                    <label>Estimate</label>
                    <input type="text" id="newServiceEstimate" class="form-input" value="0-24 jam">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="submitAddService()">
                <i class="fas fa-plus"></i> Add Service
            </button>
        </div>
    `;
    
    showModal(content);
}

async function submitAddService() {
    const category = document.getElementById('newServiceCategory').value;
    const name = document.getElementById('newServiceName').value.trim();
    const pricePerK = parseInt(document.getElementById('newServicePrice').value) || 0;
    const min = parseInt(document.getElementById('newServiceMin').value) || 100;
    const max = parseInt(document.getElementById('newServiceMax').value) || 100000;
    const estimate = document.getElementById('newServiceEstimate').value.trim();
    
    if (!name || !pricePerK) {
        showToast('Error', 'Lengkapi semua field', 'error');
        return;
    }
    
    try {
        await Database.add(STORES.SERVICES, {
            category,
            name,
            pricePerK,
            price: pricePerK,
            min,
            max,
            estimate,
            description: name,
            status: 'active'
        });
        
        showToast('Berhasil', 'Service berhasil ditambahkan', 'success');
        closeModal();
        loadAdminServices();
    } catch (error) {
        console.error('Failed to add service:', error);
        showToast('Error', 'Gagal menambahkan service', 'error');
    }
}

async function editService(serviceId) {
    try {
        const service = await Database.get(STORES.SERVICES, serviceId);
        if (!service) return;
        
        const content = `
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> Edit Service</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="editServiceForm">
                    <div class="form-group">
                        <label>Category</label>
                        <select id="editServiceCategory" class="form-select">
                            <option value="Instagram" ${service.category === 'Instagram' ? 'selected' : ''}>Instagram</option>
                            <option value="YouTube" ${service.category === 'YouTube' ? 'selected' : ''}>YouTube</option>
                            <option value="TikTok" ${service.category === 'TikTok' ? 'selected' : ''}>TikTok</option>
                            <option value="Twitter" ${service.category === 'Twitter' ? 'selected' : ''}>Twitter</option>
                            <option value="Facebook" ${service.category === 'Facebook' ? 'selected' : ''}>Facebook</option>
                            <option value="Telegram" ${service.category === 'Telegram' ? 'selected' : ''}>Telegram</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Service Name</label>
                        <input type="text" id="editServiceName" class="form-input" value="${service.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Price per 1000</label>
                        <input type="number" id="editServicePrice" class="form-input" value="${service.pricePerK}" required>
                    </div>
                    <div class="form-group">
                        <label>Min Order</label>
                        <input type="number" id="editServiceMin" class="form-input" value="${service.min}" required>
                    </div>
                    <div class="form-group">
                        <label>Max Order</label>
                        <input type="number" id="editServiceMax" class="form-input" value="${service.max}" required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="editServiceStatus" class="form-select">
                            <option value="active" ${service.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${service.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitEditService(${serviceId})">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </div>
        `;
        
        showModal(content);
    } catch (error) {
        console.error('Failed to load service:', error);
    }
}

async function submitEditService(serviceId) {
    try {
        const service = await Database.get(STORES.SERVICES, serviceId);
        if (!service) return;
        
        service.category = document.getElementById('editServiceCategory').value;
        service.name = document.getElementById('editServiceName').value.trim();
        service.pricePerK = parseInt(document.getElementById('editServicePrice').value) || 0;
        service.price = service.pricePerK;
        service.min = parseInt(document.getElementById('editServiceMin').value) || 100;
        service.max = parseInt(document.getElementById('editServiceMax').value) || 100000;
        service.status = document.getElementById('editServiceStatus').value;
        
        await Database.update(STORES.SERVICES, service);
        
        showToast('Berhasil', 'Service berhasil diupdate', 'success');
        closeModal();
        loadAdminServices();
    } catch (error) {
        console.error('Failed to update service:', error);
        showToast('Error', 'Gagal update service', 'error');
    }
}

async function deleteService(serviceId) {
    if (!confirm('Apakah Anda yakin ingin menghapus service ini?')) return;
    
    try {
        await Database.delete(STORES.SERVICES, serviceId);
        showToast('Berhasil', 'Service berhasil dihapus', 'success');
        loadAdminServices();
    } catch (error) {
        console.error('Failed to delete service:', error);
        showToast('Error', 'Gagal menghapus service', 'error');
    }
}

// Load Admin Deposits
async function loadAdminDeposits() {
    try {
        const deposits = await Database.getAll(STORES.DEPOSITS);
        const users = await Database.getAll(STORES.USERS);
        
        const userLookup = {};
        users.forEach(u => userLookup[u.id] = u.username);
        
        renderDepositsTable(deposits.reverse(), userLookup);
    } catch (error) {
        console.error('Failed to load deposits:', error);
    }
}

function renderDepositsTable(deposits, userLookup) {
    const tbody = document.getElementById('depositsTableBody');
    if (!tbody) return;
    
    if (deposits.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-money-bill-wave"></i>
                    <p>Tidak ada deposit</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = deposits.map(deposit => `
        <tr>
            <td>#${deposit.id}</td>
            <td>${userLookup[deposit.userId] || 'Unknown'}</td>
            <td>${formatCurrency(deposit.amount)}</td>
            <td>${getPaymentMethodName(deposit.method)}</td>
            <td><span class="status-badge status-${deposit.status === 'completed' ? 'completed' : 'pending'}">${deposit.status}</span></td>
            <td>${formatDate(deposit.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    ${deposit.status === 'pending' ? `
                    <button class="action-btn view" onclick="approveDeposit(${deposit.id})" title="Approve">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="action-btn delete" onclick="rejectDeposit(${deposit.id})" title="Reject">
                        <i class="fas fa-times"></i>
                    </button>
                    ` : '-'}
                </div>
            </td>
        </tr>
    `).join('');
}

async function approveDeposit(depositId) {
    if (!confirm('Approve deposit ini?')) return;
    
    try {
        await DepositDB.approve(depositId);
        showToast('Berhasil', 'Deposit berhasil di-approve', 'success');
        loadAdminDeposits();
        loadAdminStats();
    } catch (error) {
        console.error('Failed to approve deposit:', error);
        showToast('Error', 'Gagal approve deposit', 'error');
    }
}

async function rejectDeposit(depositId) {
    if (!confirm('Reject deposit ini?')) return;
    
    try {
        const deposit = await Database.get(STORES.DEPOSITS, depositId);
        if (deposit) {
            deposit.status = 'rejected';
            await Database.update(STORES.DEPOSITS, deposit);
            showToast('Berhasil', 'Deposit berhasil di-reject', 'success');
            loadAdminDeposits();
        }
    } catch (error) {
        console.error('Failed to reject deposit:', error);
        showToast('Error', 'Gagal reject deposit', 'error');
    }
}

// Load Admin Tickets
async function loadAdminTickets() {
    try {
        const tickets = await Database.getAll(STORES.TICKETS);
        const users = await Database.getAll(STORES.USERS);
        
        const userLookup = {};
        users.forEach(u => userLookup[u.id] = u.username);
        
        renderTicketsTable(tickets.reverse(), userLookup);
    } catch (error) {
        console.error('Failed to load tickets:', error);
    }
}

function renderTicketsTable(tickets, userLookup) {
    const tbody = document.getElementById('ticketsTableBody');
    if (!tbody) return;
    
    if (tickets.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <p>Tidak ada tiket</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = tickets.map(ticket => `
        <tr>
            <td>#${ticket.id}</td>
            <td>${userLookup[ticket.userId] || 'Unknown'}</td>
            <td>${ticket.subject}</td>
            <td><span class="priority-badge priority-${ticket.priority}">${ticket.priority}</span></td>
            <td><span class="status-badge status-${ticket.status === 'open' ? 'pending' : 'completed'}">${ticket.status}</span></td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewTicket(${ticket.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${ticket.status === 'open' ? `
                    <button class="action-btn edit" onclick="closeTicket(${ticket.id})" title="Close">
                        <i class="fas fa-check"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

async function viewTicket(ticketId) {
    try {
        const ticket = await Database.get(STORES.TICKETS, ticketId);
        if (!ticket) return;
        
        const user = await Database.get(STORES.USERS, ticket.userId);
        
        const content = `
            <div class="modal-header">
                <h3><i class="fas fa-ticket-alt"></i> Ticket #${ticket.id}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="detail-card glass-morphism" style="margin-bottom: 16px;">
                    <div class="detail-row">
                        <span>User:</span>
                        <strong>${user?.username || 'Unknown'}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Subject:</span>
                        <strong>${ticket.subject}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Priority:</span>
                        <strong><span class="priority-badge priority-${ticket.priority}">${ticket.priority}</span></strong>
                    </div>
                    <div class="detail-row">
                        <span>Status:</span>
                        <strong><span class="status-badge status-${ticket.status === 'open' ? 'pending' : 'completed'}">${ticket.status}</span></strong>
                    </div>
                    <div class="detail-row">
                        <span>Created:</span>
                        <strong>${formatDate(ticket.createdAt)}</strong>
                    </div>
                </div>
                <div class="form-group">
                    <label>Message:</label>
                    <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 10px; white-space: pre-wrap;">${ticket.message}</div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                ${ticket.status === 'open' ? `
                <button class="btn btn-success" onclick="closeTicket(${ticket.id}); closeModal();">
                    <i class="fas fa-check"></i> Mark as Resolved
                </button>
                ` : ''}
            </div>
        `;
        
        showModal(content);
    } catch (error) {
        console.error('Failed to load ticket:', error);
    }
}

async function closeTicket(ticketId) {
    try {
        await TicketDB.updateStatus(ticketId, 'closed');
        showToast('Berhasil', 'Tiket berhasil ditutup', 'success');
        loadAdminTickets();
    } catch (error) {
        console.error('Failed to close ticket:', error);
        showToast('Error', 'Gagal menutup tiket', 'error');
    }
}

// Utility Functions
function formatTimeAgo(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return Math.floor(diff / 60) + ' menit lalu';
    if (diff < 86400) return Math.floor(diff / 3600) + ' jam lalu';
    if (diff < 604800) return Math.floor(diff / 86400) + ' hari lalu';
    
    return formatDate(dateString);
}

// Export for global access
window.initAdminDashboard = initAdminDashboard;
window.navigateAdminTo = navigateAdminTo;
window.showAddUserModal = showAddUserModal;
window.submitAddUser = submitAddUser;
window.editUser = editUser;
window.submitEditUser = submitEditUser;
window.addBalanceModal = addBalanceModal;
window.submitAddBalance = submitAddBalance;
window.deleteUser = deleteUser;
window.viewOrderDetails = viewOrderDetails;
window.changeOrderStatus = changeOrderStatus;
window.submitOrderStatus = submitOrderStatus;
window.showAddServiceModal = showAddServiceModal;
window.submitAddService = submitAddService;
window.editService = editService;
window.submitEditService = submitEditService;
window.deleteService = deleteService;
window.approveDeposit = approveDeposit;
window.rejectDeposit = rejectDeposit;
window.viewTicket = viewTicket;
window.closeTicket = closeTicket;
window.toggleAdminSidebar = toggleAdminSidebar;
