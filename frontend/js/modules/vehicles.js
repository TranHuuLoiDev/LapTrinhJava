import { urls } from '../config.js';
import { fetchJson } from './utils.js';
import { getCurrentUser } from '../auth.js';

let allVehicles = [];
let currentUser = null;

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    currentUser = getCurrentUser();
    const isAdmin = currentUser?.role === 'ADMIN';
    const isEVMStaff = currentUser?.role === 'EVM_STAFF';
    const canModify = isAdmin || isEVMStaff;
    
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h2 style="display: inline-block; margin-right: 20px;">Quản lý Xe</h2>
            ${canModify ? '<button id="btn-add-vehicle" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">+ Thêm xe mới</button>' : ''}
        </div>
        <div id="vehicle-form" style="display: none;"></div>
        <div id="vehicle-list">Đang tải...</div>
    `;
    
    if (canModify) {
        document.getElementById('btn-add-vehicle')?.addEventListener('click', showAddForm);
    }
    
    await loadVehicles();
}

// =====================
// Load danh sách xe
// =====================
export async function loadVehicles() {
    const container = document.getElementById("vehicle-list");
    try {
        allVehicles = await fetchJson(urls.vehicles);
        displayVehicles(allVehicles);
    } catch {
        container.innerHTML = "Không thể tải dữ liệu xe.";
    }
}

function displayVehicles(vehicles) {
    const container = document.getElementById("vehicle-list");
    const isAdmin = currentUser?.role === 'ADMIN';
    const isEVMStaff = currentUser?.role === 'EVM_STAFF';
    const canModify = isAdmin || isEVMStaff;
    
    container.innerHTML = `
        <table class="data-table" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <th style="padding: 12px; text-align: left;">ID</th>
                    <th style="padding: 12px; text-align: left;">Tên xe</th>
                    <th style="padding: 12px; text-align: left;">Màu</th>
                    <th style="padding: 12px; text-align: left;">Phiên bản</th>
                    <th style="padding: 12px; text-align: left;">Giá gốc</th>
                    <th style="padding: 12px; text-align: left;">Giá bán</th>
                    <th style="padding: 12px; text-align: left;">Mô tả</th>
                    ${canModify ? '<th style="padding: 12px; text-align: left;">Hành động</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${vehicles.map(v => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px;">${v.vehicleId}</td>
                        <td style="padding: 12px; font-weight: 600;">${v.modelName || 'N/A'}</td>
                        <td style="padding: 12px;">${v.color || 'N/A'}</td>
                        <td style="padding: 12px;">${v.version || 'N/A'}</td>
                        <td style="padding: 12px; color: #9e9e9e;">${(v.basePrice ?? 0).toLocaleString("vi-VN")} ₫</td>
                        <td style="padding: 12px; color: #ef5350; font-weight: 600;">${(v.retailPrice ?? 0).toLocaleString("vi-VN")} ₫</td>
                        <td style="padding: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${v.description || 'N/A'}</td>
                        ${canModify ? `
                            <td style="padding: 12px;">
                                <button onclick="window.editVehicle(${v.vehicleId})" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Sửa</button>
                                <button onclick="window.deleteVehicle(${v.vehicleId})" style="padding: 6px 12px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer;">Xóa</button>
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// =====================
// Show Add Form
// =====================
function showAddForm() {
    const formContainer = document.getElementById('vehicle-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div style="margin-bottom: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 20px;">Thêm xe mới</h3>
            <input type="hidden" id="vehicle-id" value="">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Tên xe: <span style="color: red;">*</span></label>
                    <input type="text" id="vehicle-model-name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: VinFast VF8" required>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Màu sắc:</label>
                    <input type="text" id="vehicle-color" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: Đen">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Phiên bản:</label>
                    <input type="text" id="vehicle-version" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="VD: Plus">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Giá gốc (₫): <span style="color: red;">*</span></label>
                    <input type="number" id="vehicle-base-price" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="1000000000" required>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Giá bán (₫): <span style="color: red;">*</span></label>
                    <input type="number" id="vehicle-retail-price" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="1200000000" required>
                </div>
                
                <div style="grid-column: 1 / -1;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Mô tả:</label>
                    <textarea id="vehicle-description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px;" placeholder="Mô tả chi tiết về xe..."></textarea>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <button id="btn-save-vehicle" style="padding: 10px 20px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Lưu</button>
                <button id="btn-cancel-vehicle" style="padding: 10px 20px; background: #9e9e9e; color: white; border: none; border-radius: 4px; cursor: pointer;">Hủy</button>
            </div>
        </div>
    `;
    
    document.getElementById('btn-save-vehicle').addEventListener('click', saveVehicle);
    document.getElementById('btn-cancel-vehicle').addEventListener('click', hideForm);
}

// =====================
// Hide Form
// =====================
function hideForm() {
    document.getElementById('vehicle-form').style.display = 'none';
}

// =====================
// Save Vehicle (Add/Update)
// =====================
async function saveVehicle() {
    const id = document.getElementById('vehicle-id').value;
    const modelName = document.getElementById('vehicle-model-name').value.trim();
    const color = document.getElementById('vehicle-color').value.trim();
    const version = document.getElementById('vehicle-version').value.trim();
    const basePrice = document.getElementById('vehicle-base-price').value;
    const retailPrice = document.getElementById('vehicle-retail-price').value;
    const description = document.getElementById('vehicle-description').value.trim();
    
    if (!modelName || !basePrice || !retailPrice) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên xe, Giá gốc, Giá bán)');
        return;
    }
    
    const vehicleData = {
        modelName,
        color: color || null,
        version: version || null,
        basePrice: parseFloat(basePrice),
        retailPrice: parseFloat(retailPrice),
        description: description || null
    };
    
    try {
        const url = id ? `${urls.vehicles}/${id}` : urls.vehicles;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehicleData)
        });
        
        if (response.ok) {
            alert(id ? 'Cập nhật xe thành công!' : 'Thêm xe mới thành công!');
            hideForm();
            await loadVehicles();
        } else {
            alert('Có lỗi xảy ra: ' + response.statusText);
        }
    } catch (error) {
        alert('Lỗi kết nối: ' + error.message);
    }
}

// =====================
// Edit Vehicle
// =====================
window.editVehicle = function(id) {
    const vehicle = allVehicles.find(v => v.vehicleId === id);
    if (!vehicle) return;
    
    showAddForm();
    document.querySelector('#vehicle-form h3').textContent = 'Sửa thông tin xe';
    document.getElementById('vehicle-id').value = vehicle.vehicleId;
    document.getElementById('vehicle-model-name').value = vehicle.modelName || '';
    document.getElementById('vehicle-color').value = vehicle.color || '';
    document.getElementById('vehicle-version').value = vehicle.version || '';
    document.getElementById('vehicle-base-price').value = vehicle.basePrice || '';
    document.getElementById('vehicle-retail-price').value = vehicle.retailPrice || '';
    document.getElementById('vehicle-description').value = vehicle.description || '';
}

// =====================
// Delete Vehicle
// =====================
window.deleteVehicle = async function(id) {
    if (!confirm('Bạn có chắc muốn xóa xe này?')) return;
    
    try {
        const response = await fetch(`${urls.vehicles}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa xe thành công!');
            await loadVehicles();
        } else {
            alert('Không thể xóa xe: ' + response.statusText);
        }
    } catch (error) {
        alert('Lỗi kết nối: ' + error.message);
    }
}
