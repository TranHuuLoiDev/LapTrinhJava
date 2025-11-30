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
        { id: 'dashboard', label: 'Dashboard Dealer', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'evmdashboard', label: 'Dashboard EVM', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'vehicles', label: 'Quản lý Xe', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'vehiclecomparison', label: 'So sánh Xe', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER] },
        { id: 'customers', label: 'Khách hàng', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'Salesorders', label: 'Đơn hàng', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'testdrives', label: 'Lái thử', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'feedbacks', label: 'Phản hồi', roles: [ROLES.DEALER_STAFF, ROLES.DEALER_MANAGER, ROLES.ADMIN] },
        { id: 'inventory', label: 'Quản lý Kho', roles: [ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'inventorytransactions', label: 'Lịch sử Kho', roles: [ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'dealers', label: 'Quản lý Đại lý', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'dealerpayments', label: 'Thanh toán ĐL', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'promotions', label: 'Khuyến mãi', roles: [ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'wholesaleprices', label: 'Giá sỉ', roles: [ROLES.EVM_STAFF, ROLES.ADMIN] },
        { id: 'reports', label: 'Báo cáo', roles: [ROLES.DEALER_MANAGER, ROLES.EVM_STAFF, ROLES.ADMIN] }
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

// API call with auth (session-based)
export async function fetchWithAuth(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include' // Important for session cookies
    });
    
    if (response.status === 401) {
        clearAuth();
        window.location.href = '../index.html';
        throw new Error('Unauthorized');
    }
    
    return response;
}

// Check authentication on page load
export function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = getCurrentUser();
    
    if (isLoggedIn !== 'true' || !user) {
        return false;
    }
    
    return true;
}

// End of auth.js module
// Note: Login form handling is in index.html (login page), not here
