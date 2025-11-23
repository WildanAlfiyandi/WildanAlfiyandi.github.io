<?php
/**
 * Real-time Activity Log Viewer
 * Shows deployment activities in real-time
 */

session_start();
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    header('Location: deploy.php');
    exit;
}

// Initialize activity log if not exists
if (!isset($_SESSION['activity_log'])) {
    $_SESSION['activity_log'] = [];
}

// Handle AJAX requests for real-time updates
if (isset($_GET['ajax']) && $_GET['ajax'] === 'get_activities') {
    header('Content-Type: application/json');
    
    // Get latest activities
    $activities = array_slice(array_reverse($_SESSION['activity_log']), 0, 50);
    
    echo json_encode([
        'success' => true,
        'activities' => $activities,
        'count' => count($_SESSION['activity_log']),
        'timestamp' => time()
    ]);
    exit;
}

// Function to add activity to log
function logActivity($action, $description, $status = 'success') {
    if (!isset($_SESSION['activity_log'])) {
        $_SESSION['activity_log'] = [];
    }
    
    $_SESSION['activity_log'][] = [
        'id' => uniqid(),
        'action' => $action,
        'description' => $description,
        'status' => $status,
        'timestamp' => time(),
        'user' => $_SESSION['user'] ?? 'Unknown',
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'
    ];
    
    // Keep only last 100 activities
    if (count($_SESSION['activity_log']) > 100) {
        $_SESSION['activity_log'] = array_slice($_SESSION['activity_log'], -100);
    }
}

// Get statistics
$totalActivities = count($_SESSION['activity_log']);
$todayActivities = 0;
$successCount = 0;
$errorCount = 0;

foreach ($_SESSION['activity_log'] as $activity) {
    if (date('Y-m-d', $activity['timestamp']) === date('Y-m-d')) {
        $todayActivities++;
    }
    if ($activity['status'] === 'success') {
        $successCount++;
    } elseif ($activity['status'] === 'error') {
        $errorCount++;
    }
}

$settings = getSettings();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activity Log - <?php echo htmlspecialchars($settings['platform_name'] ?? 'Kios Murah'); ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container { max-width: 1400px; margin: 0 auto; }
        
        .header {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 { font-size: 2rem; display: flex; align-items: center; gap: 15px; }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            color: white;
            display: flex;
            align-items: center;
            gap: 20px;
            animation: slideInUp 0.5s ease;
        }
        
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .stat-icon { font-size: 3rem; opacity: 0.8; }
        .stat-content h3 { font-size: 2.5rem; font-weight: 700; margin-bottom: 5px; }
        .stat-content p { opacity: 0.9; font-size: 0.9rem; }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .card-header h2 {
            color: #667eea;
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .refresh-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #718096;
            font-size: 0.9rem;
        }
        
        .refresh-indicator.active {
            color: #48bb78;
        }
        
        .activity-list {
            max-height: 600px;
            overflow-y: auto;
        }
        
        .activity-item {
            background: #f7fafc;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 15px;
            border-left: 4px solid #cbd5e0;
            transition: all 0.3s ease;
            animation: slideInRight 0.5s ease;
        }
        
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .activity-item:hover {
            background: #edf2f7;
            transform: translateX(5px);
        }
        
        .activity-item.success { border-left-color: #48bb78; }
        .activity-item.error { border-left-color: #f56565; }
        .activity-item.warning { border-left-color: #ed8936; }
        .activity-item.info { border-left-color: #4299e1; }
        
        .activity-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .activity-action {
            font-weight: 600;
            color: #2d3748;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .activity-time {
            color: #718096;
            font-size: 0.85rem;
        }
        
        .activity-description {
            color: #4a5568;
            margin-bottom: 8px;
        }
        
        .activity-meta {
            display: flex;
            gap: 20px;
            font-size: 0.85rem;
            color: #718096;
        }
        
        .activity-meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }
        
        .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn-secondary { background: rgba(255, 255, 255, 0.2); color: white; }
        .btn-danger { background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%); color: white; }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #718096;
        }
        
        .empty-state i {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .spinning {
            animation: spin 1s linear infinite;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                <i class="fas fa-history"></i>
                Activity Log
            </h1>
            <a href="deploy.php" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </a>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-list"></i></div>
                <div class="stat-content">
                    <h3><?php echo $totalActivities; ?></h3>
                    <p>Total Activities</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-calendar-day"></i></div>
                <div class="stat-content">
                    <h3><?php echo $todayActivities; ?></h3>
                    <p>Today's Activities</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="stat-content">
                    <h3><?php echo $successCount; ?></h3>
                    <p>Successful</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="stat-content">
                    <h3><?php echo $errorCount; ?></h3>
                    <p>Errors</p>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>
                    <i class="fas fa-stream"></i>
                    Recent Activities
                </h2>
                <div class="refresh-indicator" id="refreshIndicator">
                    <i class="fas fa-sync-alt"></i>
                    <span>Auto-refresh: <span id="countdown">5</span>s</span>
                </div>
            </div>

            <div class="activity-list" id="activityList">
                <?php if (empty($_SESSION['activity_log'])): ?>
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Activities Yet</h3>
                        <p>Activities will appear here when you perform actions</p>
                    </div>
                <?php else: ?>
                    <?php foreach (array_reverse($_SESSION['activity_log']) as $activity): ?>
                        <div class="activity-item <?php echo htmlspecialchars($activity['status']); ?>">
                            <div class="activity-header">
                                <div class="activity-action">
                                    <i class="fas fa-<?php 
                                        echo $activity['status'] === 'success' ? 'check-circle' : 
                                            ($activity['status'] === 'error' ? 'times-circle' : 
                                            ($activity['status'] === 'warning' ? 'exclamation-triangle' : 'info-circle')); 
                                    ?>"></i>
                                    <?php echo htmlspecialchars($activity['action']); ?>
                                </div>
                                <div class="activity-time">
                                    <i class="far fa-clock"></i>
                                    <?php echo date('d M Y H:i:s', $activity['timestamp']); ?>
                                </div>
                            </div>
                            <div class="activity-description">
                                <?php echo htmlspecialchars($activity['description']); ?>
                            </div>
                            <div class="activity-meta">
                                <span>
                                    <i class="fas fa-user"></i>
                                    <?php echo htmlspecialchars($activity['user']); ?>
                                </span>
                                <span>
                                    <i class="fas fa-network-wired"></i>
                                    <?php echo htmlspecialchars($activity['ip']); ?>
                                </span>
                                <span>
                                    <i class="far fa-clock"></i>
                                    <?php echo date('g:i A', $activity['timestamp']); ?>
                                </span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script>
        let countdown = 5;
        let countdownInterval;
        
        // Auto-refresh function
        function refreshActivities() {
            const indicator = document.getElementById('refreshIndicator');
            const icon = indicator.querySelector('i');
            
            icon.classList.add('spinning');
            indicator.classList.add('active');
            
            fetch('?ajax=get_activities')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        updateActivityList(data.activities);
                        updateStats(data);
                    }
                    
                    icon.classList.remove('spinning');
                    setTimeout(() => {
                        indicator.classList.remove('active');
                    }, 1000);
                })
                .catch(error => {
                    console.error('Error refreshing activities:', error);
                    icon.classList.remove('spinning');
                    indicator.classList.remove('active');
                });
            
            // Reset countdown
            countdown = 5;
        }
        
        // Update activity list
        function updateActivityList(activities) {
            const list = document.getElementById('activityList');
            
            if (activities.length === 0) {
                list.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Activities Yet</h3>
                        <p>Activities will appear here when you perform actions</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            activities.forEach(activity => {
                const icon = activity.status === 'success' ? 'check-circle' : 
                            (activity.status === 'error' ? 'times-circle' : 
                            (activity.status === 'warning' ? 'exclamation-triangle' : 'info-circle'));
                
                const date = new Date(activity.timestamp * 1000);
                const timeStr = date.toLocaleString('id-ID');
                
                html += `
                    <div class="activity-item ${activity.status}">
                        <div class="activity-header">
                            <div class="activity-action">
                                <i class="fas fa-${icon}"></i>
                                ${activity.action}
                            </div>
                            <div class="activity-time">
                                <i class="far fa-clock"></i>
                                ${timeStr}
                            </div>
                        </div>
                        <div class="activity-description">
                            ${activity.description}
                        </div>
                        <div class="activity-meta">
                            <span>
                                <i class="fas fa-user"></i>
                                ${activity.user}
                            </span>
                            <span>
                                <i class="fas fa-network-wired"></i>
                                ${activity.ip}
                            </span>
                            <span>
                                <i class="far fa-clock"></i>
                                ${date.toLocaleTimeString('id-ID')}
                            </span>
                        </div>
                    </div>
                `;
            });
            
            list.innerHTML = html;
        }
        
        // Update stats (if needed in future)
        function updateStats(data) {
            // Can be implemented to update statistics in real-time
        }
        
        // Countdown timer
        function updateCountdown() {
            document.getElementById('countdown').textContent = countdown;
            countdown--;
            
            if (countdown < 0) {
                refreshActivities();
            }
        }
        
        // Start auto-refresh
        countdownInterval = setInterval(updateCountdown, 1000);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(countdownInterval);
        });
        
        console.log('%c📊 Activity Log Viewer', 'font-size: 20px; color: #667eea; font-weight: bold;');
        console.log('%cReal-time auto-refresh enabled', 'font-size: 14px; color: #48bb78;');
    </script>
</body>
</html>
