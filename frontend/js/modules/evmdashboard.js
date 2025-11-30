import { urls } from '../config.js';
import { fetchJson } from './utils.js';

let salesChart = null;
let inventoryChart = null;
let performanceChart = null;

// Main init function for dashboard.html compatibility
export async function init(container, user, role) {
    console.log('🔷 Initializing EVM Dashboard Module...');
    
    // Create EVM dashboard layout
    const dashboardHTML = `
        <div class="cards">
            <div class="card">
                <h3>📦 Tổng số xe</h3>
                <p class="stat-number" id="evm-total-vehicles">0</p>
            </div>
            <div class="card">
                <h3>🏢 Số đại lý</h3>
                <p class="stat-number" id="evm-total-dealers">0</p>
            </div>
            <div class="card">
                <h3>👥 Khách hàng</h3>
                <p class="stat-number" id="evm-total-customers">0</p>
            </div>
            <div class="card">
                <h3>📋 Đơn hàng</h3>
                <p class="stat-number" id="evm-total-orders">0</p>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 30px;">
            <div class="chart-container">
                <h3>📈 Doanh số theo tháng (EVM)</h3>
                <canvas id="evm-sales-chart" height="250"></canvas>
            </div>
            <div class="chart-container">
                <h3>📊 Tổng quan kho hàng</h3>
                <canvas id="evm-inventory-chart" height="250"></canvas>
            </div>
            <div class="chart-container">
                <h3>🏆 Top 5 đại lý</h3>
                <canvas id="evm-performance-chart" height="250"></canvas>
            </div>
        </div>
    `;
    
    container.innerHTML = dashboardHTML;
    
    // Load data
    await initEvmDashboard();
}

export async function initEvmDashboard() {
    console.log(' Initializing EVM Dashboard...');
    
    // Kiểm tra Chart.js có sẵn không
    if (typeof Chart === 'undefined') {
        console.error(' Chart.js is not loaded!');
        alert('Lỗi: Chart.js chưa được tải. Vui lòng làm mới trang.');
        return;
    }
    
    try {
        console.log(' Loading dashboard stats...');
        await loadDashboardStats();
        console.log(' Stats loaded!');
        
        console.log(' Loading charts...');
        await loadCharts();
        console.log(' Charts loaded!');
        
        console.log(' EVM Dashboard loaded successfully!');
    } catch (error) {
        console.error(' Error initializing dashboard:', error);
        alert('Lỗi khi tải dashboard: ' + error.message);
    }
}

async function loadDashboardStats() {
    try {
        // Thêm timeout 10 giây cho API call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${urls.base}/evm/reports/stats`, {
            credentials: 'include',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const stats = await response.json();
        
        // Chỉ cập nhật các element tồn tại trong HTML (4 cards)
        const vehiclesEl = document.getElementById('evm-total-vehicles');
        const dealersEl = document.getElementById('evm-total-dealers');
        const customersEl = document.getElementById('evm-total-customers');
        const ordersEl = document.getElementById('evm-total-orders');
        
        if (vehiclesEl) vehiclesEl.textContent = stats.totalVehicles || 0;
        if (dealersEl) dealersEl.textContent = stats.totalDealers || 0;
        if (customersEl) customersEl.textContent = stats.totalCustomers || 0;
        if (ordersEl) ordersEl.textContent = stats.totalOrders || 0;
    } catch (error) {
        console.error('❌ Error loading dashboard stats:', error);
        // Hiển thị 0 thay vì alert
        document.getElementById('evm-total-vehicles').textContent = '0';
        document.getElementById('evm-total-dealers').textContent = '0';
        document.getElementById('evm-total-customers').textContent = '0';
        document.getElementById('evm-total-orders').textContent = '0';
    }
}

async function loadCharts() {
    await Promise.all([
        loadMonthlySalesChart(),
        loadInventoryChart(),
        loadDealerPerformanceChart()
    ]);
}

async function loadMonthlySalesChart() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${urls.base}/evm/reports/monthly-sales`, {
            credentials: 'include',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const monthlySales = await response.json();
        
        const labels = monthlySales.map(item => item.month);
        // Chuyển đổi sang tỷ đồng để hiển thị gọn hơn
        const data = monthlySales.map(item => item.totalSales / 1000000000);

        const ctx = document.getElementById('evm-sales-chart').getContext('2d');
        
        if (salesChart) {
            salesChart.destroy();
        }

        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh số (tỷ đồng)',
                    data: data,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' tỷ';
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
    } catch (error) {
        console.error('Error loading sales chart:', error);
    }
}

async function loadInventoryChart() {
    try {
        console.log('📊 Loading inventory chart...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${urls.base}/evm/reports/inventory-summary`, {
            credentials: 'include',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const inventorySummary = await response.json();
        console.log('📦 Inventory data:', inventorySummary);
        
        const ctx = document.getElementById('evm-inventory-chart').getContext('2d');
        
        if (inventoryChart) {
            inventoryChart.destroy();
        }

        inventoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Stock', 'Vehicle Models', 'Total Dealers'],
                datasets: [{
                    data: [
                        inventorySummary.totalStock || 0,
                        inventorySummary.totalVehicleModels || 0,
                        inventorySummary.totalDealers || 0
                    ],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(237, 100, 166, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        console.log(' Inventory chart loaded!');
    } catch (error) {
        console.error(' Error loading inventory chart:', error);
    }
}

async function loadDealerPerformanceChart() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${urls.base}/evm/reports/dealer-performance`, {
            credentials: 'include',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const performance = await response.json();
        
        const topDealers = performance.slice(0, 5);
        const labels = topDealers.map(d => d.dealerName);
        // Chuyển đổi sang tỷ đồng
        const revenues = topDealers.map(d => d.totalRevenue / 1000000000);

        const ctx = document.getElementById('evm-performance-chart').getContext('2d');
        
        if (performanceChart) {
            performanceChart.destroy();
        }

        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu (tỷ đồng)',
                    data: revenues,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Doanh thu: ' + context.parsed.y.toFixed(2) + ' tỷ';
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
    } catch (error) {
        console.error('Error loading performance chart:', error);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}
