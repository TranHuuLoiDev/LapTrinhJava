// =====================
// Dealers Management Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allDealers = [];

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button onclick="window.dealersModule.showAddForm()" class="btn-primary" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                 Thêm đại lý mới
            </button>
        </div>
        <div id="dealers-list">Đang tải...</div>
        <div id="dealers-form" style="display: none;"></div>
    `;
    
    // Expose functions to window
    window.dealersModule = {
        showAddForm,
        editDealer,
        deleteDealer,
        saveDealer,
        cancelForm
    };
    
    window.editDealer = editDealer;
    window.deleteDealer = deleteDealer;
    
    await loadDealers();
}

// =====================
// Load Dealers
// =====================
export async function loadDealers() {
    try {
        const response = await fetchWithAuth(urls.dealers);
        allDealers = await response.json();
        displayDealers(allDealers);
    } catch (error) {
        console.error('Error loading dealers:', error);
        document.getElementById('dealers-list').innerHTML = '<p class="error">Không thể tải dữ liệu đại lý</p>';
    }
}

function displayDealers(dealers) {
    const container = document.getElementById('dealers-list');
    
    if (!dealers || dealers.length === 0) {
        container.innerHTML = '<p>Chưa có đại lý nào</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'dealers');
    const canDelete = hasPermission('canDelete', 'dealers');
    
    const html = `
        <table class="data-table" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <th style="padding: 12px; text-align: left;">ID</th>
                    <th style="padding: 12px; text-align: left;">Tên đại lý</th>
                    <th style="padding: 12px; text-align: left;">Mã đại lý</th>
                    <th style="padding: 12px; text-align: left;">Địa chỉ</th>
                    <th style="padding: 12px; text-align: left;">Điện thoại</th>
                    <th style="padding: 12px; text-align: left;">Email</th>
                    <th style="padding: 12px; text-align: left;">Trạng thái</th>
                    ${canEdit || canDelete ? '<th style="padding: 12px; text-align: left;">Hành động</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${dealers.map(dealer => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px;">${dealer.dealerId || 'N/A'}</td>
                        <td style="padding: 12px; font-weight: 600;">${dealer.dealerName || 'N/A'}</td>
                        <td style="padding: 12px;">${dealer.dealerCode || 'N/A'}</td>
                        <td style="padding: 12px;">${dealer.address || 'N/A'}</td>
                        <td style="padding: 12px;">${dealer.phone || 'N/A'}</td>
                        <td style="padding: 12px;">${dealer.email || 'N/A'}</td>
                        <td style="padding: 12px;">
                            <span style="padding: 4px 12px; background: ${dealer.isActive ? '#4caf50' : '#f44336'}; color: white; border-radius: 12px; font-size: 0.85em;">
                                ${dealer.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                            </span>
                        </td>
                        ${canEdit || canDelete ? `
                            <td style="padding: 12px;">
                                ${canEdit ? `<button onclick="editDealer(${dealer.dealerId})" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Sửa</button>` : ''}
                                ${canDelete ? `<button onclick="deleteDealer(${dealer.dealerId})" style="padding: 6px 12px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer;">Xóa</button>` : ''}
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
            <h3 style="margin-bottom: 20px;"> Thêm đại lý mới</h3>
            <input type="hidden" id="dealer-id" value="">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Tên đại lý: <span style="color: red;">*</span></label>
                    <input type="text" id="dealer-name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập tên đại lý" required>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Mã đại lý: <span style="color: red;">*</span></label>
                    <input type="text" id="dealer-code" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: DL001" required>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Địa chỉ:</label>
                <input type="text" id="dealer-address" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập địa chỉ đầy đủ">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Điện thoại:</label>
                    <input type="tel" id="dealer-phone" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập số điện thoại">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Email:</label>
                    <input type="email" id="dealer-email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="email@example.com">
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Trạng thái:</label>
                <select id="dealer-active" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="true">Hoạt động</option>
                    <option value="false">Ngừng hoạt động</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="window.dealersModule.saveDealer()" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Lưu</button>
                <button onclick="window.dealersModule.cancelForm()" style="flex: 1; padding: 10px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Hủy</button>
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
    document.getElementById('dealer-code').value = dealer.dealerCode || '';
    document.getElementById('dealer-address').value = dealer.address || '';
    document.getElementById('dealer-phone').value = dealer.phone || '';
    document.getElementById('dealer-email').value = dealer.email || '';
    document.getElementById('dealer-active').value = dealer.isActive ? 'true' : 'false';
    
    // Change form title
    const formContainer = document.getElementById('dealers-form');
    const title = formContainer.querySelector('h3');
    if (title) title.textContent = ' Sửa thông tin đại lý';
}

// =====================
// Save Dealer
// =====================
async function saveDealer() {
    const id = document.getElementById('dealer-id').value;
    const dealerName = document.getElementById('dealer-name').value.trim();
    const dealerCode = document.getElementById('dealer-code').value.trim();
    const address = document.getElementById('dealer-address').value.trim();
    const phone = document.getElementById('dealer-phone').value.trim();
    const email = document.getElementById('dealer-email').value.trim();
    const isActive = document.getElementById('dealer-active').value === 'true';
    
    if (!dealerName || !dealerCode) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên đại lý, Mã đại lý)!');
        return;
    }
    
    const payload = {
        dealerName,
        dealerCode,
        address,
        phone,
        email,
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
        
        if (response.ok) {
            alert('Lưu thành công!');
            cancelForm();
            await loadDealers();
        } else {
            const error = await response.text();
            alert(`Lỗi: ${error}`);
        }
    } catch (error) {
        console.error('Error saving dealer:', error);
        alert('Không thể lưu dữ liệu!');
    }
}

// =====================
// Delete Dealer
// =====================
async function deleteDealer(id) {
    if (!confirm('Bạn có chắc muốn xóa đại lý này? Hành động này không thể hoàn tác!')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.dealers}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa thành công!');
            await loadDealers();
        } else {
            const error = await response.text();
            alert(`Không thể xóa: ${error}`);
        }
    } catch (error) {
        console.error('Error deleting dealer:', error);
        alert('Không thể xóa đại lý!');
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
