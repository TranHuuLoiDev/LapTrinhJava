// =====================
// Inventory Management Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allInventory = [];

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button onclick="window.inventoryModule.showAddForm()" class="btn-primary" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                 Thêm mới kho
            </button>
        </div>
        <div id="inventory-list">Đang tải...</div>
        <div id="inventory-form" style="display: none;"></div>
    `;
    
    // Expose functions to window
    window.inventoryModule = {
        showAddForm,
        editInventory,
        deleteInventory,
        saveInventory,
        cancelForm
    };
    
    window.editInventory = editInventory;
    window.deleteInventory = deleteInventory;
    
    await loadInventory();
}

// =====================
// Load Inventory
// =====================
export async function loadInventory() {
    try {
        const response = await fetchWithAuth(urls.inventory);
        allInventory = await response.json();
        displayInventory(allInventory);
    } catch (error) {
        console.error('Error loading inventory:', error);
        document.getElementById('inventory-list').innerHTML = '<p class="error">Không thể tải dữ liệu kho</p>';
    }
}

function displayInventory(inventory) {
    const container = document.getElementById('inventory-list');
    
    if (!inventory || inventory.length === 0) {
        container.innerHTML = '<p>Chưa có dữ liệu kho</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'inventory');
    const canDelete = hasPermission('canDelete', 'inventory');
    
    const html = `
        <table class="data-table" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <th style="padding: 12px; text-align: left;">ID</th>
                    <th style="padding: 12px; text-align: left;">Xe</th>
                    <th style="padding: 12px; text-align: left;">Đại lý</th>
                    <th style="padding: 12px; text-align: left;">Số lượng</th>
                    <th style="padding: 12px; text-align: left;">Trạng thái</th>
                    <th style="padding: 12px; text-align: left;">Vị trí</th>
                    ${canEdit || canDelete ? '<th style="padding: 12px; text-align: left;">Hành động</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${inventory.map(item => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px;">${item.inventoryId || 'N/A'}</td>
                        <td style="padding: 12px;">${item.vehicleId || 'N/A'}</td>
                        <td style="padding: 12px;">${item.dealerId || 'N/A'}</td>
                        <td style="padding: 12px;">${item.quantity || 0}</td>
                        <td style="padding: 12px;">
                            <span style="padding: 4px 12px; background: ${getStatusColor(item.status)}; color: white; border-radius: 12px; font-size: 0.85em;">
                                ${item.status || 'Unknown'}
                            </span>
                        </td>
                        <td style="padding: 12px;">${item.location || 'N/A'}</td>
                        ${canEdit || canDelete ? `
                            <td style="padding: 12px;">
                                ${canEdit ? `<button onclick="editInventory(${item.inventoryId})" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Sửa</button>` : ''}
                                ${canDelete ? `<button onclick="deleteInventory(${item.inventoryId})" style="padding: 6px 12px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer;">Xóa</button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function getStatusColor(status) {
    const colors = {
        'Available': '#4caf50',
        'Reserved': '#ff9800',
        'Sold': '#f44336',
        'In Transit': '#2196f3',
        'Maintenance': '#9e9e9e'
    };
    return colors[status] || '#757575';
}

// =====================
// Show Add Form
// =====================
function showAddForm() {
    const formContainer = document.getElementById('inventory-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 20px;"> Thêm mới kho</h3>
            <input type="hidden" id="inv-id" value="">
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">ID Xe:</label>
                <input type="number" id="inv-vehicle" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập ID xe">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">ID Đại lý:</label>
                <input type="number" id="inv-dealer" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập ID đại lý">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Số lượng:</label>
                <input type="number" id="inv-quantity" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập số lượng" min="0">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Trạng thái:</label>
                <select id="inv-status" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Maintenance">Maintenance</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Vị trí:</label>
                <input type="text" id="inv-location" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nhập vị trí lưu kho">
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="window.inventoryModule.saveInventory()" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Lưu</button>
                <button onclick="window.inventoryModule.cancelForm()" style="flex: 1; padding: 10px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Hủy</button>
            </div>
        </div>
    `;
}

// =====================
// Edit Inventory
// =====================
function editInventory(id) {
    const item = allInventory.find(i => i.inventoryId === id);
    if (!item) return;
    
    showAddForm();
    
    // Populate form
    document.getElementById('inv-id').value = item.inventoryId;
    document.getElementById('inv-vehicle').value = item.vehicleId || '';
    document.getElementById('inv-dealer').value = item.dealerId || '';
    document.getElementById('inv-quantity').value = item.quantity || 0;
    document.getElementById('inv-status').value = item.status || 'Available';
    document.getElementById('inv-location').value = item.location || '';
    
    // Change form title
    const formContainer = document.getElementById('inventory-form');
    const title = formContainer.querySelector('h3');
    if (title) title.textContent = ' Sửa thông tin kho';
}

// =====================
// Save Inventory
// =====================
async function saveInventory() {
    const id = document.getElementById('inv-id').value;
    const vehicleId = document.getElementById('inv-vehicle').value;
    const dealerId = document.getElementById('inv-dealer').value;
    const quantity = document.getElementById('inv-quantity').value;
    const status = document.getElementById('inv-status').value;
    const location = document.getElementById('inv-location').value;
    
    if (!vehicleId || !dealerId || !quantity) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    const payload = {
        vehicleId: parseInt(vehicleId),
        dealerId: parseInt(dealerId),
        quantity: parseInt(quantity),
        status,
        location
    };
    
    try {
        let response;
        if (id) {
            // Update
            response = await fetchWithAuth(`${urls.inventory}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            response = await fetchWithAuth(urls.inventory, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        
        if (response.ok) {
            alert('Lưu thành công!');
            cancelForm();
            await loadInventory();
        } else {
            const error = await response.text();
            alert(`Lỗi: ${error}`);
        }
    } catch (error) {
        console.error('Error saving inventory:', error);
        alert('Không thể lưu dữ liệu!');
    }
}

// =====================
// Delete Inventory
// =====================
async function deleteInventory(id) {
    if (!confirm('Bạn có chắc muốn xóa bản ghi kho này?')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.inventory}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa thành công!');
            await loadInventory();
        } else {
            alert('Không thể xóa!');
        }
    } catch (error) {
        console.error('Error deleting inventory:', error);
        alert('Không thể xóa dữ liệu!');
    }
}

// =====================
// Cancel Form
// =====================
function cancelForm() {
    const formContainer = document.getElementById('inventory-form');
    formContainer.style.display = 'none';
    formContainer.innerHTML = '';
}
