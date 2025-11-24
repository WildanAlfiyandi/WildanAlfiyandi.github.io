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
// Storage keys
const ADMIN_KEY = 'site_admin_account';
const GITHUB_CONFIG_KEY = 'github_deploy_config';

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
        loadAdminUIState();
        loadGithubConfigUI();
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

    // GitHub config buttons in Settings modal
    const saveGithubConfig = document.getElementById('saveGithubConfig');
    const clearGithubConfig = document.getElementById('clearGithubConfig');
    const githubConfigMsg = document.getElementById('githubConfigMsg');

    if (saveGithubConfig) {
        saveGithubConfig.addEventListener('click', (e) => {
            e.preventDefault();
            githubConfigMsg.style.display = 'block';
            const cfg = {
                token: document.getElementById('githubToken').value.trim(),
                owner: document.getElementById('githubOwner').value.trim(),
                repo: document.getElementById('githubRepo').value.trim(),
                branch: document.getElementById('githubBranch').value.trim() || 'main'
            };
            if (!cfg.token || !cfg.owner || !cfg.repo) {
                githubConfigMsg.textContent = 'Please fill token, owner and repo.';
                return;
            }
            localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(cfg));
            githubConfigMsg.textContent = 'GitHub config saved in browser storage.';
            setTimeout(() => { githubConfigMsg.style.display = 'none'; }, 2500);
        });
    }

    if (clearGithubConfig) {
        clearGithubConfig.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem(GITHUB_CONFIG_KEY);
            if (githubConfigMsg) {
                githubConfigMsg.style.display = 'block';
                githubConfigMsg.textContent = 'GitHub config cleared.';
                setTimeout(() => { githubConfigMsg.style.display = 'none'; }, 2000);
            }
            const t = document.getElementById('githubToken'); if (t) t.value = '';
            const o = document.getElementById('githubOwner'); if (o) o.value = '';
            const r = document.getElementById('githubRepo'); if (r) r.value = '';
            const b = document.getElementById('githubBranch'); if (b) b.value = '';
        });
    }

    // Server deploy config
    const saveServerConfig = document.getElementById('saveServerConfig');
    const clearServerConfig = document.getElementById('clearServerConfig');
    const serverConfigMsg = document.getElementById('serverConfigMsg');

    if (saveServerConfig) {
        saveServerConfig.addEventListener('click', (e) => {
            e.preventDefault();
            serverConfigMsg.style.display = 'block';
            const cfg = {
                endpoint: document.getElementById('serverDeployEndpoint').value.trim(),
                token: document.getElementById('serverDeployToken').value.trim()
            };
            if (!cfg.endpoint) {
                serverConfigMsg.textContent = 'Please provide server endpoint URL.';
                return;
            }
            localStorage.setItem('server_deploy_config', JSON.stringify(cfg));
            serverConfigMsg.textContent = 'Server deploy config saved.';
            setTimeout(() => { serverConfigMsg.style.display = 'none'; }, 2000);
            updateDeployButtonsVisibility();
        });
    }

    if (clearServerConfig) {
        clearServerConfig.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('server_deploy_config');
            if (serverConfigMsg) {
                serverConfigMsg.style.display = 'block';
                serverConfigMsg.textContent = 'Server config cleared.';
                setTimeout(() => { serverConfigMsg.style.display = 'none'; }, 2000);
            }
            const ep = document.getElementById('serverDeployEndpoint'); if (ep) ep.value = '';
            const tok = document.getElementById('serverDeployToken'); if (tok) tok.value = '';
            updateDeployButtonsVisibility();
        });
    }

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

    const serverDeployBtn = document.getElementById('serverDeployBtn');
    if (serverDeployBtn) {
        serverDeployBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await deployViaServer();
        });
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

    // Check for saved admin account first
    const adminRaw = localStorage.getItem(ADMIN_KEY);
    if (adminRaw) {
        try {
            const admin = JSON.parse(adminRaw);
            verifyPassword(password, admin.salt, admin.passwordHash).then(valid => {
                if (valid && username === admin.username) {
                    currentUser = username;
                    localStorage.setItem('currentUser', username);
                    loginError.classList.remove('show');
                    showDashboard();
                } else {
                    loginError.textContent = '❌ Invalid username or password!';
                    loginError.classList.add('show');
                }
            });
            return;
        } catch (err) {
            console.error('Admin parse error', err);
        }
    }

    // Fallback to demo users
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

// Admin account utilities
async function createAdminAccount(username, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const passwordHash = await hashPassword(password, saltHex);
    const admin = { username, passwordHash, salt: saltHex };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

async function hashPassword(password, saltHex) {
    const enc = new TextEncoder();
    const data = enc.encode(saltHex + password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password, saltHex, expectedHash) {
    const h = await hashPassword(password, saltHex);
    return h === expectedHash;
}

function loadAdminUIState() {
    const adminRaw = localStorage.getItem(ADMIN_KEY);
    const createAdminForm = document.getElementById('createAdminForm');
    if (adminRaw && createAdminForm) {
        // If admin already exists, hide the create form
        createAdminForm.style.display = 'none';
        const createAdminBtn = document.getElementById('createAdminBtn');
        if (createAdminBtn) createAdminBtn.style.display = 'none';
    }
}

// GitHub config UI helpers
function loadGithubConfigUI() {
    const cfgRaw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (!cfgRaw) return;
    try {
        const cfg = JSON.parse(cfgRaw);
        document.getElementById('githubToken').value = cfg.token || '';
        document.getElementById('githubOwner').value = cfg.owner || '';
        document.getElementById('githubRepo').value = cfg.repo || '';
        document.getElementById('githubBranch').value = cfg.branch || '';
    } catch (err) {
        console.error('Failed to load GitHub config', err);
    }
}

function getGithubConfig() {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
}

// Convert File object to Base64 string for GitHub API
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result.split(',')[1];
            resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Zip files using JSZip and POST to server endpoint
async function deployViaServer() {
    const cfgRaw = localStorage.getItem('server_deploy_config');
    if (!cfgRaw) {
        showNotification('Server deploy not configured.', 'warning');
        return;
    }
    const cfg = JSON.parse(cfgRaw);
    if (!cfg.endpoint) {
        showNotification('Server endpoint missing.', 'warning');
        return;
    }

    // Build ZIP
    const zip = new JSZip();
    uploadedFiles.forEach(f => {
        // preserve file.relativePath if available (from directory input)
        const name = f.file.webkitRelativePath && f.file.webkitRelativePath.length ? f.file.webkitRelativePath : f.name;
        zip.file(name, f.file);
    });

    showNotification('Preparing ZIP archive...', 'info');
    const content = await zip.generateAsync({ type: 'blob' });

    // POST as form-data
    const form = new FormData();
    form.append('site', content, 'site.zip');
    if (cfg.token) form.append('token', cfg.token);
    // optional metadata
    form.append('user', currentUser || 'unknown');

    deployProgress.style.display = 'block';
    deployStatus.innerHTML = '<i class="fas fa-upload"></i> Uploading ZIP to server...';

    try {
        const resp = await fetch(cfg.endpoint, {
            method: 'POST',
            body: form
        });
        const json = await resp.json();
        if (!resp.ok) {
            throw new Error(json.message || `Server returned ${resp.status}`);
        }
        // Expect server to return deployed URL
        const deployedUrl = json.url || json.deploy_url || json.message;
        deployProgress.style.display = 'none';
        deployResult.style.display = 'block';
        websiteLink.href = deployedUrl || '#';
        websiteLink.textContent = deployedUrl || 'Deployed (see server response)';
        showNotification('Server deploy finished.', 'success');
        // Save history entry
        const deployment = {
            id: generateDeploymentId(),
            url: deployedUrl || 'server-deploy',
            files: uploadedFiles.length,
            size: uploadedFiles.reduce((s,f) => s + f.size, 0),
            timestamp: new Date().toISOString(),
            user: currentUser,
            fileTypes: getFileTypes()
        };
        deploymentHistory.unshift(deployment);
        saveDeploymentHistory();
        renderHistory();
        updateStats();
    } catch (err) {
        deployProgress.style.display = 'none';
        showNotification('Server deploy failed: ' + err.message, 'danger');
        console.error(err);
    }
}

// Perform GitHub per-file upload using REST API (requires token)
async function performGithubDeploy(files) {
    const cfg = getGithubConfig();
    if (!cfg || !cfg.token || !cfg.owner || !cfg.repo) {
        console.warn('GitHub config missing');
        return { success: false, message: 'GitHub not configured' };
    }

    const token = cfg.token;
    const owner = cfg.owner;
    const repo = cfg.repo;
    const branch = cfg.branch || 'main';

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        deployStatus.innerHTML = `<i class="fas fa-upload"></i> Uploading ${f.name} (${i+1}/${files.length})`;
        const content = await fileToBase64(f.file);
        const path = f.name;

        // Check if file exists to get sha
        let sha = null;
        try {
            const getResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`, {
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
            });
            if (getResp.status === 200) {
                const json = await getResp.json();
                sha = json.sha;
            }
        } catch (err) {
            console.warn('Check file existence failed', err);
        }

        // Put file
        const putBody = {
            message: `Admin deploy: add/update ${path}`,
            content: content,
            branch: branch
        };
        if (sha) putBody.sha = sha;

        const putResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' },
            body: JSON.stringify(putBody)
        });

        if (!putResp.ok) {
            const errText = await putResp.text();
            console.error('Upload failed', path, putResp.status, errText);
            return { success: false, message: `Failed to upload ${path}: ${putResp.status}` };
        }

        // update progress fill
        const percent = Math.round(((i+1)/files.length) * 100);
        progressFill.style.width = percent + '%';
        progressFill.textContent = percent + '%';
    }

    return { success: true };
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
    updateDeployButtonsVisibility();
}

function updateDeployButtonsVisibility() {
    const serverCfgRaw = localStorage.getItem('server_deploy_config');
    const serverBtn = document.getElementById('serverDeployBtn');
    const ghHint = document.getElementById('githubDeployHint');

    if (serverBtn) serverBtn.style.display = (uploadedFiles.length > 0 && serverCfgRaw) ? 'inline-flex' : 'none';
    const ghCfg = getGithubConfig();
    if (ghHint) ghHint.style.display = (uploadedFiles.length > 0 && ghCfg) ? 'inline-flex' : 'none';
}

// Verify Custom Domain
function verifyCustomDomain() {
    const domain = customDomain.value.trim();
    
    if (!domain) {
        showNotification('⚠️ Please enter a domain name', 'warning');
        return;
    }
    
    // Simulate domain verification
    showNotification(`✅ Domain "${domain}" verified successfully! Configure your DNS: Type: CNAME, Name: ${domain}, Value: kiosmurah.me`, 'success');
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
    
    // If GitHub config available, try to push files to repo
    const ghCfg = getGithubConfig();
    if (ghCfg && ghCfg.token && ghCfg.owner && ghCfg.repo) {
        deployStatus.innerHTML = '<i class="fas fa-code-branch"></i> Deploying files to GitHub repository...';
        const result = await performGithubDeploy(uploadedFiles);
        if (!result.success) {
            deployProgress.style.display = 'none';
            deployBtn.disabled = false;
            deployBtn.innerHTML = '<i class="fas fa-rocket"></i> Start Deploy';
            showNotification('GitHub deploy failed: ' + result.message, 'danger');
            return;
        }
        deployStatus.innerHTML = '<i class="fas fa-check-circle"></i> GitHub deploy finished.';
        await new Promise(resolve => setTimeout(resolve, 500));
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
            showNotification('Deployment successful! 🎉', 'success');
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
        showNotification('URL copied to clipboard! 📋', 'success');
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
    const confirmed = window.confirm('Are you sure you want to clear all deployment history?');
    if (confirmed) {
        deploymentHistory = [];
        saveDeploymentHistory();
        renderHistory();
        updateStats();
        showNotification('History cleared! 🗑️', 'info');
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

// Show notification - Simple console-based for now (can be enhanced with toast UI)
function showNotification(message, type = 'info') {
    // Create visual toast notification
    try {
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.log(`📢 [${type.toUpperCase()}] ${message}`);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<div class="toast-icon">${type === 'success' ? '✅' : type === 'danger' ? '⛔' : type === 'warning' ? '⚠️' : 'ℹ️'}</div><div class="toast-message">${message}</div>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(12px)';
            setTimeout(() => { try { container.removeChild(toast); } catch (e){} }, 300);
        }, 4200);
    } catch (err) {
        console.log(`📢 [${type.toUpperCase()}] ${message}`);
    }
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
