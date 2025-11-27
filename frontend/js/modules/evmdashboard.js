import { urls } from '../config.js';
import { fetchJson } from './utils.js';

let salesChart = null;
let inventoryChart = null;
let performanceChart = null;

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
        const stats = await fetchJson(`${urls.base}/evm/reports/stats`);
        
        document.getElementById('evm-total-vehicles').textContent = stats.totalVehicles || 0;
        document.getElementById('evm-total-dealers').textContent = stats.totalDealers || 0;
        document.getElementById('evm-total-customers').textContent = stats.totalCustomers || 0;
        document.getElementById('evm-total-orders').textContent = stats.totalOrders || 0;
        document.getElementById('evm-total-revenue').textContent = formatCurrency(stats.totalRevenue || 0);
        document.getElementById('evm-total-inventory').textContent = stats.totalInventory || 0;
        document.getElementById('evm-completed-orders').textContent = stats.completedOrders || 0;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        alert('Failed to load dashboard statistics');
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
        const monthlySales = await fetchJson(`${urls.base}/evm/reports/monthly-sales`);
        
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
        console.log(' Loading inventory chart...');
        const inventorySummary = await fetchJson(`${urls.base}/evm/reports/inventory-summary`);
        console.log(' Inventory data:', inventorySummary);
        
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
        const performance = await fetchJson(`${urls.base}/evm/reports/dealer-performance`);
        
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
