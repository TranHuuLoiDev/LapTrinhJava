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
            <h3>🚗 Tổng số xe</h3>
            <p class="stat-number" id="totalVehicles">0</p>
        </div>
        <div class="card">
            <h3>👥 Khách hàng</h3>
            <p class="stat-number" id="totalCustomers">0</p>
        </div>
        <div class="card">
            <h3>📋 Đơn hàng</h3>
            <p class="stat-number" id="totalOrders">0</p>
        </div>
    `;
    
    // Admin thấy nhiều metrics hơn
    if (role === ROLES.ADMIN) {
        return commonCards + `
            <div class="card">
                <h3>🏢 Đại lý</h3>
                <p class="stat-number" id="totalDealers">0</p>
            </div>
            <div class="card">
                <h3>🚙 Lái thử</h3>
                <p class="stat-number" id="totalTestDrives">0</p>
            </div>
            <div class="card">
                <h3>💬 Phản hồi</h3>
                <p class="stat-number" id="totalFeedbacks">0</p>
            </div>
        `;
    } else if (role === ROLES.DEALER_STAFF || role === ROLES.DEALER_MANAGER) {
        return commonCards + `
            <div class="card">
                <h3>🚙 Lái thử</h3>
                <p class="stat-number" id="totalTestDrives">0</p>
            </div>
        `;
    } else if (role === ROLES.EVM_STAFF) {
        return commonCards + `
            <div class="card">
                <h3>🏢 Đại lý</h3>
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
        // Load common data with error handling
        let vehicles = [], customers = [], orders = [];
        
        try {
            vehicles = await fetchJson(urls.vehicles);
            document.getElementById('totalVehicles').textContent = vehicles.length || 0;
        } catch (e) {
            console.warn('Could not load vehicles:', e.message);
            document.getElementById('totalVehicles').textContent = '0';
        }
        
        try {
            customers = await fetchJson(urls.customers);
            document.getElementById('totalCustomers').textContent = customers.length || 0;
        } catch (e) {
            console.warn('Could not load customers:', e.message);
            document.getElementById('totalCustomers').textContent = '0';
        }
        
        try {
            orders = await fetchJson(urls.orders);
            document.getElementById('totalOrders').textContent = orders.length || 0;
        } catch (e) {
            console.warn('Could not load orders:', e.message);
            document.getElementById('totalOrders').textContent = '0';
        }
        
        // Role-specific data with graceful error handling
        if (role === ROLES.ADMIN) {
            // Admin sees everything - load each independently
            try {
                const dealers = await fetchJson(urls.dealers);
                document.getElementById('totalDealers').textContent = dealers.length || 0;
            } catch (e) {
                console.warn('Could not load dealers:', e.message);
                document.getElementById('totalDealers').textContent = '0';
            }
            
            try {
                const testDrives = await fetchJson(urls.testdrives);
                document.getElementById('totalTestDrives').textContent = testDrives.length || 0;
            } catch (e) {
                console.warn('Could not load test drives:', e.message);
                document.getElementById('totalTestDrives').textContent = '0';
            }
            
            try {
                const feedbacks = await fetchJson(urls.feedbacks);
                document.getElementById('totalFeedbacks').textContent = feedbacks.length || 0;
            } catch (e) {
                console.warn('Could not load feedbacks:', e.message);
                document.getElementById('totalFeedbacks').textContent = '0';
            }
        } else if (role === ROLES.DEALER_STAFF || role === ROLES.DEALER_MANAGER) {
            try {
                const testDrives = await fetchJson(urls.testdrives);
                document.getElementById('totalTestDrives').textContent = testDrives.length || 0;
            } catch (e) {
                console.warn('Could not load test drives:', e.message);
                document.getElementById('totalTestDrives').textContent = '0';
            }
        } else if (role === ROLES.EVM_STAFF) {
            try {
                const dealers = await fetchJson(urls.dealers);
                document.getElementById('totalDealers').textContent = dealers.length || 0;
            } catch (e) {
                console.warn('Could not load dealers:', e.message);
                document.getElementById('totalDealers').textContent = '0';
            }
        }
        
        // Initialize charts with available orders data
        initCharts(orders);
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
    }
}

function initCharts(orders) {
    // Process real data from orders
    const monthlySales = processMonthlyData(orders);
    
    // Sales Chart - Số đơn hàng theo tháng
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx && typeof Chart !== 'undefined') {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: monthlySales.labels,
                datasets: [{
                    label: 'Số đơn hàng',
                    data: monthlySales.orderCounts,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Số lượng đơn hàng 6 tháng gần nhất'
                    }
                },
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
    }
    
    // Revenue Chart - Doanh thu theo tháng
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && typeof Chart !== 'undefined') {
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: monthlySales.labels,
                datasets: [{
                    label: 'Doanh thu (tỷ VNĐ)',
                    data: monthlySales.revenues,
                    backgroundColor: 'rgba(118, 75, 162, 0.8)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Doanh thu 6 tháng gần nhất'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Doanh thu: ' + context.parsed.y.toFixed(2) + ' tỷ VNĐ';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + ' tỷ';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Hàm xử lý dữ liệu đơn hàng theo tháng
function processMonthlyData(orders) {
    const now = new Date();
    const monthlyData = {};
    
    // Khởi tạo 6 tháng gần nhất
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const label = `T${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyData[key] = { label, count: 0, revenue: 0 };
    }
    
    // Đếm đơn hàng và tính doanh thu theo tháng
    orders.forEach(order => {
        try {
            const orderDate = new Date(order.orderDate || order.createdAt);
            const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
            
            if (monthlyData[key]) {
                monthlyData[key].count++;
                // Tính doanh thu (giả sử mỗi đơn trung bình 1 tỷ, hoặc lấy từ totalAmount)
                const revenue = order.totalAmount ? order.totalAmount / 1000000000 : 1;
                monthlyData[key].revenue += revenue;
            }
        } catch (e) {
            console.warn('Invalid order date:', order);
        }
    });
    
    const labels = [];
    const orderCounts = [];
    const revenues = [];
    
    Object.values(monthlyData).forEach(data => {
        labels.push(data.label);
        orderCounts.push(data.count);
        revenues.push(data.revenue);
    });
    
    return { labels, orderCounts, revenues };
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
