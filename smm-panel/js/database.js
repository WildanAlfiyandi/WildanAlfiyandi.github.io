// ===============================================
// SMM Panel Premium - IndexedDB Database
// ===============================================

const DB_NAME = 'SMM_Panel_DB';
const DB_VERSION = 1;

// Database stores
const STORES = {
    USERS: 'users',
    ORDERS: 'orders',
    SERVICES: 'services',
    DEPOSITS: 'deposits',
    TICKETS: 'tickets',
    NOTIFICATIONS: 'notifications',
    SETTINGS: 'settings',
    ACTIVITIES: 'activities'
};

let db = null;

// Initialize IndexedDB
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Failed to open database');
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('Database opened successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            // Users store
            if (!database.objectStoreNames.contains(STORES.USERS)) {
                const usersStore = database.createObjectStore(STORES.USERS, { keyPath: 'id', autoIncrement: true });
                usersStore.createIndex('username', 'username', { unique: true });
                usersStore.createIndex('email', 'email', { unique: true });
                usersStore.createIndex('role', 'role', { unique: false });
            }

            // Orders store
            if (!database.objectStoreNames.contains(STORES.ORDERS)) {
                const ordersStore = database.createObjectStore(STORES.ORDERS, { keyPath: 'id', autoIncrement: true });
                ordersStore.createIndex('userId', 'userId', { unique: false });
                ordersStore.createIndex('status', 'status', { unique: false });
                ordersStore.createIndex('createdAt', 'createdAt', { unique: false });
            }

            // Services store
            if (!database.objectStoreNames.contains(STORES.SERVICES)) {
                const servicesStore = database.createObjectStore(STORES.SERVICES, { keyPath: 'id', autoIncrement: true });
                servicesStore.createIndex('category', 'category', { unique: false });
                servicesStore.createIndex('status', 'status', { unique: false });
            }

            // Deposits store
            if (!database.objectStoreNames.contains(STORES.DEPOSITS)) {
                const depositsStore = database.createObjectStore(STORES.DEPOSITS, { keyPath: 'id', autoIncrement: true });
                depositsStore.createIndex('userId', 'userId', { unique: false });
                depositsStore.createIndex('status', 'status', { unique: false });
            }

            // Tickets store
            if (!database.objectStoreNames.contains(STORES.TICKETS)) {
                const ticketsStore = database.createObjectStore(STORES.TICKETS, { keyPath: 'id', autoIncrement: true });
                ticketsStore.createIndex('userId', 'userId', { unique: false });
                ticketsStore.createIndex('status', 'status', { unique: false });
            }

            // Notifications store
            if (!database.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
                const notificationsStore = database.createObjectStore(STORES.NOTIFICATIONS, { keyPath: 'id', autoIncrement: true });
                notificationsStore.createIndex('userId', 'userId', { unique: false });
                notificationsStore.createIndex('read', 'read', { unique: false });
            }

            // Settings store
            if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
                database.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
            }

            // Activities store (for real-time feed)
            if (!database.objectStoreNames.contains(STORES.ACTIVITIES)) {
                const activitiesStore = database.createObjectStore(STORES.ACTIVITIES, { keyPath: 'id', autoIncrement: true });
                activitiesStore.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
    });
}

// Generic CRUD Operations
const Database = {
    // Add item to store
    add: (storeName, data) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add({ ...data, createdAt: new Date().toISOString() });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Get item by ID
    get: (storeName, id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Get all items from store
    getAll: (storeName) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Update item
    update: (storeName, data) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put({ ...data, updatedAt: new Date().toISOString() });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Delete item
    delete: (storeName, id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    // Get by index
    getByIndex: (storeName, indexName, value) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Get single by index
    getOneByIndex: (storeName, indexName, value) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.get(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Count items
    count: (storeName) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Clear store
    clear: (storeName) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
};

// Seed initial data
async function seedDatabase() {
    try {
        // Check if data already exists
        const existingUsers = await Database.getAll(STORES.USERS);
        if (existingUsers.length > 0) {
            console.log('Database already seeded');
            return;
        }

        // Seed demo users
        const users = [
            {
                username: 'admin',
                email: 'admin@smmpanel.com',
                password: 'admin123',
                role: 'admin',
                balance: 1000000,
                apiKey: generateApiKey(),
                status: 'active'
            },
            {
                username: 'user',
                email: 'user@email.com',
                password: 'user123',
                role: 'user',
                balance: 150000,
                apiKey: generateApiKey(),
                status: 'active'
            },
            {
                username: 'demo',
                email: 'demo@email.com',
                password: 'demo123',
                role: 'user',
                balance: 50000,
                apiKey: generateApiKey(),
                status: 'active'
            }
        ];

        for (const user of users) {
            await Database.add(STORES.USERS, user);
        }

        // Seed services
        const services = [
            // Instagram Services
            {
                category: 'Instagram',
                name: 'Instagram Followers [HQ]',
                price: 15000,
                pricePerK: 15000,
                min: 100,
                max: 100000,
                estimate: '0-24 jam',
                description: 'Followers Instagram berkualitas tinggi',
                status: 'active'
            },
            {
                category: 'Instagram',
                name: 'Instagram Likes [Real]',
                price: 5000,
                pricePerK: 5000,
                min: 50,
                max: 50000,
                estimate: '0-12 jam',
                description: 'Likes Instagram dari akun real',
                status: 'active'
            },
            {
                category: 'Instagram',
                name: 'Instagram Views',
                price: 3000,
                pricePerK: 3000,
                min: 100,
                max: 1000000,
                estimate: '0-6 jam',
                description: 'Views untuk video dan reels',
                status: 'active'
            },
            {
                category: 'Instagram',
                name: 'Instagram Comments [Custom]',
                price: 50000,
                pricePerK: 50000,
                min: 10,
                max: 1000,
                estimate: '0-24 jam',
                description: 'Komentar custom sesuai permintaan',
                status: 'active'
            },
            // YouTube Services
            {
                category: 'YouTube',
                name: 'YouTube Subscribers',
                price: 25000,
                pricePerK: 25000,
                min: 100,
                max: 50000,
                estimate: '0-48 jam',
                description: 'Subscribers YouTube non-drop',
                status: 'active'
            },
            {
                category: 'YouTube',
                name: 'YouTube Views [Real]',
                price: 20000,
                pricePerK: 20000,
                min: 500,
                max: 1000000,
                estimate: '0-24 jam',
                description: 'Views YouTube berkualitas',
                status: 'active'
            },
            {
                category: 'YouTube',
                name: 'YouTube Likes',
                price: 15000,
                pricePerK: 15000,
                min: 50,
                max: 50000,
                estimate: '0-12 jam',
                description: 'Likes untuk video YouTube',
                status: 'active'
            },
            {
                category: 'YouTube',
                name: 'YouTube Watch Time (4000 jam)',
                price: 500000,
                pricePerK: 500000,
                min: 1,
                max: 10,
                estimate: '7-14 hari',
                description: 'Watch time untuk monetisasi',
                status: 'active'
            },
            // TikTok Services
            {
                category: 'TikTok',
                name: 'TikTok Followers',
                price: 20000,
                pricePerK: 20000,
                min: 100,
                max: 100000,
                estimate: '0-24 jam',
                description: 'Followers TikTok berkualitas',
                status: 'active'
            },
            {
                category: 'TikTok',
                name: 'TikTok Likes',
                price: 8000,
                pricePerK: 8000,
                min: 50,
                max: 100000,
                estimate: '0-12 jam',
                description: 'Likes TikTok cepat',
                status: 'active'
            },
            {
                category: 'TikTok',
                name: 'TikTok Views',
                price: 2000,
                pricePerK: 2000,
                min: 1000,
                max: 10000000,
                estimate: '0-6 jam',
                description: 'Views TikTok super cepat',
                status: 'active'
            },
            {
                category: 'TikTok',
                name: 'TikTok Shares',
                price: 10000,
                pricePerK: 10000,
                min: 100,
                max: 50000,
                estimate: '0-24 jam',
                description: 'Shares untuk viral',
                status: 'active'
            },
            // Twitter/X Services
            {
                category: 'Twitter',
                name: 'Twitter Followers',
                price: 18000,
                pricePerK: 18000,
                min: 100,
                max: 100000,
                estimate: '0-24 jam',
                description: 'Followers Twitter/X',
                status: 'active'
            },
            {
                category: 'Twitter',
                name: 'Twitter Likes',
                price: 6000,
                pricePerK: 6000,
                min: 50,
                max: 50000,
                estimate: '0-12 jam',
                description: 'Likes untuk tweet',
                status: 'active'
            },
            {
                category: 'Twitter',
                name: 'Twitter Retweets',
                price: 10000,
                pricePerK: 10000,
                min: 50,
                max: 50000,
                estimate: '0-12 jam',
                description: 'Retweets berkualitas',
                status: 'active'
            },
            // Facebook Services
            {
                category: 'Facebook',
                name: 'Facebook Page Likes',
                price: 30000,
                pricePerK: 30000,
                min: 100,
                max: 50000,
                estimate: '0-48 jam',
                description: 'Likes untuk halaman Facebook',
                status: 'active'
            },
            {
                category: 'Facebook',
                name: 'Facebook Post Likes',
                price: 8000,
                pricePerK: 8000,
                min: 50,
                max: 50000,
                estimate: '0-12 jam',
                description: 'Likes untuk postingan',
                status: 'active'
            },
            {
                category: 'Facebook',
                name: 'Facebook Video Views',
                price: 5000,
                pricePerK: 5000,
                min: 500,
                max: 1000000,
                estimate: '0-12 jam',
                description: 'Views video Facebook',
                status: 'active'
            },
            // Telegram Services
            {
                category: 'Telegram',
                name: 'Telegram Channel Members',
                price: 25000,
                pricePerK: 25000,
                min: 100,
                max: 100000,
                estimate: '0-24 jam',
                description: 'Members untuk channel',
                status: 'active'
            },
            {
                category: 'Telegram',
                name: 'Telegram Group Members',
                price: 30000,
                pricePerK: 30000,
                min: 100,
                max: 50000,
                estimate: '0-24 jam',
                description: 'Members untuk grup',
                status: 'active'
            },
            {
                category: 'Telegram',
                name: 'Telegram Post Views',
                price: 2000,
                pricePerK: 2000,
                min: 500,
                max: 1000000,
                estimate: '0-6 jam',
                description: 'Views untuk postingan',
                status: 'active'
            }
        ];

        for (const service of services) {
            await Database.add(STORES.SERVICES, service);
        }

        // Seed sample orders
        const sampleOrders = [
            {
                userId: 2,
                serviceId: 1,
                serviceName: 'Instagram Followers [HQ]',
                quantity: 1000,
                price: 15000,
                link: 'https://instagram.com/sampleuser',
                status: 'completed',
                startCount: 1500,
                remains: 0
            },
            {
                userId: 2,
                serviceId: 3,
                serviceName: 'Instagram Views',
                quantity: 5000,
                price: 15000,
                link: 'https://instagram.com/p/sample123',
                status: 'processing',
                startCount: 100,
                remains: 2500
            },
            {
                userId: 2,
                serviceId: 9,
                serviceName: 'TikTok Followers',
                quantity: 500,
                price: 10000,
                link: 'https://tiktok.com/@sampleuser',
                status: 'pending',
                startCount: 0,
                remains: 500
            }
        ];

        for (const order of sampleOrders) {
            await Database.add(STORES.ORDERS, order);
        }

        // Seed sample deposits
        const sampleDeposits = [
            {
                userId: 2,
                amount: 100000,
                method: 'bank_transfer',
                status: 'completed'
            },
            {
                userId: 2,
                amount: 50000,
                method: 'ewallet',
                status: 'completed'
            }
        ];

        for (const deposit of sampleDeposits) {
            await Database.add(STORES.DEPOSITS, deposit);
        }

        // Seed notifications
        const notifications = [
            {
                userId: 2,
                title: 'Selamat Datang!',
                message: 'Terima kasih telah bergabung di SMM Panel Premium',
                type: 'info',
                read: false
            },
            {
                userId: 2,
                title: 'Order Selesai',
                message: 'Order #1 Instagram Followers telah selesai',
                type: 'success',
                read: false
            },
            {
                userId: 2,
                title: 'Deposit Berhasil',
                message: 'Deposit Rp 100.000 telah dikonfirmasi',
                type: 'success',
                read: true
            }
        ];

        for (const notif of notifications) {
            await Database.add(STORES.NOTIFICATIONS, notif);
        }

        // Seed activities
        const activities = [
            {
                type: 'order',
                icon: 'fas fa-shopping-cart',
                title: 'Order baru diterima',
                description: 'User membuat order Instagram Followers',
                color: 'gradient-blue'
            },
            {
                type: 'deposit',
                icon: 'fas fa-money-bill-wave',
                title: 'Deposit dikonfirmasi',
                description: 'Deposit Rp 100.000 dari user',
                color: 'gradient-green'
            },
            {
                type: 'user',
                icon: 'fas fa-user-plus',
                title: 'User baru terdaftar',
                description: 'demo@email.com bergabung',
                color: 'gradient-purple'
            }
        ];

        for (const activity of activities) {
            await Database.add(STORES.ACTIVITIES, activity);
        }

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Helper function to generate API key
function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// User-specific database functions
const UserDB = {
    authenticate: async (username, password) => {
        const user = await Database.getOneByIndex(STORES.USERS, 'username', username);
        if (user && user.password === password) {
            return user;
        }
        return null;
    },

    register: async (userData) => {
        const existingUser = await Database.getOneByIndex(STORES.USERS, 'username', userData.username);
        if (existingUser) {
            throw new Error('Username sudah digunakan');
        }

        const existingEmail = await Database.getOneByIndex(STORES.USERS, 'email', userData.email);
        if (existingEmail) {
            throw new Error('Email sudah terdaftar');
        }

        return await Database.add(STORES.USERS, {
            ...userData,
            role: 'user',
            balance: 0,
            apiKey: generateApiKey(),
            status: 'active'
        });
    },

    updateBalance: async (userId, amount) => {
        const user = await Database.get(STORES.USERS, userId);
        if (user) {
            user.balance = (user.balance || 0) + amount;
            return await Database.update(STORES.USERS, user);
        }
        return null;
    },

    getOrders: async (userId) => {
        return await Database.getByIndex(STORES.ORDERS, 'userId', userId);
    },

    getDeposits: async (userId) => {
        return await Database.getByIndex(STORES.DEPOSITS, 'userId', userId);
    },

    getTickets: async (userId) => {
        return await Database.getByIndex(STORES.TICKETS, 'userId', userId);
    },

    getNotifications: async (userId) => {
        return await Database.getByIndex(STORES.NOTIFICATIONS, 'userId', userId);
    }
};

// Order database functions
const OrderDB = {
    create: async (orderData) => {
        const id = await Database.add(STORES.ORDERS, orderData);
        
        // Add activity
        await Database.add(STORES.ACTIVITIES, {
            type: 'order',
            icon: 'fas fa-shopping-cart',
            title: 'Order baru diterima',
            description: `Order ${orderData.serviceName}`,
            color: 'gradient-blue'
        });

        return id;
    },

    updateStatus: async (orderId, status) => {
        const order = await Database.get(STORES.ORDERS, orderId);
        if (order) {
            order.status = status;
            return await Database.update(STORES.ORDERS, order);
        }
        return null;
    },

    getByStatus: async (status) => {
        return await Database.getByIndex(STORES.ORDERS, 'status', status);
    }
};

// Deposit database functions
const DepositDB = {
    create: async (depositData) => {
        const id = await Database.add(STORES.DEPOSITS, depositData);
        
        // Add activity
        await Database.add(STORES.ACTIVITIES, {
            type: 'deposit',
            icon: 'fas fa-money-bill-wave',
            title: 'Deposit baru',
            description: `Deposit Rp ${depositData.amount.toLocaleString('id-ID')}`,
            color: 'gradient-green'
        });

        return id;
    },

    approve: async (depositId) => {
        const deposit = await Database.get(STORES.DEPOSITS, depositId);
        if (deposit && deposit.status === 'pending') {
            deposit.status = 'completed';
            await Database.update(STORES.DEPOSITS, deposit);
            
            // Update user balance
            await UserDB.updateBalance(deposit.userId, deposit.amount);
            
            return true;
        }
        return false;
    }
};

// Service database functions
const ServiceDB = {
    getByCategory: async (category) => {
        return await Database.getByIndex(STORES.SERVICES, 'category', category);
    },

    getCategories: async () => {
        const services = await Database.getAll(STORES.SERVICES);
        const categories = [...new Set(services.map(s => s.category))];
        return categories;
    },

    getActive: async () => {
        return await Database.getByIndex(STORES.SERVICES, 'status', 'active');
    }
};

// Ticket database functions
const TicketDB = {
    create: async (ticketData) => {
        const id = await Database.add(STORES.TICKETS, {
            ...ticketData,
            status: 'open'
        });

        // Add activity
        await Database.add(STORES.ACTIVITIES, {
            type: 'ticket',
            icon: 'fas fa-ticket-alt',
            title: 'Tiket baru',
            description: ticketData.subject,
            color: 'gradient-yellow'
        });

        return id;
    },

    updateStatus: async (ticketId, status) => {
        const ticket = await Database.get(STORES.TICKETS, ticketId);
        if (ticket) {
            ticket.status = status;
            return await Database.update(STORES.TICKETS, ticket);
        }
        return null;
    }
};

// Export for use
window.initDatabase = initDatabase;
window.seedDatabase = seedDatabase;
window.Database = Database;
window.UserDB = UserDB;
window.OrderDB = OrderDB;
window.DepositDB = DepositDB;
window.ServiceDB = ServiceDB;
window.TicketDB = TicketDB;
window.STORES = STORES;
window.generateApiKey = generateApiKey;
