// State Management
let currentUser = null;
let uploadedFiles = [];
let deploymentHistory = [];

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const fileList = document.getElementById('fileList');

const deploySection = document.getElementById('deploySection');
const fileCount = document.getElementById('fileCount');
const deployBtn = document.getElementById('deployBtn');
const deployProgress = document.getElementById('deployProgress');
const progressFill = document.getElementById('progressFill');
const deployStatus = document.getElementById('deployStatus');
const deployResult = document.getElementById('deployResult');
const websiteLink = document.getElementById('websiteLink');
const newDeployBtn = document.getElementById('newDeployBtn');

const historyList = document.getElementById('historyList');

// Demo user credentials
// NOTE: This is a client-side demo for GitHub Pages. In a production application,
// authentication should be handled server-side with proper security measures.
// These credentials are intentionally simple for demonstration purposes only.
const users = {
    'admin': 'admin123',
    'user': 'password123',
    'demo': 'demo123'
};

// Initialize
function init() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showDashboard();
    }
    
    // Load deployment history
    loadDeploymentHistory();
}

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (users[username] && users[username] === password) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        loginError.classList.remove('show');
        showDashboard();
    } else {
        loginError.textContent = 'Invalid username or password!';
        loginError.classList.add('show');
    }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    uploadedFiles = [];
    showLogin();
});

// Show Dashboard
function showDashboard() {
    loginPage.classList.remove('active');
    dashboardPage.classList.add('active');
    userDisplay.textContent = `Welcome, ${currentUser}!`;
    renderFileList();
    renderHistory();
}

// Show Login
function showLogin() {
    dashboardPage.classList.remove('active');
    loginPage.classList.add('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    loginError.classList.remove('show');
}

// File Upload Handlers
browseBtn.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('click', (e) => {
    if (e.target === uploadArea || e.target.closest('.upload-area')) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Drag and Drop
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

// Handle Files
function handleFiles(files) {
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
        // Avoid duplicates
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
}

// Render File List
function renderFileList() {
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = uploadedFiles.map((file, index) => `
        <div class="file-item">
            <div class="file-info">
                <span class="file-icon">${getFileIcon(file.name)}</span>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="file-remove" onclick="removeFile(${index})">Remove</button>
        </div>
    `).join('');
}

// Remove File
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
    updateDeploySection();
}

// Update Deploy Section
function updateDeploySection() {
    if (uploadedFiles.length > 0) {
        deploySection.style.display = 'block';
        fileCount.textContent = uploadedFiles.length;
    } else {
        deploySection.style.display = 'none';
    }
}

// Deploy Button Handler
deployBtn.addEventListener('click', () => {
    startDeployment();
});

// Start Deployment
async function startDeployment() {
    deployBtn.disabled = true;
    deployBtn.textContent = 'Deploying...';
    deployProgress.style.display = 'block';
    deployResult.style.display = 'none';
    
    const steps = [
        { progress: 20, message: 'Uploading files...' },
        { progress: 40, message: 'Processing assets...' },
        { progress: 60, message: 'Building website...' },
        { progress: 80, message: 'Configuring server...' },
        { progress: 100, message: 'Deployment complete!' }
    ];
    
    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        progressFill.style.width = step.progress + '%';
        progressFill.textContent = step.progress + '%';
        deployStatus.textContent = step.message;
    }
    
    // Generate deployment URL
    // NOTE: In a real deployment system, this would be an actual working URL
    // For this demo, we generate a simulated URL to demonstrate the concept
    const deploymentId = generateDeploymentId();
    const deploymentUrl = `https://${deploymentId}.kiosmurah.me`;
    
    // Save to history
    const deployment = {
        id: deploymentId,
        url: deploymentUrl,
        files: uploadedFiles.length,
        timestamp: new Date().toISOString(),
        user: currentUser
    };
    
    deploymentHistory.unshift(deployment);
    saveDeploymentHistory();
    
    // Show result
    setTimeout(() => {
        deployProgress.style.display = 'none';
        deployResult.style.display = 'block';
        websiteLink.href = deploymentUrl;
        websiteLink.textContent = deploymentUrl;
        renderHistory();
    }, 500);
}

// New Deployment
newDeployBtn.addEventListener('click', () => {
    uploadedFiles = [];
    fileInput.value = '';
    renderFileList();
    updateDeploySection();
    deployBtn.disabled = false;
    deployBtn.textContent = 'Start Deploy';
    deployResult.style.display = 'none';
    progressFill.style.width = '0%';
});

// Utility Functions
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'html': '📄',
        'css': '🎨',
        'js': '⚡',
        'json': '📋',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'svg': '🎭',
        'pdf': '📕',
        'zip': '📦',
        'txt': '📝'
    };
    return icons[ext] || '📄';
}

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
    if (deploymentHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No deployments yet. Upload files and deploy your first website!</p>';
        return;
    }
    
    historyList.innerHTML = deploymentHistory.map(deployment => `
        <div class="history-item">
            <div class="history-info">
                <h4>Deployment ${deployment.id}</h4>
                <p>${new Date(deployment.timestamp).toLocaleString()} - ${deployment.files} files - by ${deployment.user}</p>
            </div>
            <a href="${deployment.url}" target="_blank" class="history-link">Visit Site →</a>
        </div>
    `).join('');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
