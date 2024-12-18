document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    checkPermission();
    updateUserProfile();
    loadAttendanceData();
    
    // Add event listeners for filters
    document.querySelector('.apply-filters-btn').addEventListener('click', applyFilters);
    document.querySelector('.search-bar input').addEventListener('keyup', handleSearch);
});

function loadAttendanceData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const isAdmin = userData.role === 'admin';
    
    // Retrieve data from localStorage
    const checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    
    if (isAdmin) {
        displayAdminAttendanceData(checkins);
    } else {
        // Filter checkins for current teacher
        const teacherCheckins = checkins.filter(item => item.email === userData.email);
        displayTeacherAttendanceData(teacherCheckins);
    }
}

function displayAdminAttendanceData(data) {
    const tableBody = document.getElementById('attendanceTableBody');
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">No attendance data available</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = data.map(item => {
        return `
            <tr>
                <td>${formatDate(item.timestamp)}</td>
                <td>${item.classCode}</td>
                <td>${formatTeachingMethod(item.teachingMethod)}</td>
                <td>${item.lessonName}</td>
                <td>
                    <span class="status-badge status-${getStatusClass(item.attendanceStatus)}">
                        ${getStatusText(item.attendanceStatus)}
                    </span>
                </td>
                <td>${item.attendanceStatus === 'present' ? 'Marked as attended' : 'Not yet marked'}</td>
                <td>${item.duration || '-'}</td>
                <td>${item.comments || '-'}</td>
            </tr>
        `;
    }).join('');
}

function displayTeacherAttendanceData(data) {
    const tableBody = document.getElementById('attendanceTableBody');
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">No attendance data available</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = data.map(item => {
        return `
            <tr>
                <td>${formatDate(item.timestamp)}</td>
                <td>${item.classCode}</td>
                <td>${formatTeachingMethod(item.teachingMethod)}</td>
                <td>${item.lessonName}</td>
                <td>
                    <span class="status-badge status-${getStatusClass(item.attendanceStatus)}">
                        ${getStatusText(item.attendanceStatus)}
                    </span>
                </td>
                <td>${item.attendanceStatus === 'present' ? 'Marked as attended' : 'Not yet marked'}</td>
                <td>${item.duration || '-'}</td>
                <td>${item.comments || '-'}</td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Change to your preferred format
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
        'present': 'Present',
        'absent_notice': 'Absent with notice',
        'absent_no_notice': 'Absent without notice',
        'off': 'Teacher off'
    };
    return statusMap[status] || 'Undefined';
}

function applyFilters() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const attendanceStatus = document.getElementById('attendanceFilter').value;
    const absentStatus = document.getElementById('absentFilter').value;

    let checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    
    // Apply filters
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

function checkPermission() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.role !== 'teacher' && userData.role !== 'admin') {
        window.location.href = '/Desktop/dashboard.html';
        return;
    }
    
    // Set role attribute on body
    document.body.setAttribute('data-role', userData.role);
    
    // Show or hide admin-only elements
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(element => {
        if (userData.role === 'admin') {
            element.style.display = 'block'; // Show for admin
        } else {
            element.style.display = 'none'; // Hide for others
        }
    });
}

function closeModal() {
    const modal = document.getElementById('teacherDetailsModal');
    modal.style.display = 'none'; // Hide the modal
} 