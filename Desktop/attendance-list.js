document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateUserProfile();
    loadAttendanceData();
    
    // Thêm event listeners cho các bộ lọc
    document.querySelector('.apply-filters-btn').addEventListener('click', applyFilters);
    document.querySelector('.search-bar input').addEventListener('keyup', handleSearch);
});

function loadAttendanceData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const isAdmin = userData.role === 'admin';
    
    // Lấy dữ liệu từ localStorage
    const checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    
    if (isAdmin) {
        displayAdminAttendanceData(checkins);
    } else {
        displayTeacherAttendanceData(checkins);
    }
}

function displayAdminAttendanceData(data) {
    const tableBody = document.getElementById('attendanceTableBody');
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="no-data">Không có dữ liệu điểm danh</td>
            </tr>
        `;
        return;
    }

    // Nhóm dữ liệu theo giáo viên
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.email]) {
            acc[item.email] = [];
        }
        acc[item.email].push(item);
        return acc;
    }, {});

    // Hiển thị dữ liệu theo giáo viên
    tableBody.innerHTML = Object.entries(groupedData).map(([email, items]) => {
        const latestItem = items[0];
        const totalClasses = items.length;
        const checkedClasses = items.filter(item => item.status === 'checked').length;
        
        return `
            <tr>
                <td>${email}</td>
                <td>${latestItem.teacherName || email.split('@')[0]}</td>
                <td>${totalClasses}</td>
                <td>${checkedClasses}</td>
                <td>${totalClasses - checkedClasses}</td>
                <td>
                    <span class="status-badge status-${getTeacherStatusClass(checkedClasses, totalClasses)}">
                        ${getTeacherStatusText(checkedClasses, totalClasses)}
                    </span>
                </td>
                <td>${formatDate(latestItem.lessonDate)}</td>
                <td>${latestItem.comments || '-'}</td>
                <td>
                    <button onclick="viewTeacherDetails('${email}')" class="view-details-btn">
                        <i class="fas fa-eye"></i> Chi tiết
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function getTeacherStatusClass(checked, total) {
    const ratio = checked / total;
    if (ratio === 1) return 'completed';
    if (ratio >= 0.7) return 'good';
    if (ratio >= 0.4) return 'warning';
    return 'danger';
}

function getTeacherStatusText(checked, total) {
    const ratio = checked / total;
    if (ratio === 1) return 'Đã điểm danh đầy đủ';
    if (ratio >= 0.7) return 'Điểm danh tốt';
    if (ratio >= 0.4) return 'Cần cải thiện';
    return 'Chưa điểm danh nhiều';
}

function viewTeacherDetails(email) {
    const checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    const teacherCheckins = checkins.filter(item => item.email === email);
    
    // Hiển thị modal chi tiết
    const modal = document.getElementById('teacherDetailsModal');
    const modalContent = document.querySelector('.teacher-details-content');
    
    modalContent.innerHTML = `
        <h3>Chi tiết điểm danh - ${email}</h3>
        <table class="details-table">
            <thead>
                <tr>
                    <th>Ngày</th>
                    <th>Mã lớp</th>
                    <th>Buổi học</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                </tr>
            </thead>
            <tbody>
                ${teacherCheckins.map(item => `
                    <tr>
                        <td>${formatDate(item.lessonDate)}</td>
                        <td>${item.classCode}</td>
                        <td>${item.lessonName}</td>
                        <td>
                            <span class="status-badge status-${item.status || 'unchecked'}">
                                ${item.status === 'checked' ? 'Đã điểm danh' : 'Chưa điểm danh'}
                            </span>
                        </td>
                        <td>${item.comments || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    modal.style.display = 'block';
}

function displayTeacherAttendanceData(data) {
    const tableBody = document.getElementById('attendanceTableBody');
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">Không có dữ liệu điểm danh</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = data.map(item => {
        console.log('Processing item:', item); // Để debug
        return `
            <tr>
                <td>${formatDate(item.lessonDate)}</td>
                <td>${item.classCode}</td>
                <td>${formatTeachingMethod(item.teachingMethod)}</td>
                <td>${item.lessonName}</td>
                <td>
                    <span class="status-badge status-${item.status || 'unchecked'}">
                        ${item.status === 'checked' ? 'Đã điểm danh' : 'Chưa điểm danh'}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${getStatusClass(item.attendanceStatus)}">
                        ${getStatusText(item.attendanceStatus)}
                    </span>
                </td>
                <td>${item.duration} phút</td>
                <td>${item.comments || '-'}</td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function formatTeachingMethod(method) {
    return method.charAt(0).toUpperCase() + method.slice(1);
}

function getStatusClass(status) {
    const statusMap = {
        'present': 'checked',
        'absent_notice': 'absent',
        'absent_no_notice': 'absent',
        'off': 'off'
    };
    return statusMap[status] || 'unchecked';
}

function getStatusText(status) {
    const statusMap = {
        'present': 'Có mặt',
        'absent_notice': 'Vắng có phép',
        'absent_no_notice': 'Vắng không phép',
        'off': 'Nghỉ học'
    };
    return statusMap[status] || 'Không xác định';
}

function applyFilters() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const attendanceStatus = document.getElementById('attendanceFilter').value;
    const absentStatus = document.getElementById('absentFilter').value;

    let checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    
    // Áp dụng các bộ lọc
    checkins = checkins.filter(item => {
        let matches = true;
        
        if (startDate && item.lessonDate < startDate) matches = false;
        if (endDate && item.lessonDate > endDate) matches = false;
        if (attendanceStatus && getStatusClass(item.attendanceStatus) !== attendanceStatus) matches = false;
        if (absentStatus && item.attendanceStatus !== absentStatus) matches = false;
        
        return matches;
    });

    displayAttendanceData(checkins);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (!searchTerm) {
        loadAttendanceData();
        return;
    }

    const checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    const filteredData = checkins.filter(item => 
        (item.classCode && item.classCode.toLowerCase().includes(searchTerm)) ||
        (item.lessonName && item.lessonName.toLowerCase().includes(searchTerm)) ||
        (item.email && item.email.toLowerCase().includes(searchTerm))
    );

    displayAttendanceData(filteredData);
}

function updateUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const usernameElement = document.querySelector('.username');
    if (usernameElement && userData.name) {
        usernameElement.textContent = userData.name;
    }
}

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