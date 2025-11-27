// =====================
// Reports Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, getUserRole } from '../auth.js';
import { ROLES } from '../config.js';

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    const role = getUserRole();
    
    container.innerHTML = `
        <div style="margin-bottom: 30px;">
            <h2 style="margin-bottom: 20px;"> Báo cáo & Thống kê</h2>
            
            <!-- Report Type Selection -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div class="report-card" onclick="window.reportsModule.showSalesReport()" style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; cursor: pointer; text-align: center;">
                    <div style="font-size: 2em; margin-bottom: 10px;"></div>
                    <h3 style="margin: 0;">Báo cáo Doanh số</h3>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 0.9em;">Theo nhân viên & thời gian</p>
                </div>
                
                <div class="report-card" onclick="window.reportsModule.showRevenueReport()" style="padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 8px; cursor: pointer; text-align: center;">
                    <div style="font-size: 2em; margin-bottom: 10px;"></div>
                    <h3 style="margin: 0;">Báo cáo Doanh thu</h3>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 0.9em;">Theo tháng & quý</p>
                </div>
                
                <div class="report-card" onclick="window.reportsModule.showInventoryReport()" style="padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 8px; cursor: pointer; text-align: center;">
                    <div style="font-size: 2em; margin-bottom: 10px;"></div>
                    <h3 style="margin: 0;">Báo cáo Tồn kho</h3>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 0.9em;">Theo xe & đại lý</p>
                </div>
                
                ${role === ROLES.DEALER_MANAGER || role === ROLES.ADMIN ? `
                <div class="report-card" onclick="window.reportsModule.showDebtReport()" style="padding: 20px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; border-radius: 8px; cursor: pointer; text-align: center;">
                    <div style="font-size: 2em; margin-bottom: 10px;"></div>
                    <h3 style="margin: 0;">Báo cáo Công nợ</h3>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 0.9em;">Khách hàng & hãng xe</p>
                </div>
                ` : ''}
            </div>
        </div>
        
        <!-- Report Content Area -->
        <div id="report-content" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="text-align: center; color: #666; padding: 40px;">Chọn loại báo cáo ở trên để xem chi tiết</p>
        </div>
    `;
    
    // Expose functions to window
    window.reportsModule = {
        showSalesReport,
        showRevenueReport,
        showInventoryReport,
        showDebtReport
    };
}

// =====================
// Sales Report
// =====================
async function showSalesReport() {
    const container = document.getElementById('report-content');
    container.innerHTML = '<p style="text-align: center; padding: 40px;">Đang tải báo cáo...</p>';
    
    try {
        const orders = await fetchWithAuth(urls.orders).then(r => r.json());
        const customers = await fetchWithAuth(urls.customers).then(r => r.json());
        
        // Calculate sales by staff (mock data - you need user/staff info)
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const completedOrders = orders.filter(o => o.status === 'Delivered').length;
        
        // Group by month
        const salesByMonth = {};
        orders.forEach(order => {
            if (order.orderDate) {
                const month = new Date(order.orderDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' });
                salesByMonth[month] = (salesByMonth[month] || 0) + 1;
            }
        });
        
        container.innerHTML = `
            <h3 style="margin-bottom: 20px;"> Báo cáo Doanh số Bán hàng</h3>
            
            <!-- Summary Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div style="padding: 20px; background: #e3f2fd; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tổng đơn hàng</div>
                    <div style="font-size: 2em; font-weight: 700; color: #1976d2;">${totalOrders}</div>
                </div>
                <div style="padding: 20px; background: #e8f5e9; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Đơn hoàn thành</div>
                    <div style="font-size: 2em; font-weight: 700; color: #388e3c;">${completedOrders}</div>
                </div>
                <div style="padding: 20px; background: #fff3e0; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tổng doanh thu</div>
                    <div style="font-size: 1.5em; font-weight: 700; color: #f57c00;">${totalRevenue.toLocaleString('vi-VN')} ₫</div>
                </div>
                <div style="padding: 20px; background: #fce4ec; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tỷ lệ hoàn thành</div>
                    <div style="font-size: 2em; font-weight: 700; color: #c2185b;">${totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%</div>
                </div>
            </div>
            
            <!-- Sales by Month -->
            <h4 style="margin-bottom: 15px;">Doanh số theo tháng</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Tháng</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Số đơn hàng</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(salesByMonth).map(([month, count]) => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${month}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600;">${count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <!-- Recent Orders -->
            <h4 style="margin-bottom: 15px;">Đơn hàng gần đây</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">ID</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Ngày đặt</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Tổng tiền</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.slice(0, 10).map(order => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">#${order.orderId}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600;">${(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                                <span style="padding: 4px 12px; background: ${getOrderStatusColor(order.status)}; color: white; border-radius: 12px; font-size: 0.85em;">
                                    ${order.status}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading sales report:', error);
        container.innerHTML = '<p style="color: red; text-align: center; padding: 40px;">Không thể tải báo cáo doanh số</p>';
    }
}

// =====================
// Revenue Report
// =====================
async function showRevenueReport() {
    const container = document.getElementById('report-content');
    container.innerHTML = '<p style="text-align: center; padding: 40px;">Đang tải báo cáo...</p>';
    
    try {
        const orders = await fetchWithAuth(urls.orders).then(r => r.json());
        
        // Calculate revenue by month
        const revenueByMonth = {};
        const currentYear = new Date().getFullYear();
        
        orders.forEach(order => {
            if (order.orderDate && order.totalAmount) {
                const date = new Date(order.orderDate);
                if (date.getFullYear() === currentYear) {
                    const month = date.getMonth() + 1;
                    revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalAmount;
                }
            }
        });
        
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
            month: `Tháng ${i + 1}`,
            revenue: revenueByMonth[i + 1] || 0
        }));
        
        const totalYearRevenue = Object.values(revenueByMonth).reduce((sum, val) => sum + val, 0);
        const avgMonthlyRevenue = totalYearRevenue / 12;
        
        container.innerHTML = `
            <h3 style="margin-bottom: 20px;"> Báo cáo Doanh thu ${currentYear}</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div style="padding: 20px; background: #e8f5e9; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tổng doanh thu năm</div>
                    <div style="font-size: 1.3em; font-weight: 700; color: #388e3c;">${totalYearRevenue.toLocaleString('vi-VN')} ₫</div>
                </div>
                <div style="padding: 20px; background: #e3f2fd; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Trung bình/tháng</div>
                    <div style="font-size: 1.3em; font-weight: 700; color: #1976d2;">${avgMonthlyRevenue.toLocaleString('vi-VN')} ₫</div>
                </div>
            </div>
            
            <h4 style="margin-bottom: 15px;">Doanh thu theo tháng</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Tháng</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Doanh thu</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Tăng trưởng</th>
                    </tr>
                </thead>
                <tbody>
                    ${monthlyRevenue.map((item, index) => {
                        const prevRevenue = index > 0 ? monthlyRevenue[index - 1].revenue : 0;
                        const growth = prevRevenue > 0 ? ((item.revenue - prevRevenue) / prevRevenue * 100).toFixed(1) : 0;
                        return `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.month}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600;">${item.revenue.toLocaleString('vi-VN')} ₫</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; color: ${growth >= 0 ? '#4caf50' : '#ef5350'};">
                                ${growth >= 0 ? '+' : ''}${growth}%
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading revenue report:', error);
        container.innerHTML = '<p style="color: red; text-align: center; padding: 40px;">Không thể tải báo cáo doanh thu</p>';
    }
}

// =====================
// Inventory Report
// =====================
async function showInventoryReport() {
    const container = document.getElementById('report-content');
    container.innerHTML = '<p style="text-align: center; padding: 40px;">Đang tải báo cáo...</p>';
    
    try {
        const vehicles = await fetchWithAuth(urls.vehicles).then(r => r.json());
        
        const totalVehicles = vehicles.length;
        const availableVehicles = vehicles.filter(v => v.status === 'Available' || !v.status).length;
        
        container.innerHTML = `
            <h3 style="margin-bottom: 20px;"> Báo cáo Tồn kho</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div style="padding: 20px; background: #e3f2fd; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tổng số xe</div>
                    <div style="font-size: 2em; font-weight: 700; color: #1976d2;">${totalVehicles}</div>
                </div>
                <div style="padding: 20px; background: #e8f5e9; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Xe có sẵn</div>
                    <div style="font-size: 2em; font-weight: 700; color: #388e3c;">${availableVehicles}</div>
                </div>
            </div>
            
            <h4 style="margin-bottom: 15px;">Chi tiết tồn kho</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">ID</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Tên xe</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Màu sắc</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Giá bán</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${vehicles.map(vehicle => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${vehicle.vehicleId}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600;">${vehicle.modelName || 'N/A'}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${vehicle.color || 'N/A'}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${(vehicle.retailPrice || 0).toLocaleString('vi-VN')} ₫</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                                <span style="padding: 4px 12px; background: ${vehicle.status === 'Available' ? '#4caf50' : '#ff9800'}; color: white; border-radius: 12px; font-size: 0.85em;">
                                    ${vehicle.status || 'Available'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading inventory report:', error);
        container.innerHTML = '<p style="color: red; text-align: center; padding: 40px;">Không thể tải báo cáo tồn kho</p>';
    }
}

// =====================
// Debt Report
// =====================
async function showDebtReport() {
    const container = document.getElementById('report-content');
    container.innerHTML = `
        <h3 style="margin-bottom: 20px;"> Báo cáo Công nợ</h3>
        <p style="text-align: center; padding: 40px; color: #666;">Chức năng đang được phát triển. Vui lòng quay lại sau.</p>
    `;
}

// =====================
// Helper Functions
// =====================
function getOrderStatusColor(status) {
    const colors = {
        'Pending': '#ff9800',
        'Processing': '#2196f3',
        'Confirmed': '#4caf50',
        'Delivered': '#8bc34a',
        'Cancelled': '#f44336'
    };
    return colors[status] || '#9e9e9e';
}
