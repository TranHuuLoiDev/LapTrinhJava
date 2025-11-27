// =====================
// Promotions Management Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allPromotions = [];

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button onclick="window.promotionsModule.showAddForm()" class="btn-primary" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                 Thêm khuyến mãi mới
            </button>
        </div>
        <div id="promotions-list">Đang tải...</div>
        <div id="promotions-form" style="display: none;"></div>
    `;
    
    // Expose functions to window
    window.promotionsModule = {
        showAddForm,
        editPromotion,
        deletePromotion,
        savePromotion,
        cancelForm
    };
    
    window.editPromotion = editPromotion;
    window.deletePromotion = deletePromotion;
    
    await loadPromotions();
}

// =====================
// Load Promotions
// =====================
export async function loadPromotions() {
    try {
        const response = await fetchWithAuth(urls.promotions);
        allPromotions = await response.json();
        displayPromotions(allPromotions);
    } catch (error) {
        console.error('Error loading promotions:', error);
        document.getElementById('promotions-list').innerHTML = '<p class="error">Không thể tải dữ liệu khuyến mãi</p>';
    }
}

function displayPromotions(promotions) {
    const container = document.getElementById('promotions-list');
    
    if (!promotions || promotions.length === 0) {
        container.innerHTML = '<p>Chưa có chương trình khuyến mãi nào</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'promotions');
    const canDelete = hasPermission('canDelete', 'promotions');
    
    const html = `
        <table class="data-table" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <th style="padding: 12px; text-align: left;">ID</th>
                    <th style="padding: 12px; text-align: left;">Tên chương trình</th>
                    <th style="padding: 12px; text-align: left;">Mã KM</th>
                    <th style="padding: 12px; text-align: left;">Loại giảm giá</th>
                    <th style="padding: 12px; text-align: left;">Giá trị</th>
                    <th style="padding: 12px; text-align: left;">Ngày bắt đầu</th>
                    <th style="padding: 12px; text-align: left;">Ngày kết thúc</th>
                    <th style="padding: 12px; text-align: left;">Trạng thái</th>
                    ${canEdit || canDelete ? '<th style="padding: 12px; text-align: left;">Hành động</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${promotions.map(promo => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px;">${promo.promotionId || 'N/A'}</td>
                        <td style="padding: 12px; font-weight: 600;">${promo.promotionName || 'N/A'}</td>
                        <td style="padding: 12px;"><code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${promo.promotionCode || 'N/A'}</code></td>
                        <td style="padding: 12px;">${promo.discountType || 'N/A'}</td>
                        <td style="padding: 12px; font-weight: 600; color: #ef5350;">
                            ${promo.discountType === 'Percentage' ? promo.discountValue + '%' : (promo.discountValue || 0).toLocaleString('vi-VN') + ' ₫'}
                        </td>
                        <td style="padding: 12px;">${formatDate(promo.startDate)}</td>
                        <td style="padding: 12px;">${formatDate(promo.endDate)}</td>
                        <td style="padding: 12px;">
                            <span style="padding: 4px 12px; background: ${getPromotionStatusColor(promo)}; color: white; border-radius: 12px; font-size: 0.85em;">
                                ${getPromotionStatus(promo)}
                            </span>
                        </td>
                        ${canEdit || canDelete ? `
                            <td style="padding: 12px;">
                                ${canEdit ? `<button onclick="editPromotion(${promo.promotionId})" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Sửa</button>` : ''}
                                ${canDelete ? `<button onclick="deletePromotion(${promo.promotionId})" style="padding: 6px 12px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer;">Xóa</button>` : ''}
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

function getPromotionStatus(promo) {
    if (!promo.startDate || !promo.endDate) return 'Không xác định';
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    
    if (now < start) return 'Sắp diễn ra';
    if (now > end) return 'Đã kết thúc';
    return 'Đang diễn ra';
}

function getPromotionStatusColor(promo) {
    const status = getPromotionStatus(promo);
    if (status === 'Đang diễn ra') return '#4caf50';
    if (status === 'Sắp diễn ra') return '#2196f3';
    if (status === 'Đã kết thúc') return '#9e9e9e';
    return '#757575';
}

// =====================
// Show Add Form
// =====================
function showAddForm() {
    const formContainer = document.getElementById('promotions-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 20px;"> Thêm khuyến mãi mới</h3>
            <input type="hidden" id="promo-id" value="">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Tên chương trình: <span style="color: red;">*</span></label>
                    <input type="text" id="promo-name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: Giảm giá mùa hè 2024" required>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Mã khuyến mãi: <span style="color: red;">*</span></label>
                    <input type="text" id="promo-code" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: SUMMER2024" required>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Mô tả:</label>
                <textarea id="promo-description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;" placeholder="Mô tả chi tiết về chương trình khuyến mãi"></textarea>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Loại giảm giá: <span style="color: red;">*</span></label>
                    <select id="promo-discount-type" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" onchange="window.promotionsModule.updateDiscountLabel()">
                        <option value="Percentage">Phần trăm (%)</option>
                        <option value="Fixed Amount">Số tiền cố định (VNĐ)</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Giá trị giảm: <span style="color: red;">*</span></label>
                    <input type="number" id="promo-discount-value" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: 10 hoặc 5000000" min="0" required>
                    <small id="discount-hint" style="color: #666; font-size: 0.85em;">Nhập % giảm giá</small>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Ngày bắt đầu: <span style="color: red;">*</span></label>
                    <input type="date" id="promo-start-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Ngày kết thúc: <span style="color: red;">*</span></label>
                    <input type="date" id="promo-end-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="window.promotionsModule.savePromotion()" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Lưu</button>
                <button onclick="window.promotionsModule.cancelForm()" style="flex: 1; padding: 10px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Hủy</button>
            </div>
        </div>
    `;
    
    // Add updateDiscountLabel to window
    window.promotionsModule.updateDiscountLabel = updateDiscountLabel;
}

function updateDiscountLabel() {
    const type = document.getElementById('promo-discount-type').value;
    const hint = document.getElementById('discount-hint');
    if (hint) {
        hint.textContent = type === 'Percentage' ? 'Nhập % giảm giá (0-100)' : 'Nhập số tiền giảm (VNĐ)';
    }
}

// =====================
// Edit Promotion
// =====================
function editPromotion(id) {
    const promo = allPromotions.find(p => p.promotionId === id);
    if (!promo) return;
    
    showAddForm();
    
    // Populate form
    document.getElementById('promo-id').value = promo.promotionId;
    document.getElementById('promo-name').value = promo.promotionName || '';
    document.getElementById('promo-code').value = promo.promotionCode || '';
    document.getElementById('promo-description').value = promo.description || '';
    document.getElementById('promo-discount-type').value = promo.discountType || 'Percentage';
    document.getElementById('promo-discount-value').value = promo.discountValue || '';
    document.getElementById('promo-start-date').value = promo.startDate ? promo.startDate.split('T')[0] : '';
    document.getElementById('promo-end-date').value = promo.endDate ? promo.endDate.split('T')[0] : '';
    
    updateDiscountLabel();
    
    // Change form title
    const formContainer = document.getElementById('promotions-form');
    const title = formContainer.querySelector('h3');
    if (title) title.textContent = ' Sửa thông tin khuyến mãi';
}

// =====================
// Save Promotion
// =====================
async function savePromotion() {
    const id = document.getElementById('promo-id').value;
    const promotionName = document.getElementById('promo-name').value.trim();
    const promotionCode = document.getElementById('promo-code').value.trim();
    const description = document.getElementById('promo-description').value.trim();
    const discountType = document.getElementById('promo-discount-type').value;
    const discountValue = parseFloat(document.getElementById('promo-discount-value').value);
    const startDate = document.getElementById('promo-start-date').value;
    const endDate = document.getElementById('promo-end-date').value;
    
    if (!promotionName || !promotionCode || !discountValue || !startDate || !endDate) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    if (discountType === 'Percentage' && (discountValue < 0 || discountValue > 100)) {
        alert('Giá trị giảm theo % phải từ 0 đến 100!');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        alert('Ngày kết thúc phải sau ngày bắt đầu!');
        return;
    }
    
    const payload = {
        promotionName,
        promotionCode,
        description,
        discountType,
        discountValue,
        startDate,
        endDate
    };
    
    try {
        let response;
        if (id) {
            // Update
            response = await fetchWithAuth(`${urls.promotions}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            response = await fetchWithAuth(urls.promotions, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        
        if (response.ok) {
            alert('Lưu thành công!');
            cancelForm();
            await loadPromotions();
        } else {
            const error = await response.text();
            alert(`Lỗi: ${error}`);
        }
    } catch (error) {
        console.error('Error saving promotion:', error);
        alert('Không thể lưu dữ liệu!');
    }
}

// =====================
// Delete Promotion
// =====================
async function deletePromotion(id) {
    if (!confirm('Bạn có chắc muốn xóa chương trình khuyến mãi này?')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.promotions}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa thành công!');
            await loadPromotions();
        } else {
            const error = await response.text();
            alert(`Không thể xóa: ${error}`);
        }
    } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Không thể xóa chương trình khuyến mãi!');
    }
}

// =====================
// Cancel Form
// =====================
function cancelForm() {
    const formContainer = document.getElementById('promotions-form');
    formContainer.style.display = 'none';
    formContainer.innerHTML = '';
}
