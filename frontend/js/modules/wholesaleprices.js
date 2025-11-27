// =====================
// Wholesale Prices Management Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allWholesalePrices = [];

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button onclick="window.wholesalePricesModule.showAddForm()" class="btn-primary" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                 Thêm giá sỉ mới
            </button>
        </div>
        <div id="wholesale-prices-list">Đang tải...</div>
        <div id="wholesale-prices-form" style="display: none;"></div>
    `;
    
    // Expose functions to window
    window.wholesalePricesModule = {
        showAddForm,
        editWholesalePrice,
        deleteWholesalePrice,
        saveWholesalePrice,
        cancelForm
    };
    
    window.editWholesalePrice = editWholesalePrice;
    window.deleteWholesalePrice = deleteWholesalePrice;
    
    await loadWholesalePrices();
}

// =====================
// Load Wholesale Prices
// =====================
export async function loadWholesalePrices() {
    try {
        const response = await fetchWithAuth(urls.wholesalePrices);
        allWholesalePrices = await response.json();
        displayWholesalePrices(allWholesalePrices);
    } catch (error) {
        console.error('Error loading wholesale prices:', error);
        document.getElementById('wholesale-prices-list').innerHTML = '<p class="error">Không thể tải dữ liệu giá sỉ</p>';
    }
}

function displayWholesalePrices(prices) {
    const container = document.getElementById('wholesale-prices-list');
    
    if (!prices || prices.length === 0) {
        container.innerHTML = '<p>Chưa có dữ liệu giá sỉ nào</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'wholesaleprices');
    const canDelete = hasPermission('canDelete', 'wholesaleprices');
    
    const html = `
        <table class="data-table" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <th style="padding: 12px; text-align: left;">ID</th>
                    <th style="padding: 12px; text-align: left;">ID Xe</th>
                    <th style="padding: 12px; text-align: left;">ID Đại lý</th>
                    <th style="padding: 12px; text-align: left;">Giá sỉ</th>
                    <th style="padding: 12px; text-align: left;">Ngày hiệu lực</th>
                    <th style="padding: 12px; text-align: left;">Ngày hết hạn</th>
                    <th style="padding: 12px; text-align: left;">Trạng thái</th>
                    ${canEdit || canDelete ? '<th style="padding: 12px; text-align: left;">Hành động</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${prices.map(price => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px;">${price.wholesalePriceId || 'N/A'}</td>
                        <td style="padding: 12px;">${price.vehicleId || 'N/A'}</td>
                        <td style="padding: 12px;">${price.dealerId || 'N/A'}</td>
                        <td style="padding: 12px; font-weight: 600; color: #667eea;">
                            ${(price.wholesalePrice || 0).toLocaleString('vi-VN')} ₫
                        </td>
                        <td style="padding: 12px;">${formatDate(price.effectiveDate)}</td>
                        <td style="padding: 12px;">${formatDate(price.expiryDate)}</td>
                        <td style="padding: 12px;">
                            <span style="padding: 4px 12px; background: ${getPriceStatusColor(price)}; color: white; border-radius: 12px; font-size: 0.85em;">
                                ${getPriceStatus(price)}
                            </span>
                        </td>
                        ${canEdit || canDelete ? `
                            <td style="padding: 12px;">
                                ${canEdit ? `<button onclick="editWholesalePrice(${price.wholesalePriceId})" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Sửa</button>` : ''}
                                ${canDelete ? `<button onclick="deleteWholesalePrice(${price.wholesalePriceId})" style="padding: 6px 12px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer;">Xóa</button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
}

function getPriceStatus(price) {
    if (!price.effectiveDate || !price.expiryDate) return 'Không xác định';
    const now = new Date();
    const effective = new Date(price.effectiveDate);
    const expiry = new Date(price.expiryDate);
    
    if (now < effective) return 'Chưa hiệu lực';
    if (now > expiry) return 'Đã hết hạn';
    return 'Đang hiệu lực';
}

function getPriceStatusColor(price) {
    const status = getPriceStatus(price);
    if (status === 'Đang hiệu lực') return '#4caf50';
    if (status === 'Chưa hiệu lực') return '#2196f3';
    if (status === 'Đã hết hạn') return '#9e9e9e';
    return '#757575';
}

// =====================
// Show Add Form
// =====================
function showAddForm() {
    const formContainer = document.getElementById('wholesale-prices-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 20px;"> Thêm giá sỉ mới</h3>
            <input type="hidden" id="wp-id" value="">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">ID Xe: <span style="color: red;">*</span></label>
                    <input type="number" id="wp-vehicle" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập ID xe" required>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">ID Đại lý: <span style="color: red;">*</span></label>
                    <input type="number" id="wp-dealer" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập ID đại lý" required>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Giá sỉ (VNĐ): <span style="color: red;">*</span></label>
                <input type="number" id="wp-price" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: 800000000" min="0" required>
                <small style="color: #666; font-size: 0.85em;">Nhập giá bán sỉ cho đại lý</small>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Ngày hiệu lực: <span style="color: red;">*</span></label>
                    <input type="date" id="wp-effective-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Ngày hết hạn: <span style="color: red;">*</span></label>
                    <input type="date" id="wp-expiry-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="window.wholesalePricesModule.saveWholesalePrice()" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Lưu</button>
                <button onclick="window.wholesalePricesModule.cancelForm()" style="flex: 1; padding: 10px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Hủy</button>
            </div>
        </div>
    `;
}

// =====================
// Edit Wholesale Price
// =====================
function editWholesalePrice(id) {
    const price = allWholesalePrices.find(p => p.wholesalePriceId === id);
    if (!price) return;
    
    showAddForm();
    
    // Populate form
    document.getElementById('wp-id').value = price.wholesalePriceId;
    document.getElementById('wp-vehicle').value = price.vehicleId || '';
    document.getElementById('wp-dealer').value = price.dealerId || '';
    document.getElementById('wp-price').value = price.wholesalePrice || '';
    document.getElementById('wp-effective-date').value = price.effectiveDate ? price.effectiveDate.split('T')[0] : '';
    document.getElementById('wp-expiry-date').value = price.expiryDate ? price.expiryDate.split('T')[0] : '';
    
    // Change form title
    const formContainer = document.getElementById('wholesale-prices-form');
    const title = formContainer.querySelector('h3');
    if (title) title.textContent = ' Sửa thông tin giá sỉ';
}

// =====================
// Save Wholesale Price
// =====================
async function saveWholesalePrice() {
    const id = document.getElementById('wp-id').value;
    const vehicleId = parseInt(document.getElementById('wp-vehicle').value);
    const dealerId = parseInt(document.getElementById('wp-dealer').value);
    const wholesalePrice = parseFloat(document.getElementById('wp-price').value);
    const effectiveDate = document.getElementById('wp-effective-date').value;
    const expiryDate = document.getElementById('wp-expiry-date').value;
    
    if (!vehicleId || !dealerId || !wholesalePrice || !effectiveDate || !expiryDate) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    if (new Date(effectiveDate) > new Date(expiryDate)) {
        alert('Ngày hết hạn phải sau ngày hiệu lực!');
        return;
    }
    
    const payload = {
        vehicleId,
        dealerId,
        wholesalePrice,
        effectiveDate,
        expiryDate
    };
    
    try {
        let response;
        if (id) {
            // Update
            response = await fetchWithAuth(`${urls.wholesalePrices}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            response = await fetchWithAuth(urls.wholesalePrices, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        
        if (response.ok) {
            alert('Lưu thành công!');
            cancelForm();
            await loadWholesalePrices();
        } else {
            const error = await response.text();
            alert(`Lỗi: ${error}`);
        }
    } catch (error) {
        console.error('Error saving wholesale price:', error);
        alert('Không thể lưu dữ liệu!');
    }
}

// =====================
// Delete Wholesale Price
// =====================
async function deleteWholesalePrice(id) {
    if (!confirm('Bạn có chắc muốn xóa giá sỉ này?')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.wholesalePrices}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa thành công!');
            await loadWholesalePrices();
        } else {
            const error = await response.text();
            alert(`Không thể xóa: ${error}`);
        }
    } catch (error) {
        console.error('Error deleting wholesale price:', error);
        alert('Không thể xóa giá sỉ!');
    }
}

// =====================
// Cancel Form
// =====================
function cancelForm() {
    const formContainer = document.getElementById('wholesale-prices-form');
    formContainer.style.display = 'none';
    formContainer.innerHTML = '';
}
