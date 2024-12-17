function handleLogin(event) {
    event.preventDefault();
    
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return false;
    }

    // Giả lập kiểm tra role (trong thực tế sẽ check từ API)
    const isAdmin = email.includes('admin');
    
    // Lưu thông tin user và role
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify({
        name: email.split('@')[0],
        email: email,
        avatar: '/image/avatar-default.png',
        role: isAdmin ? 'admin' : 'teacher'
    }));

    window.location.href = '/Desktop/dashboard.html';
    return false;
}

function handleRegister(event) {
    event.preventDefault();
    
    // Lấy giá trị từ form đăng ký
    const formData = {
        fullName: event.target.querySelector('input[type="text"]').value,
        phone: event.target.querySelector('input[type="tel"]').value,
        email: event.target.querySelector('input[type="email"]').value,
        teacherId: event.target.querySelector('input[placeholder="Teacher ID"]').value,
        password: event.target.querySelector('input[type="password"]').value
    };

    // Lưu thông tin đăng ký (trong thực tế sẽ gọi API)
    localStorage.setItem('registeredUser', JSON.stringify(formData));
    
    // Chuyển về form đăng nhập
    showLoginForm();
}

// Kiểm tra trạng thái đăng nhập khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        window.location.href = '/Desktop/dashboard.html';
    }
});

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
} 