document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateUserProfile();
    loadAttendanceData();
    
    // Thêm event listeners cho các bộ lọc
    document.querySelector('.apply-filters-btn').addEventListener('click', applyFilters);
    document.querySelector('.search-bar input').addEventListener('keyup', handleSearch);
});

function loadAttendanceData() {
    // Lấy dữ liệu từ localStorage
    const checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    console.log('Loading attendance data:', checkins); // Để debug
    displayAttendanceData(checkins);
}

function displayAttendanceData(data) {
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
    const searchTerm = e.target.value.toLowerCase();
    const checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    
    if (!searchTerm) {
        displayAttendanceData(checkins);
        return;
    }

    const filteredData = checkins.filter(item => 
        item.classCode.toLowerCase().includes(searchTerm) ||
        item.lessonName.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm)
    );

    displayAttendanceData(filteredData);
} 