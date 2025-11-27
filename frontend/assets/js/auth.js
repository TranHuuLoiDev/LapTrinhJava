// =====================
// Authentication & Authorization Module
// =====================
import { urls, ROLES, PERMISSIONS } from './config.js';

// Auth configuration
const AUTH_API = 'http://localhost:8080/api/session';

// Get current user from localStorage
export function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Get user role
export function getUserRole() {
    const user = getCurrentUser();
    return user?.role || null;
}

// Check if user has permission
export function hasPermission(action, module) {
    const role = getUserRole();
    if (!role) return false;
    
    const permissions = PERMISSIONS[role];
    if (!permissions) return false;
    
    // Admin has all permissions
    if (permissions[action]?.includes('*')) return true;
    
    return permissions[action]?.includes(module) || false;
}

// Get menu items based on role
export function getMenuItems() {
    const role = getUserRole();
    
    if (!role) return [];
    
    const allMenus = [
        { id: 'dashboard', label: 'Dashboard Dealer', icon: '', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'evmdashboard', label: 'Dashboard EVM', icon: '', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'vehicles', label: 'Quản lý Xe', icon: '', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'customers', label: 'Khách hàng', icon: '', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'orders', label: 'Đơn hàng', icon: '', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'financing', label: 'Tài chính KH', icon: '', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'interactions', label: 'Tương tác KH', icon: '', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'testdrives', label: 'Lái thử', icon: '', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'feedbacks', label: 'Phản hồi', icon: '', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'inventory', label: 'Quản lý Kho', icon: '', roles: [ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'inventorytransactions', label: 'Lịch sử Kho', icon: '', roles: [ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'dealers', label: 'Quản lý Đại lý', icon: '', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'dealerpayments', label: 'Thanh toán ĐL', icon: '', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'promotions', label: 'Khuyến mãi', icon: '', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'wholesaleprices', label: 'Giá sỉ', icon: '', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'reports', label: 'Báo cáo', icon: '', roles: [ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] }
    ];
    
    return allMenus.filter(menu => menu.roles.includes(role));
}

// Set authentication token
export function setAuthToken(token) {
    localStorage.setItem('token', token);
}

// Get authentication token
export function getAuthToken() {
    return localStorage.getItem('token');
}

// Set user data
export function setUserData(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Clear authentication
export function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
}

// API call with auth
export async function fetchWithAuth(url, options = {}) {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        clearAuth();
        window.location.href = 'login.html';
        throw new Error('Unauthorized');
    }
    
    return response;
}

// Check authentication on page load
export function checkAuth() {
    const token = getAuthToken();
    const user = getCurrentUser();
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = 'Show';
    }
}

// Show alert message
function showAlert(message, type = 'error') {
    const alert = document.getElementById('alert');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.display = 'block';

    // Auto hide after 5 seconds
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showAlert('Please enter both username and password');
        return;
    }

    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="loading"></span>Logging in...';

    try {
        const response = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for session cookies
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Save user info to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');

            showAlert('Login successful! Redirecting...', 'success');

            // Redirect based on role
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showAlert(data.message || 'Login failed');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Connection error. Please try again.');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});

// Check if already logged in
async function checkExistingSession() {
    try {
        const response = await fetch(`${AUTH_API}/check`, {
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success && data.user) {
            // Already logged in, redirect to dashboard
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}

// Check on page load
checkExistingSession();
