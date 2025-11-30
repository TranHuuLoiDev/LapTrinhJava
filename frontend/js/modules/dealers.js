// =====================
// Dealers Management Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allDealers = [];

// =====================
// Init function for dashboard
// =====================
export async function init(container, user, role) {
    container.innerHTML = `
        <h2 style="margin-bottom: 20px;">Quản lý Đại lý</h2>
        <div style="margin-bottom: 20px;">
            <button onclick="window.dealersModule.showAddForm()" class="btn-primary" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                ➕ Thêm đại lý mới
            </button>
        </div>
        <div id="dealers-list">⏳ Đang tải dữ liệu đại lý...</div>
        <div id="dealers-form" style="display: none;"></div>
    `;
    
    // Expose functions to window
    window.dealersModule = {
        showAddForm,
        editDealer,
        deleteDealer,
        saveDealer,
        cancelForm,
        loadDealers  // Thêm để có thể gọi từ button retry
    };
    
    window.editDealer = editDealer;
    window.deleteDealer = deleteDealer;
    
    await loadDealers();
}

// =====================
// Load Dealers
// =====================
export async function loadDealers() {
    const listContainer = document.getElementById('dealers-list');
    try {
        console.log('🔍 Loading dealers from:', urls.dealers);
        const response = await fetchWithAuth(urls.dealers);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        allDealers = await response.json();
        console.log('✅ Loaded dealers:', allDealers.length);
        displayDealers(allDealers);
    } catch (error) {
        console.error('❌ Error loading dealers:', error);
        listContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;">
                <p style="color: #856404; font-size: 1.1em; margin-bottom: 10px;">⚠️ Không thể tải dữ liệu đại lý</p>
                <p style="color: #666; font-size: 0.9em;">Lỗi: ${error.message}</p>
                <button onclick="window.dealersModule.loadDealers()" style="margin-top: 15px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔄 Thử lại
                </button>
            </div>
        `;
    }
}

function displayDealers(dealers) {
    const container = document.getElementById('dealers-list');
    
    if (!dealers || dealers.length === 0) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666;">
                <p style="font-size: 1.2em; margin-bottom: 10px;">📋 Không có dữ liệu đại lý</p>
                <button onclick="window.dealersModule.showAddForm()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ➕ Thêm đại lý đầu tiên
                </button>
            </div>
        `;
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'dealers');
    const canDelete = hasPermission('canDelete', 'dealers');
    
    const html = `
        <table class="data-table" style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <th style="padding: 12px; text-align: left;">ID</th>
                    <th style="padding: 12px; text-align: left;">Tên đại lý</th>
                    <th style="padding: 12px; text-align: left;">Địa chỉ</th>
                    <th style="padding: 12px; text-align: left;">Điện thoại</th>
                    <th style="padding: 12px; text-align: left;">Ngày ký hợp đồng</th>
                    <th style="padding: 12px; text-align: right;">Chỉ tiêu doanh số</th>
                    <th style="padding: 12px; text-align: left;">Trạng thái</th>
                    ${canEdit || canDelete ? '<th style="padding: 12px; text-align: center;">Hành động</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${dealers.map(dealer => `
                    <tr style="border-bottom: 1px solid #eee; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                        <td style="padding: 12px; font-weight: 600; color: #667eea;">${dealer.dealerId || 'N/A'}</td>
                        <td style="padding: 12px; font-weight: 600;">${dealer.dealerName || 'N/A'}</td>
                        <td style="padding: 12px;">${dealer.address || 'Chưa có'}</td>
                        <td style="padding: 12px;">${dealer.phone || 'Chưa có'}</td>
                        <td style="padding: 12px;">${dealer.contractStartDate ? new Date(dealer.contractStartDate).toLocaleDateString('vi-VN') : 'Chưa có'}</td>
                        <td style="padding: 12px; text-align: right; font-weight: 600; color: #667eea;">${dealer.salesQuota ? parseFloat(dealer.salesQuota).toLocaleString('vi-VN') + ' ₫' : '0 ₫'}</td>
                        <td style="padding: 12px;">
                            <span style="display: inline-block; padding: 5px 14px; background: ${dealer.isActive ? '#4caf50' : '#f44336'}; color: white; border-radius: 14px; font-size: 0.85em; white-space: nowrap;">
                                ${dealer.isActive ? '✓ Hoạt động' : '✕ Ngừng'}
                            </span>
                        </td>
                        ${canEdit || canDelete ? `
                            <td style="padding: 12px; text-align: center;">
                                ${canEdit ? `<button onclick="editDealer(${dealer.dealerId})" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Sửa</button>` : ''}
                                ${canDelete ? `<button onclick="deleteDealer(${dealer.dealerId})" style="padding: 6px 12px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer;">🗑️ Xóa</button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// =====================
// Show Add Form
// =====================
function showAddForm() {
    const formContainer = document.getElementById('dealers-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 20px;">➕ Thêm đại lý mới</h3>
            <input type="hidden" id="dealer-id" value="">
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Tên đại lý: <span style="color: red;">*</span></label>
                <input type="text" id="dealer-name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập tên đại lý" required>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Địa chỉ:</label>
                <textarea id="dealer-address" rows="2" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;" placeholder="Nhập địa chỉ đầy đủ"></textarea>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Điện thoại:</label>
                    <input type="tel" id="dealer-phone" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập số điện thoại">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Ngày ký hợp đồng:</label>
                    <input type="date" id="dealer-contract-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Chỉ tiêu doanh số (VNĐ):</label>
                <input type="number" id="dealer-sales-quota" min="0" step="1000000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: 1000000000">
                <small style="color: #666;">Nhập số tiền (VD: 1000000000 = 1 tỷ đồng)</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Trạng thái:</label>
                <select id="dealer-active" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="true">✓ Hoạt động</option>
                    <option value="false">✕ Ngừng hoạt động</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="window.dealersModule.saveDealer()" style="flex: 1; padding: 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 1em;">💾 Lưu</button>
                <button onclick="window.dealersModule.cancelForm()" style="flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 1em;">✕ Hủy</button>
            </div>
        </div>
    `;
}

// =====================
// Edit Dealer
// =====================
function editDealer(id) {
    const dealer = allDealers.find(d => d.dealerId === id);
    if (!dealer) return;
    
    showAddForm();
    
    // Populate form
    document.getElementById('dealer-id').value = dealer.dealerId;
    document.getElementById('dealer-name').value = dealer.dealerName || '';
    document.getElementById('dealer-address').value = dealer.address || '';
    document.getElementById('dealer-phone').value = dealer.phone || '';
    document.getElementById('dealer-contract-date').value = dealer.contractStartDate || '';
    document.getElementById('dealer-sales-quota').value = dealer.salesQuota || '';
    document.getElementById('dealer-active').value = dealer.isActive ? 'true' : 'false';
    
    // Change form title
    const formContainer = document.getElementById('dealers-form');
    const title = formContainer.querySelector('h3');
    if (title) title.textContent = '✏️ Sửa thông tin đại lý';
}

// =====================
// Save Dealer
// =====================
async function saveDealer() {
    const id = document.getElementById('dealer-id').value;
    const dealerName = document.getElementById('dealer-name').value.trim();
    const address = document.getElementById('dealer-address').value.trim();
    const phone = document.getElementById('dealer-phone').value.trim();
    const contractStartDate = document.getElementById('dealer-contract-date').value;
    const salesQuota = document.getElementById('dealer-sales-quota').value;
    const isActive = document.getElementById('dealer-active').value === 'true';
    
    if (!dealerName) {
        alert('⚠️ Vui lòng nhập tên đại lý!');
        return;
    }
    
    const payload = {
        dealerName,
        address: address || null,
        phone: phone || null,
        contractStartDate: contractStartDate || null,
        salesQuota: salesQuota ? parseFloat(salesQuota) : 0,
        isActive
    };
    
    try {
        let response;
        if (id) {
            // Update
            response = await fetchWithAuth(`${urls.dealers}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            response = await fetchWithAuth(urls.dealers, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        alert(id ? '✅ Cập nhật đại lý thành công!' : '✅ Thêm đại lý thành công!');
        cancelForm();
        await loadDealers();
    } catch (error) {
        console.error('Error saving dealer:', error);
        alert('❌ Lỗi khi lưu đại lý: ' + error.message);
    }
}

// =====================
// Delete Dealer
// =====================
async function deleteDealer(id) {
    if (!confirm('⚠️ Bạn có chắc muốn xóa đại lý này? Hành động này không thể hoàn tác!')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.dealers}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Xóa đại lý thành công!');
            await loadDealers();
        } else {
            const error = await response.text();
            alert(`❌ Không thể xóa: ${error}`);
        }
    } catch (error) {
        console.error('Error deleting dealer:', error);
        alert('❌ Không thể xóa đại lý!');
    }
}

// =====================
// Cancel Form
// =====================
function cancelForm() {
    const formContainer = document.getElementById('dealers-form');
    formContainer.style.display = 'none';
    formContainer.innerHTML = '';
}
