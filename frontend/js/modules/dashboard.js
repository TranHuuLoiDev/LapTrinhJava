import { urls, ROLES } from '../config.js';
import { getCurrentUser, getUserRole } from '../auth.js';

// Utility function for fetching JSON
async function fetchJson(url) {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return res.json();
}

// =====================
// Dashboard Module - Dynamic rendering based on role
// =====================

export async function init(container, user, role) {
    // Create dashboard layout based on role
    const dashboardHTML = `
        <div class="cards">
            ${getDashboardCards(role)}
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 30px;">
            ${getCharts(role)}
        </div>
    `;
    
    container.innerHTML = dashboardHTML;
    
    // Load dashboard data
    await loadDashboardData(role);
}

function getDashboardCards(role) {
    const commonCards = `
        <div class="card">
            <h3> Tổng số xe</h3>
            <p class="stat-number" id="totalVehicles">0</p>
        </div>
        <div class="card">
            <h3> Khách hàng</h3>
            <p class="stat-number" id="totalCustomers">0</p>
        </div>
        <div class="card">
            <h3> Đơn hàng</h3>
            <p class="stat-number" id="totalOrders">0</p>
        </div>
    `;
    
    if (role === ROLES.DEALER_STAFF || role === ROLES.DEALER_MANAGER) {
        return commonCards + `
            <div class="card">
                <h3> Lái thử</h3>
                <p class="stat-number" id="totalTestDrives">0</p>
            </div>
        `;
    } else if (role === ROLES.EVM_STAFF || role === ROLES.ADMIN) {
        return commonCards + `
            <div class="card">
                <h3> Đại lý</h3>
                <p class="stat-number" id="totalDealers">0</p>
            </div>
        `;
    }
    
    return commonCards;
}

function getCharts(role) {
    return `
        <div class="chart-container">
            <h3>Thống kê bán hàng</h3>
            <canvas id="salesChart"></canvas>
        </div>
        <div class="chart-container">
            <h3>Doanh thu theo tháng</h3>
            <canvas id="revenueChart"></canvas>
        </div>
    `;
}

async function loadDashboardData(role) {
    try {
        // Load vehicles count
        const vehicles = await fetchJson(urls.vehicles);
        document.getElementById('totalVehicles').textContent = vehicles.length || 0;
        
        // Load customers count
        const customers = await fetchJson(urls.customers);
        document.getElementById('totalCustomers').textContent = customers.length || 0;
        
        // Load orders count
        const orders = await fetchJson(urls.orders);
        document.getElementById('totalOrders').textContent = orders.length || 0;
        
        // Role-specific data
        if (role === ROLES.DEALER_STAFF || role === ROLES.DEALER_MANAGER) {
            const testDrives = await fetchJson(urls.testdrives);
            document.getElementById('totalTestDrives').textContent = testDrives.length || 0;
        } else if (role === ROLES.EVM_STAFF || role === ROLES.ADMIN) {
            const dealers = await fetchJson(urls.dealers);
            document.getElementById('totalDealers').textContent = dealers.length || 0;
        }
        
        // Initialize charts
        initCharts(orders);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function initCharts(orders) {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx && typeof Chart !== 'undefined') {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
                datasets: [{
                    label: 'Số đơn hàng',
                    data: [12, 19, 15, 25, 22, 30],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && typeof Chart !== 'undefined') {
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: [1200000000, 1900000000, 1500000000, 2500000000, 2200000000, 3000000000],
                    backgroundColor: 'rgba(118, 75, 162, 0.8)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// =====================
// Legacy function for backward compatibility
// =====================
export async function loadDashboard() {
    try {
        const [v, c, o, f, t] = await Promise.all([
            fetchJson(urls.vehicles),
            fetchJson(urls.customers),
            fetchJson(urls.orders),
            fetchJson(urls.feedbacks),
            fetchJson(urls.testdrives)
        ]);

        document.getElementById("totalVehicles").textContent = `Xe: ${v.length}`;
        document.getElementById("totalCustomers").textContent = `Khách hàng: ${c.length}`;
        document.getElementById("totalOrders").textContent = `Đơn hàng: ${o.length}`;
        document.getElementById("totalFeedbacks").textContent = `Phản hồi: ${f.length}`;
        document.getElementById("totalTestDrives").textContent = `Lái thử: ${t.length}`;

        // Biểu đồ doanh thu giả lập
        const ctx = document.getElementById("salesChart");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11"],
                datasets: [{
                    label: "Doanh thu (tỷ VND)",
                    data: [5, 7, 9, 6, 10, 8],
                    backgroundColor: "#3b82f680"
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    } catch (err) {
        console.error("Lỗi Dashboard:", err);
    }
}
