// ========================================
// PROFESSIONAL DEPLOYMENT PLATFORM
// Enhanced JavaScript with Advanced Features
// ========================================

// State Management
let currentUser = null;
let uploadedFiles = [];
let deploymentHistory = [];
let stats = {
    total_deployments: 0,
    active_deployments: 0,
    total_files: 0,
    total_size: 0
};

// DOM Elements - Login
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// DOM Elements - Navbar
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');
const settingsBtn = document.getElementById('settingsBtn');

// DOM Elements - Stats
const totalDeployments = document.getElementById('totalDeployments');
const activeDeployments = document.getElementById('activeDeployments');
const totalFiles = document.getElementById('totalFiles');
const totalSize = document.getElementById('totalSize');

// DOM Elements - Upload
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const fileList = document.getElementById('fileList');
const fileTypeInfo = document.getElementById('fileTypeInfo');

// DOM Elements - Domain
const domainSection = document.getElementById('domainSection');
const useSubdomain = document.getElementById('useSubdomain');
const useCustomDomain = document.getElementById('useCustomDomain');
const customDomainInput = document.getElementById('customDomainInput');
const customDomain = document.getElementById('customDomain');
const verifyDomainBtn = document.getElementById('verifyDomainBtn');
const autoSubdomain = document.getElementById('autoSubdomain');

// DOM Elements - Deployment
const deploySection = document.getElementById('deploySection');
const fileCount = document.getElementById('fileCount');
const totalFileSize = document.getElementById('totalFileSize');
const deployBtn = document.getElementById('deployBtn');
const deployProgress = document.getElementById('deployProgress');
const progressFill = document.getElementById('progressFill');
const deployStatus = document.getElementById('deployStatus');
const deployResult = document.getElementById('deployResult');
const websiteLink = document.getElementById('websiteLink');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const newDeployBtn = document.getElementById('newDeployBtn');

// DOM Elements - History
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// DOM Elements - Settings Modal
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const themeBtns = document.querySelectorAll('.theme-btn');
const notificationsToggle = document.getElementById('notificationsToggle');

// Demo user credentials
const users = {
    'admin': 'admin123',
    'user': 'password123',
    'demo': 'demo123'
};

// Supported file types with PHP
const supportedFileTypes = {
    'html': { icon: 'fab fa-html5', color: '#e34f26' },
    'css': { icon: 'fab fa-css3-alt', color: '#1572b6' },
    'js': { icon: 'fab fa-js', color: '#f7df1e' },
    'php': { icon: 'fab fa-php', color: '#777bb4' },
    'json': { icon: 'fas fa-file-code', color: '#ffa500' },
    'xml': { icon: 'fas fa-file-code', color: '#ff6600' },
    'jpg': { icon: 'fas fa-file-image', color: '#4caf50' },
    'jpeg': { icon: 'fas fa-file-image', color: '#4caf50' },
    'png': { icon: 'fas fa-file-image', color: '#4caf50' },
    'gif': { icon: 'fas fa-file-image', color: '#4caf50' },
    'svg': { icon: 'fas fa-file-image', color: '#ff9800' },
    'pdf': { icon: 'fas fa-file-pdf', color: '#f40f02' },
    'zip': { icon: 'fas fa-file-archive', color: '#ffc107' },
    'txt': { icon: 'fas fa-file-alt', color: '#9e9e9e' },
    'md': { icon: 'fas fa-file-alt', color: '#2196f3' }
};

// Initialize
function init() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showDashboard();
    }
    loadDeploymentHistory();
    loadStats();
    setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Settings
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }

    // Theme selection
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const theme = btn.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    });

    // File upload
    if (browseBtn) {
        browseBtn.addEventListener('click', () => fileInput.click());
    }

    if (uploadArea) {
        uploadArea.addEventListener('click', (e) => {
            if (e.target === uploadArea || e.target.closest('.upload-area')) {
                fileInput.click();
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }

    // Domain configuration
    if (useSubdomain) {
        useSubdomain.addEventListener('change', () => {
            if (customDomainInput) {
                customDomainInput.style.display = 'none';
            }
        });
    }

    if (useCustomDomain) {
        useCustomDomain.addEventListener('change', () => {
            if (customDomainInput) {
                customDomainInput.style.display = 'block';
            }
        });
    }

    if (verifyDomainBtn) {
        verifyDomainBtn.addEventListener('click', verifyCustomDomain);
    }

    // Deployment
    if (deployBtn) {
        deployBtn.addEventListener('click', startDeployment);
    }

    if (newDeployBtn) {
        newDeployBtn.addEventListener('click', resetForNewDeployment);
    }

    if (copyUrlBtn) {
        copyUrlBtn.addEventListener('click', copyDeploymentUrl);
    }

    // History
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
}

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        loginError.classList.remove('show');
        showDashboard();
    } else {
        loginError.textContent = '❌ Invalid username or password!';
        loginError.classList.add('show');
    }
}

// Logout Handler
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    uploadedFiles = [];
    showLogin();
}

// Show Dashboard
function showDashboard() {
    loginPage.classList.remove('active');
    dashboardPage.classList.add('active');
    userDisplay.textContent = currentUser;
    renderFileList();
    renderHistory();
    updateStats();
    applyTheme();
}

// Show Login
function showLogin() {
    dashboardPage.classList.remove('active');
    loginPage.classList.add('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    loginError.classList.remove('show');
}

// Apply saved theme
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        themeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === savedTheme);
        });
    }
}

// Handle Files
function handleFiles(files) {
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
        if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
            uploadedFiles.push({
                name: file.name,
                size: file.size,
                type: file.type,
                file: file
            });
        }
    });
    
    renderFileList();
    updateDeploySection();
    showFileTypeInfo();
}

// Show file type info
function showFileTypeInfo() {
    if (fileTypeInfo && uploadedFiles.length > 0) {
        fileTypeInfo.style.display = 'block';
    }
}

// Render File List
function renderFileList() {
    if (!fileList) return;
    
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = uploadedFiles.map((file, index) => {
        const ext = file.name.split('.').pop().toLowerCase();
        const fileInfo = supportedFileTypes[ext] || { icon: 'fas fa-file', color: '#666' };
        
        return `
            <div class="file-item">
                <div class="file-info">
                    <div class="file-icon"><i class="${fileInfo.icon}" style="color: ${fileInfo.color}"></i></div>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button class="file-remove" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
        `;
    }).join('');
}

// Remove File
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
    updateDeploySection();
    
    if (uploadedFiles.length === 0 && fileTypeInfo) {
        fileTypeInfo.style.display = 'none';
    }
}

// Update Deploy Section
function updateDeploySection() {
    if (!deploySection) return;
    
    if (uploadedFiles.length > 0) {
        deploySection.style.display = 'block';
        if (domainSection) domainSection.style.display = 'block';
        
        if (fileCount) fileCount.textContent = uploadedFiles.length;
        
        const total = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
        if (totalFileSize) totalFileSize.textContent = formatFileSize(total);
        
        // Generate auto subdomain
        const randomId = generateDeploymentId();
        if (autoSubdomain) autoSubdomain.textContent = `${randomId}.kiosmurah.me`;
    } else {
        deploySection.style.display = 'none';
        if (domainSection) domainSection.style.display = 'none';
    }
}

// Verify Custom Domain
function verifyCustomDomain() {
    const domain = customDomain.value.trim();
    
    if (!domain) {
        alert('⚠️ Please enter a domain name');
        return;
    }
    
    // Simulate domain verification
    alert(`✅ Domain "${domain}" verified successfully!\n\nConfigure your DNS:\nType: CNAME\nName: ${domain}\nValue: kiosmurah.me`);
}

// Start Deployment
async function startDeployment() {
    deployBtn.disabled = true;
    deployBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deploying...';
    deployProgress.style.display = 'block';
    deployResult.style.display = 'none';
    
    // Deployment stages
    const stages = [
        { progress: 15, message: '<i class="fas fa-upload"></i> Uploading files...' },
        { progress: 30, message: '<i class="fas fa-check"></i> Verifying file types...' },
        { progress: 50, message: '<i class="fas fa-cogs"></i> Processing assets...' },
        { progress: 70, message: '<i class="fas fa-server"></i> Configuring server...' },
        { progress: 90, message: '<i class="fas fa-globe"></i> Setting up domain...' },
        { progress: 100, message: '<i class="fas fa-check-circle"></i> Deployment complete!' }
    ];
    
    for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 800));
        progressFill.style.width = stage.progress + '%';
        progressFill.textContent = stage.progress + '%';
        deployStatus.innerHTML = stage.message;
    }
    
    // Determine deployment URL
    let deploymentUrl;
    if (useCustomDomain && useCustomDomain.checked && customDomain.value.trim()) {
        deploymentUrl = `https://${customDomain.value.trim()}`;
    } else {
        const deploymentId = generateDeploymentId();
        deploymentUrl = `https://${deploymentId}.kiosmurah.me`;
    }
    
    // Save deployment
    const deployment = {
        id: generateDeploymentId(),
        url: deploymentUrl,
        files: uploadedFiles.length,
        size: uploadedFiles.reduce((sum, file) => sum + file.size, 0),
        timestamp: new Date().toISOString(),
        user: currentUser,
        fileTypes: getFileTypes()
    };
    
    deploymentHistory.unshift(deployment);
    saveDeploymentHistory();
    updateStats();
    
    // Show result
    setTimeout(() => {
        deployProgress.style.display = 'none';
        deployResult.style.display = 'block';
        websiteLink.href = deploymentUrl;
        websiteLink.textContent = deploymentUrl;
        renderHistory();
        
        if (notificationsToggle && notificationsToggle.checked) {
            showNotification('Deployment successful! 🎉');
        }
    }, 500);
}

// Get unique file types from uploaded files
function getFileTypes() {
    const types = new Set();
    uploadedFiles.forEach(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        types.add(ext.toUpperCase());
    });
    return Array.from(types).join(', ');
}

// Copy Deployment URL
function copyDeploymentUrl() {
    const url = websiteLink.textContent;
    navigator.clipboard.writeText(url).then(() => {
        const originalHtml = copyUrlBtn.innerHTML;
        copyUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyUrlBtn.innerHTML = originalHtml;
        }, 2000);
        showNotification('URL copied to clipboard! 📋');
    });
}

// Reset for New Deployment
function resetForNewDeployment() {
    uploadedFiles = [];
    fileInput.value = '';
    renderFileList();
    updateDeploySection();
    deployBtn.disabled = false;
    deployBtn.innerHTML = '<i class="fas fa-rocket"></i> Start Deploy';
    deployResult.style.display = 'none';
    progressFill.style.width = '0%';
    
    if (customDomain) customDomain.value = '';
    if (useSubdomain) useSubdomain.checked = true;
    if (customDomainInput) customDomainInput.style.display = 'none';
    if (fileTypeInfo) fileTypeInfo.style.display = 'none';
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function generateDeploymentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `deploy-${random}-${timestamp}`;
}

// Deployment History
function loadDeploymentHistory() {
    const saved = localStorage.getItem('deploymentHistory');
    if (saved) {
        deploymentHistory = JSON.parse(saved);
    }
}

function saveDeploymentHistory() {
    localStorage.setItem('deploymentHistory', JSON.stringify(deploymentHistory));
}

function renderHistory() {
    if (!historyList) return;
    
    if (deploymentHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No deployments yet. Upload files and deploy your first website!</p>
            </div>
        `;
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
        return;
    }
    
    if (clearHistoryBtn) clearHistoryBtn.style.display = 'inline-flex';
    
    historyList.innerHTML = deploymentHistory.map(deployment => `
        <div class="history-item">
            <div class="history-info">
                <h4><i class="fas fa-globe"></i> ${deployment.id}</h4>
                <p>
                    ${new Date(deployment.timestamp).toLocaleString()} • 
                    ${deployment.files} files (${formatFileSize(deployment.size)}) • 
                    ${deployment.user} •
                    ${deployment.fileTypes || 'Mixed files'}
                </p>
            </div>
            <a href="${deployment.url}" target="_blank" class="history-link">
                <i class="fas fa-external-link-alt"></i> Visit Site
            </a>
        </div>
    `).join('');
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all deployment history?')) {
        deploymentHistory = [];
        saveDeploymentHistory();
        renderHistory();
        updateStats();
        showNotification('History cleared! 🗑️');
    }
}

// Stats Management
function loadStats() {
    const saved = localStorage.getItem('deploymentStats');
    if (saved) {
        stats = JSON.parse(saved);
    }
}

function updateStats() {
    stats.total_deployments = deploymentHistory.length;
    stats.active_deployments = deploymentHistory.length;
    stats.total_files = deploymentHistory.reduce((sum, d) => sum + d.files, 0);
    stats.total_size = deploymentHistory.reduce((sum, d) => sum + (d.size || 0), 0);
    
    localStorage.setItem('deploymentStats', JSON.stringify(stats));
    
    if (totalDeployments) totalDeployments.textContent = stats.total_deployments;
    if (activeDeployments) activeDeployments.textContent = stats.active_deployments;
    if (totalFiles) totalFiles.textContent = stats.total_files;
    if (totalSize) totalSize.textContent = formatFileSize(stats.total_size);
}

// Show notification
function showNotification(message) {
    // Simple notification - could be enhanced with a toast library
    console.log('📢 ' + message);
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
