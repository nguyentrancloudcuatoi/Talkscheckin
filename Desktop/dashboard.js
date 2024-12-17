// Handle user authentication state
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateUserProfile();

    // Khởi tạo dữ liệu mẫu
    const mockData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                label: 'Số buổi dạy',
                data: [3, 4, 2, 5, 3, 2, 1],
                backgroundColor: 'rgba(14, 0, 138, 0.2)',
                borderColor: 'rgba(14, 0, 138, 1)',
                borderWidth: 2
            },
            {
                label: 'Số buổi vắng',
                data: [0, 1, 0, 0, 1, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }
        ]
    };

    // Khởi tạo biểu đồ
    const ctx = document.getElementById('teachingChart').getContext('2d');
    const teachingChart = new Chart(ctx, {
        type: 'bar',
        data: mockData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Xử lý sự kiện thay đổi period
    document.getElementById('chartPeriod').addEventListener('change', function(e) {
        updateChartData(e.target.value);
    });

    // Khởi tạo bảng dữ liệu
    initializeTable();
});

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = '/index.html';
        return;
    }
    
    const userData = localStorage.getItem('userData');
    if (!userData) {
        handleLogout();
        return;
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    window.location.href = '/index.html';
}

// Handle notifications
function toggleNotifications() {
    // Add notification functionality here
    console.log('Toggle notifications');
}

// Update user profile
function updateUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const usernameElement = document.querySelector('.username');
    const avatarElement = document.querySelector('.avatar');
    
    // Thêm role vào body
    document.body.setAttribute('data-role', userData.role || 'teacher');
    
    if (userData.name) {
        usernameElement.textContent = userData.name;
    }
    if (userData.avatar) {
        avatarElement.src = userData.avatar;
         // Thêm xử lý lỗi khi image không tải được
         avatarElement.onerror = function() {
            this.src = 'image/avatar-default.png'; // image fallback
         };
    }
}

// Handle search
document.querySelector('.search-bar input').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        performSearch(this.value);
    }
});

function performSearch(query) {
    console.log('Searching for:', query);
    // Implement search functionality here
}

// Hàm cập nhật dữ liệu biểu đồ
function updateChartData(period) {
    // Trong thực tế, sẽ gọi API để lấy dữ liệu theo period
    console.log('Updating chart for period:', period);
}

// Khởi tạo bảng dữ liệu
function initializeTable() {
    const mockTableData = [
        {
            date: '2024-01-15',
            classCode: 'ENG101',
            type: 'Online',
            lessonName: 'Basic Grammar',
            attendance: 'checked',
            status: 'present',
            duration: '2h',
            comments: 'Good session'
        },
        {
            date: '2024-01-16',
            classCode: 'ENG102',
            type: 'Offline',
            lessonName: 'Speaking Practice',
            attendance: 'unchecked',
            status: 'absent',
            duration: '1.5h',
            comments: 'Sick leave'
        }
        // Thêm dữ liệu mẫu khác nếu cần
    ];

    const tableBody = document.getElementById('teachingTableBody');
    tableBody.innerHTML = mockTableData.map(lesson => `
        <tr>
            <td>${formatDate(lesson.date)}</td>
            <td>${lesson.classCode}</td>
            <td>${lesson.type}</td>
            <td>${lesson.lessonName}</td>
            <td>
                <span class="status-badge status-${lesson.attendance}">
                    ${lesson.attendance === 'checked' ? 'Đã điểm danh' : 'Chưa điểm danh'}
                </span>
            </td>
            <td>
                <span class="status-badge status-${lesson.status}">
                    ${getStatusText(lesson.status)}
                </span>
            </td>
            <td>${lesson.duration}</td>
            <td>${lesson.comments}</td>
        </tr>
    `).join('');
}

// Hàm format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Hàm lấy text trạng thái
function getStatusText(status) {
    const statusMap = {
        'present': 'Có mặt',
        'absent': 'Vắng mặt',
        'late': 'Đi muộn'
    };
    return statusMap[status] || status;
}

// Xử lý lọc bảng
document.getElementById('filterStatus')?.addEventListener('change', function(e) {
    filterTable(e.target.value);
});

document.getElementById('filterDate')?.addEventListener('change', function(e) {
    filterTable(null, e.target.value);
});

function filterTable(status = null, date = null) {
    // Trong thực tế, sẽ gọi API để lọc dữ liệu
    console.log('Filtering table:', { status, date });
}

// Thêm sự kiện cho nút refresh
document.querySelector('.refresh-btn')?.addEventListener('click', function() {
    refreshData();
});

function refreshData() {
    // Cập nhật lại dữ liệu từ server
    initializeTable();
    updateChartData(document.getElementById('chartPeriod').value);
}

function updateMenu() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const isAdmin = userData.role === 'admin';
    const menuItems = document.querySelectorAll('.side-menu ul li');
    
    // Ẩn menu Notifications nếu không phải admin
    if (!isAdmin) {
        menuItems.forEach(item => {
            if (item.querySelector('a').href.includes('notifications.html')) {
                item.style.display = 'none';
            }
        });
    }
}