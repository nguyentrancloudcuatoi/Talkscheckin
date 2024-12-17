document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    checkPermission();
    updateUserProfile();
    loadNotifications();
});

function loadNotifications() {
    // Trong thực tế, sẽ lấy dữ liệu từ API
    const notifications = [
        {
            type: 'approved',
            title: 'Công đã được phê duyệt',
            details: {
                date: '2024-01-15',
                class: 'ENG101',
                status: 'Đã phê duyệt',
                comments: 'Thông tin đầy đủ, chính xác'
            },
            time: '2 giờ trước'
        },
        {
            type: 'pending',
            title: 'Chưa được phê duyệt',
            details: {
                date: '2024-01-16',
                class: 'ENG102',
                status: 'Đang chờ',
                comments: 'Đang chờ quản lý xem xét'
            },
            time: '5 giờ trước'
        },
        {
            type: 'update',
            title: 'Cần cập nhật thông tin',
            details: {
                date: '2024-01-17',
                class: 'ENG103',
                status: 'Yêu cầu cập nhật',
                comments: 'Vui lòng bổ sung giáo trình sử dụng'
            },
            time: '1 ngày trước'
        }
    ];

    displayNotifications(notifications);
}

function displayNotifications(notifications) {
    const container = document.getElementById('notificationsList');
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item">
            <div class="notification-icon status-${notification.type}">
                <i class="fas ${getIconForType(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-details">
                    Ngày: ${notification.details.date}<br>
                    Lớp: ${notification.details.class}<br>
                    Trạng thái: ${notification.details.status}<br>
                    Ghi chú: ${notification.details.comments}
                </div>
                <div class="notification-time">${notification.time}</div>
            </div>
        </div>
    `).join('');
}

function getIconForType(type) {
    const icons = {
        approved: 'fa-check-circle',
        pending: 'fa-clock',
        update: 'fa-exclamation-circle'
    };
    return icons[type] || 'fa-bell';
}

function openNotificationSettings() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveNotificationSettings() {
    const systemNotifications = document.getElementById('systemNotifications').checked;
    const emailNotifications = document.getElementById('emailNotifications').checked;
    
    // Trong thực tế, sẽ lưu settings lên server
    localStorage.setItem('notificationSettings', JSON.stringify({
        system: systemNotifications,
        email: emailNotifications
    }));
    
    alert('Notification settings saved!');
    closeModal();
}

function checkPermission() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.role !== 'admin') {
        window.location.href = '/Desktop/dashboard.html';
        return;
    }
} 