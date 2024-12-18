document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    checkPermission();
    updateUserProfile();
    prefillUserData();
    checkSavedData();
    const logoutBtn = document.querySelector('.logout-btn button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
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

function prefillUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Prefill and lock email field
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.value = userData.email || '';
        // Only admin can edit other users' data
        if (userData.role !== 'admin') {
            emailInput.readOnly = true;
        }
    }
}

function handleCheckin(event) {
    event.preventDefault();
    
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.role !== 'teacher' && userData.role !== 'admin') {
        alert('You do not have permission to perform this action!');
        return false;
    }
    
    // Validate required fields
    const requiredFields = ['email', 'classCode', 'teachingMethod', 'session', 'materials', 'lessonNumber', 'lessonName', 'state', 'duration', 'vietnameseTime', 'attendanceStatus'];
    const missingFields = requiredFields.filter(field => !document.getElementById(field).value);
    
    if (missingFields.length > 0) {
        alert('Please fill in all required fields');
        return false;
    }
    
    const formData = {
        email: document.getElementById('email').value,
        classCode: document.getElementById('classCode').value,
        teachingMethod: document.getElementById('teachingMethod').value,
        session: document.getElementById('session').value,
        materials: document.getElementById('materials').value,
        lessonNumber: document.getElementById('lessonNumber').value,
        lessonName: document.getElementById('lessonName').value,
        state: document.getElementById('state').value,
        duration: document.getElementById('duration').value,
        vietnameseTime: document.getElementById('vietnameseTime').value,
        attendanceStatus: document.getElementById('attendanceStatus').value || 'present',
        comments: document.getElementById('comments').value,
        timestamp: new Date().toISOString(),
        status: 'checked'
    };

    try {
        let checkins = JSON.parse(localStorage.getItem('checkins')) || [];
        checkins.unshift(formData);
        localStorage.setItem('checkins', JSON.stringify(checkins));
        console.log('Saved checkin data:', formData);
        alert('Check-in successful!');
        window.location.href = 'attendance-list.html';
    } catch (error) {
        console.error('Error saving checkin:', error);
        alert('An error occurred, please try again!');
    }
    
    return false;
}

function requestEdit() {
    // Trong thực tế sẽ gửi yêu cầu chỉnh sửa lên server
    alert('Edit request has been sent to admin for approval.');
}

function checkSavedData() {
    const checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    console.log('Current checkins data:', checkins);
}

function updateUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const usernameElement = document.querySelector('.username');
    if (usernameElement && userData.name) {
        usernameElement.textContent = userData.name;
    }
}

function checkPermission() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.role !== 'teacher' && userData.role !== 'admin') {
        window.location.href = '/Desktop/dashboard.html';
        return;
    }
    
    // Set role attribute on body
    document.body.setAttribute('data-role', userData.role);
}
