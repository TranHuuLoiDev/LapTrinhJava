// =====================
// Vehicle Specifications Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allSpecs = [];

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
                    <th>Dung lượng pin (kWh)</th>
                    <th>Tầm hoạt động (km)</th>
                    <th>Thời gian sạc (h)</th>
                    <th>Công suất (HP)</th>
                    <th>Tốc độ tối đa (km/h)</th>
                    <th>Số chỗ ngồi</th>
                    ${canEdit || canDelete ? '<th>Thao tác</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${specs.map(spec => `
                    <tr>
                        <td>${spec.specId || 'N/A'}</td>
                        <td>${spec.vehicleId || 'N/A'}</td>
                        <td>${spec.batteryCapacity || 'N/A'}</td>
                        <td>${spec.rangeKm || 'N/A'}</td>
                        <td>${spec.chargingTime || 'N/A'}</td>
                        <td>${spec.motorPower || 'N/A'}</td>
                        <td>${spec.maxSpeed || 'N/A'}</td>
                        <td>${spec.seats || 'N/A'}</td>
                        ${canEdit || canDelete ? `
                            <td>
                                ${canEdit ? `<button class="btn-edit" onclick="editVehicleSpec(${spec.specId})"></button>` : ''}
                                ${canDelete ? `<button class="btn-delete" onclick="deleteVehicleSpec(${spec.specId})"></button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

export function editVehicleSpec(id) {
    const spec = allSpecs.find(s => s.specId === id);
    if (!spec) return;
    
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
    document.getElementById('spec-dimensions').value = spec.dimensions || '';
    document.getElementById('spec-weight').value = spec.weight || '';
    document.getElementById('spec-drive').value = spec.driveType || '';
}

export async function saveVehicleSpec() {
    const specId = document.getElementById('spec-id').value;
    const data = {
        vehicleId: parseInt(document.getElementById('spec-vehicle-id').value),
        batteryCapacity: document.getElementById('spec-battery').value,
        rangeKm: parseInt(document.getElementById('spec-range').value),
        chargingTime: document.getElementById('spec-charging').value,
        motorPower: document.getElementById('spec-power').value,
        maxSpeed: parseInt(document.getElementById('spec-speed').value),
        seats: parseInt(document.getElementById('spec-seats').value),
        trunkCapacity: document.getElementById('spec-trunk').value,
        groundClearance: document.getElementById('spec-clearance').value,
        wheelbase: document.getElementById('spec-wheelbase').value,
        dimensions: document.getElementById('spec-dimensions').value,
        weight: document.getElementById('spec-weight').value,
        driveType: document.getElementById('spec-drive').value
    };
    
    try {
        const method = specId ? 'PUT' : 'POST';
        const url = specId ? `${urls.vehicleSpecs}/${specId}` : urls.vehicleSpecs;
        
        const response = await fetchWithAuth(url, {
            method,
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Lưu thông số kỹ thuật thành công!');
            resetVehicleSpecForm();
            loadVehicleSpecs();
        } else {
            alert('Lỗi khi lưu thông số kỹ thuật');
        }
    } catch (error) {
        console.error('Error saving spec:', error);
        alert('Lỗi kết nối');
    }
}

export async function deleteVehicleSpec(id) {
    if (!confirm('Bạn có chắc muốn xóa thông số kỹ thuật này?')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.vehicleSpecs}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa thành công!');
            loadVehicleSpecs();
        } else {
            alert('Lỗi khi xóa');
        }
    } catch (error) {
        console.error('Error deleting spec:', error);
        alert('Lỗi kết nối');
    }
}

export function resetVehicleSpecForm() {
    document.getElementById('vehiclespec-form').reset();
    document.getElementById('spec-id').value = '';
}
