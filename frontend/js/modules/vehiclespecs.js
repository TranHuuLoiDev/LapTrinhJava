// =====================
// Vehicle Specifications Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allSpecs = [];
let allVehicles = [];

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button onclick="window.vehicleSpecsModule.showAddForm()" class="btn-primary" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                ➕ Thêm thông số kỹ thuật mới
            </button>
        </div>
        <div id="vehiclespec-list">Đang tải...</div>
        <div id="vehiclespec-form" style="display: none;"></div>
    `;
    
    // Expose functions to window
    window.vehicleSpecsModule = {
        showAddForm,
        editVehicleSpec,
        deleteVehicleSpec,
        saveVehicleSpec,
        cancelForm
    };
    
    window.editVehicleSpec = editVehicleSpec;
    window.deleteVehicleSpec = deleteVehicleSpec;
    
    await loadVehicles();
    await loadVehicleSpecs();
}

// =====================
// Load Vehicles for dropdown
// =====================
async function loadVehicles() {
    try {
        const response = await fetchWithAuth(urls.vehicles);
        allVehicles = await response.json();
    } catch (error) {
        console.error('Error loading vehicles:', error);
        allVehicles = [];
    }
}

// =====================
// Load Vehicle Specifications
// =====================
export async function loadVehicleSpecs() {
    try {
        const response = await fetchWithAuth(urls.vehicleSpecs);
        allSpecs = await response.json();
        displayVehicleSpecs(allSpecs);
    } catch (error) {
        console.error('Error loading vehicle specs:', error);
        document.getElementById('vehiclespec-list').innerHTML = '<p class="error">Không thể tải dữ liệu thông số kỹ thuật</p>';
    }
}

// =====================
// Display Vehicle Specifications
// =====================
function displayVehicleSpecs(specs) {
    const container = document.getElementById('vehiclespec-list');
    
    if (!specs || specs.length === 0) {
        container.innerHTML = '<p>Chưa có thông số kỹ thuật nào</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'vehicles');
    const canDelete = hasPermission('canDelete', 'vehicles');
    
    const html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Xe</th>
                    <th>Pin</th>
                    <th>Tầm hoạt động (km)</th>
                    <th>Thời gian sạc</th>
                    <th>Công suất</th>
                    <th>Tốc độ tối đa</th>
                    <th>Chỗ ngồi</th>
                    ${canEdit || canDelete ? '<th>Thao tác</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${specs.map(spec => {
                    const vehicle = allVehicles.find(v => v.vehicleId === spec.vehicleId);
                    const vehicleName = vehicle ? `${vehicle.modelName} ${vehicle.version}` : `ID: ${spec.vehicleId}`;
                    
                    return `
                    <tr>
                        <td>${spec.specId || 'N/A'}</td>
                        <td><strong>${vehicleName}</strong></td>
                        <td>${spec.batteryCapacity || 'N/A'}</td>
                        <td>${spec.rangeKm || 'N/A'}</td>
                        <td>${spec.chargingTime || 'N/A'}</td>
                        <td>${spec.motorPower || 'N/A'}</td>
                        <td>${spec.maxSpeed || 'N/A'} km/h</td>
                        <td>${spec.seats || 'N/A'}</td>
                        ${canEdit || canDelete ? `
                            <td>
                                ${canEdit ? `<button class="btn-edit" onclick="window.vehicleSpecsModule.editVehicleSpec(${spec.specId})" title="Sửa">✏️</button>` : ''}
                                ${canDelete ? `<button class="btn-delete" onclick="window.vehicleSpecsModule.deleteVehicleSpec(${spec.specId})" title="Xóa">🗑️</button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `}).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// =====================
// Show Add Form
// =====================
function showAddForm() {
    const formContainer = document.getElementById('vehiclespec-form');
    const listContainer = document.getElementById('vehiclespec-list');
    
    listContainer.style.display = 'none';
    formContainer.style.display = 'block';
    
    formContainer.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 20px;">➕ Thêm thông số kỹ thuật mới</h3>
            <form id="spec-form" onsubmit="event.preventDefault(); window.vehicleSpecsModule.saveVehicleSpec();">
                <input type="hidden" id="spec-id" value="">
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Xe *</label>
                        <select id="spec-vehicle-id" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">-- Chọn xe --</option>
                            ${allVehicles.map(v => `
                                <option value="${v.vehicleId}">${v.modelName} ${v.version} - ${v.color}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Dung lượng pin *</label>
                        <input type="text" id="spec-battery" placeholder="VD: 87.7 kWh" required 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tầm hoạt động (km) *</label>
                        <input type="number" id="spec-range" placeholder="VD: 420" required 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Thời gian sạc *</label>
                        <input type="text" id="spec-charging" placeholder="VD: 7h (AC) / 31 phút (DC)" required 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Công suất động cơ *</label>
                        <input type="text" id="spec-power" placeholder="VD: 260 kW / 350 hp" required 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tốc độ tối đa (km/h) *</label>
                        <input type="number" id="spec-speed" placeholder="VD: 200" required 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Số chỗ ngồi *</label>
                        <input type="number" id="spec-seats" placeholder="VD: 7" required 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Dung tích cốp</label>
                        <input type="text" id="spec-trunk" placeholder="VD: 376L - 1373L" 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Khoảng sáng gầm</label>
                        <input type="text" id="spec-clearance" placeholder="VD: 175mm" 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Chiều dài cơ sở</label>
                        <input type="text" id="spec-wheelbase" placeholder="VD: 2950mm" 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Kích thước (DxRxC)</label>
                        <input type="text" id="spec-dimensions" placeholder="VD: 4750 x 1934 x 1667" 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Trọng lượng</label>
                        <input type="text" id="spec-weight" placeholder="VD: 2100 kg" 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Kiểu dẫn động *</label>
                        <select id="spec-drive" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">-- Chọn --</option>
                            <option value="FWD">FWD (Cầu trước)</option>
                            <option value="RWD">RWD (Cầu sau)</option>
                            <option value="AWD">AWD (4 bánh)</option>
                        </select>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="submit" class="btn-primary" style="padding: 10px 30px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        💾 Lưu
                    </button>
                    <button type="button" onclick="window.vehicleSpecsModule.cancelForm()" class="btn-secondary" style="padding: 10px 30px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        ❌ Hủy
                    </button>
                </div>
            </form>
        </div>
    `;
}

// =====================
// Edit Vehicle Specification
// =====================
function editVehicleSpec(id) {
    const spec = allSpecs.find(s => s.specId === id);
    if (!spec) {
        alert('Không tìm thấy thông số kỹ thuật!');
        return;
    }
    
    // Show form first
    showAddForm();
    
    // Update form title
    document.querySelector('#vehiclespec-form h3').textContent = '✏️ Chỉnh sửa thông số kỹ thuật';
    
    // Fill form with data
    setTimeout(() => {
        document.getElementById('spec-id').value = spec.specId || '';
        document.getElementById('spec-vehicle-id').value = spec.vehicleId || '';
        document.getElementById('spec-battery').value = spec.batteryCapacity || '';
        document.getElementById('spec-range').value = spec.rangeKm || '';
        document.getElementById('spec-charging').value = spec.chargingTime || '';
        document.getElementById('spec-power').value = spec.motorPower || '';
        document.getElementById('spec-speed').value = spec.maxSpeed || '';
        document.getElementById('spec-seats').value = spec.seats || '';
        document.getElementById('spec-trunk').value = spec.trunkCapacity || '';
        document.getElementById('spec-clearance').value = spec.groundClearance || '';
        document.getElementById('spec-wheelbase').value = spec.wheelbase || '';
        document.getElementById('spec-dimensions').value = spec.lengthWidthHeight || '';
        document.getElementById('spec-weight').value = spec.curbWeight || '';
        document.getElementById('spec-drive').value = spec.driveType || '';
    }, 100);
}

// =====================
// Save Vehicle Specification (Create or Update)
// =====================
async function saveVehicleSpec() {
    const specId = document.getElementById('spec-id').value;
    
    const vehicleId = document.getElementById('spec-vehicle-id').value;
    if (!vehicleId) {
        alert('Vui lòng chọn xe!');
        return;
    }
    
    const data = {
        vehicleId: parseInt(vehicleId),
        batteryCapacity: document.getElementById('spec-battery').value.trim(),
        rangeKm: parseInt(document.getElementById('spec-range').value) || 0,
        chargingTime: document.getElementById('spec-charging').value.trim(),
        motorPower: document.getElementById('spec-power').value.trim(),
        maxSpeed: parseInt(document.getElementById('spec-speed').value) || 0,
        seats: parseInt(document.getElementById('spec-seats').value) || 0,
        trunkCapacity: document.getElementById('spec-trunk').value.trim() || null,
        groundClearance: document.getElementById('spec-clearance').value.trim() || null,
        wheelbase: document.getElementById('spec-wheelbase').value.trim() || null,
        lengthWidthHeight: document.getElementById('spec-dimensions').value.trim() || null,
        curbWeight: document.getElementById('spec-weight').value.trim() || null,
        driveType: document.getElementById('spec-drive').value.trim()
    };
    
    try {
        const method = specId ? 'PUT' : 'POST';
        const url = specId ? `${urls.vehicleSpecs}/${specId}` : urls.vehicleSpecs;
        
        const response = await fetchWithAuth(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert(specId ? '✅ Cập nhật thông số kỹ thuật thành công!' : '✅ Thêm thông số kỹ thuật thành công!');
            cancelForm();
            await loadVehicleSpecs();
        } else {
            const errorData = await response.text();
            alert(`❌ Lỗi khi lưu thông số kỹ thuật: ${errorData}`);
        }
    } catch (error) {
        console.error('Error saving spec:', error);
        alert('❌ Lỗi kết nối khi lưu dữ liệu');
    }
}

// =====================
// Delete Vehicle Specification
// =====================
async function deleteVehicleSpec(id) {
    const spec = allSpecs.find(s => s.specId === id);
    if (!spec) {
        alert('Không tìm thấy thông số kỹ thuật!');
        return;
    }
    
    const vehicle = allVehicles.find(v => v.vehicleId === spec.vehicleId);
    const vehicleName = vehicle ? `${vehicle.modelName} ${vehicle.version}` : `ID: ${spec.vehicleId}`;
    
    if (!confirm(`Bạn có chắc muốn xóa thông số kỹ thuật của xe "${vehicleName}"?\n\nHành động này không thể hoàn tác!`)) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${urls.vehicleSpecs}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Xóa thông số kỹ thuật thành công!');
            await loadVehicleSpecs();
        } else {
            const errorData = await response.text();
            alert(`❌ Lỗi khi xóa: ${errorData}`);
        }
    } catch (error) {
        console.error('Error deleting spec:', error);
        alert('❌ Lỗi kết nối khi xóa dữ liệu');
    }
}

// =====================
// Cancel Form
// =====================
function cancelForm() {
    const formContainer = document.getElementById('vehiclespec-form');
    const listContainer = document.getElementById('vehiclespec-list');
    
    formContainer.style.display = 'none';
    listContainer.style.display = 'block';
    
    // Reset form
    const form = document.getElementById('spec-form');
    if (form) {
        form.reset();
        document.getElementById('spec-id').value = '';
    }
}
