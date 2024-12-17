document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateUserProfile();
    prefillUserData();
    checkSavedData();
});

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = '../Sign/auth.html';
        return;
    }
    
    const userData = localStorage.getItem('userData');
    if (!userData) {
        handleLogout();
        return;
    }
}

function handleLogout() {
    // Clear user session
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    
    // Sửa lại đường dẫn để trỏ về đúng trang auth.html
    window.location.href = '../Sign/auth.html';
}

function prefillUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.email) {
        document.getElementById('email').value = userData.email;
    }
}

function handleCheckin(event) {
    event.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        classCode: document.getElementById('classCode').value,
        teachingMethod: document.getElementById('teachingMethod').value,
        session: document.getElementById('session').value,
        lessonNumber: document.getElementById('lessonNumber').value,
        lessonName: document.getElementById('lessonName').value,
        lessonDate: document.getElementById('lessonDate').value,
        duration: document.getElementById('duration').value,
        attendanceStatus: document.getElementById('attendanceStatus').value,
        comments: document.getElementById('comments').value,
        timestamp: new Date().toISOString(),
        status: 'checked'
    };

    let checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    
    checkins.unshift(formData);
    
    localStorage.setItem('checkins', JSON.stringify(checkins));

    console.log('Saved checkin data:', formData);
    
    alert('Check-in submitted successfully!');
    window.location.href = 'attendance-list.html';
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
