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
// Sales Report - Sử dụng API backend
// =====================
async function showSalesReport() {
    const container = document.getElementById('report-content');
    container.innerHTML = '<p style="text-align: center; padding: 40px;">⏳ Đang tải báo cáo doanh số...</p>';
    
    try {
        // Gọi API backend để lấy báo cáo doanh số
        const response = await fetchWithAuth(`${urls.reports}/sales`);
        const salesReport = await response.json();
        
        container.innerHTML = `
            <h3 style="margin-bottom: 20px;">📊 Báo cáo Doanh số Bán hàng</h3>
            
            <!-- Summary Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div style="padding: 20px; background: #e3f2fd; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tổng đơn hàng</div>
                    <div style="font-size: 2em; font-weight: 700; color: #1976d2;">${salesReport.totalOrders || 0}</div>
                </div>
                <div style="padding: 20px; background: #e8f5e9; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Đơn hoàn thành</div>
                    <div style="font-size: 2em; font-weight: 700; color: #388e3c;">${salesReport.completedOrders || 0}</div>
                </div>
                <div style="padding: 20px; background: #fff3e0; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tổng doanh thu</div>
                    <div style="font-size: 1.5em; font-weight: 700; color: #f57c00;">${(salesReport.totalRevenue || 0).toLocaleString('vi-VN')} ₫</div>
                </div>
                <div style="padding: 20px; background: #fce4ec; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tỷ lệ hoàn thành</div>
                    <div style="font-size: 2em; font-weight: 700; color: #c2185b;">${Math.round((salesReport.completionRate || 0) * 100)}%</div>
                </div>
            </div>
            
            <!-- Sales by Dealer -->
            ${salesReport.salesByDealer && salesReport.salesByDealer.length > 0 ? `
            <h4 style="margin-bottom: 15px;">📈 Doanh số theo Đại lý</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Đại lý</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Số đơn</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Doanh thu</th>
                    </tr>
                </thead>
                <tbody>
                    ${salesReport.salesByDealer.map(item => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.dealerName || 'N/A'}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600;">${item.totalOrders || 0}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600; color: #2e7d32;">${(item.totalRevenue || 0).toLocaleString('vi-VN')} ₫</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<p style="color: #999; text-align: center;">Chưa có dữ liệu doanh số theo đại lý</p>'}
        `;
    } catch (error) {
        console.error('Error loading sales report:', error);
        container.innerHTML = '<p style="color: red; text-align: center; padding: 40px;">❌ Không thể tải báo cáo doanh số. Vui lòng thử lại sau.</p>';
    }
}

// =====================
// Revenue Report - Sử dụng API backend
// =====================
async function showRevenueReport() {
    const container = document.getElementById('report-content');
    container.innerHTML = '<p style="text-align: center; padding: 40px;">⏳ Đang tải báo cáo doanh thu...</p>';
    
    try {
        // Gọi API backend ReportService
        const response = await fetchWithAuth(`${urls.reports}/dealer-payables`);
        const payablesReport = await response.json();
        
        const totalPayables = payablesReport.reduce((sum, item) => sum + (item.totalPayable || 0), 0);
        const avgPayable = payablesReport.length > 0 ? totalPayables / payablesReport.length : 0;
        
        container.innerHTML = `
            <h3 style="margin-bottom: 20px;">💰 Báo cáo Công nợ Phải thu</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div style="padding: 20px; background: #e8f5e9; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tổng công nợ</div>
                    <div style="font-size: 1.3em; font-weight: 700; color: #388e3c;">${totalPayables.toLocaleString('vi-VN')} ₫</div>
                </div>
                <div style="padding: 20px; background: #e3f2fd; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Số đại lý nợ</div>
                    <div style="font-size: 2em; font-weight: 700; color: #1976d2;">${payablesReport.length}</div>
                </div>
                <div style="padding: 20px; background: #fff3e0; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Trung bình</div>
                    <div style="font-size: 1.3em; font-weight: 700; color: #f57c00;">${avgPayable.toLocaleString('vi-VN')} ₫</div>
                </div>
            </div>
            
            <h4 style="margin-bottom: 15px;">📊 Công nợ theo Đại lý</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Đại lý</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Tổng nợ</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Đã trả</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Còn lại</th>
                    </tr>
                </thead>
                <tbody>
                    ${payablesReport.map(item => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600;">${item.dealerName || 'N/A'}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${(item.totalPayable || 0).toLocaleString('vi-VN')} ₫</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; color: #4caf50;">${(item.totalPaid || 0).toLocaleString('vi-VN')} ₫</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; color: #f44336; font-weight: 600;">${(item.remainingBalance || 0).toLocaleString('vi-VN')} ₫</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading revenue report:', error);
        container.innerHTML = '<p style="color: red; text-align: center; padding: 40px;">❌ Không thể tải báo cáo doanh thu. Vui lòng thử lại sau.</p>';
    }
}

// =====================
// Inventory Report - Sử dụng API backend
// =====================
async function showInventoryReport() {
    const container = document.getElementById('report-content');
    container.innerHTML = '<p style="text-align: center; padding: 40px;">⏳ Đang tải báo cáo tồn kho...</p>';
    
    try {
        // Gọi API backend ReportService
        const response = await fetchWithAuth(`${urls.reports}/inventory`);
        const inventoryReport = await response.json();
        
        const totalVehicles = inventoryReport.length;
        const totalQuantity = inventoryReport.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalValue = inventoryReport.reduce((sum, item) => sum + ((item.quantity || 0) * (item.retailPrice || 0)), 0);
        
        container.innerHTML = `
            <h3 style="margin-bottom: 20px;">📦 Báo cáo Tồn kho</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div style="padding: 20px; background: #e3f2fd; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Số loại xe</div>
                    <div style="font-size: 2em; font-weight: 700; color: #1976d2;">${totalVehicles}</div>
                </div>
                <div style="padding: 20px; background: #e8f5e9; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Tổng số lượng</div>
                    <div style="font-size: 2em; font-weight: 700; color: #388e3c;">${totalQuantity}</div>
                </div>
                <div style="padding: 20px; background: #fff3e0; border-radius: 8px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Giá trị kho</div>
                    <div style="font-size: 1.3em; font-weight: 700; color: #f57c00;">${totalValue.toLocaleString('vi-VN')} ₫</div>
                </div>
            </div>
            
            <h4 style="margin-bottom: 15px;">📊 Chi tiết tồn kho</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Mã xe</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Tên xe</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Đại lý</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Số lượng</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Giá bán</th>
                    </tr>
                </thead>
                <tbody>
                    ${inventoryReport.map(item => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.vehicleId || 'N/A'}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600;">${item.modelName || 'N/A'}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.dealerName || 'N/A'}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600; color: ${(item.quantity || 0) > 5 ? '#4caf50' : '#ff9800'};">${item.quantity || 0}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${(item.retailPrice || 0).toLocaleString('vi-VN')} ₫</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading inventory report:', error);
        container.innerHTML = '<p style="color: red; text-align: center; padding: 40px;">❌ Không thể tải báo cáo tồn kho. Vui lòng thử lại sau.</p>';
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
