// =====================
// Vehicle Comparison Module
// So sánh mẫu xe và tính năng
// =====================
import { urls } from '../config.js';
import { fetchWithAuth } from '../auth.js';

let allVehicles = [];
let allSpecs = [];
let selectedVehicles = [];

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h2>So sánh xe điện</h2>
            <p style="color: #666;">Chọn 2 hoặc 3 xe để so sánh thông số kỹ thuật</p>
        </div>
        
        <div id="vehicle-selector" style="margin-bottom: 30px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <div class="vehicle-select-box">
                    <h3>Xe thứ 1</h3>
                    <select id="vehicle-1" class="vehicle-dropdown" onchange="window.vehicleCompareModule.selectVehicle(1, this.value)">
                        <option value="">-- Chọn xe --</option>
                    </select>
                    <div id="vehicle-1-info" class="vehicle-info"></div>
                </div>
                
                <div class="vehicle-select-box">
                    <h3>Xe thứ 2</h3>
                    <select id="vehicle-2" class="vehicle-dropdown" onchange="window.vehicleCompareModule.selectVehicle(2, this.value)">
                        <option value="">-- Chọn xe --</option>
                    </select>
                    <div id="vehicle-2-info" class="vehicle-info"></div>
                </div>
                
                <div class="vehicle-select-box">
                    <h3>Xe thứ 3 (tùy chọn)</h3>
                    <select id="vehicle-3" class="vehicle-dropdown" onchange="window.vehicleCompareModule.selectVehicle(3, this.value)">
                        <option value="">-- Chọn xe --</option>
                    </select>
                    <div id="vehicle-3-info" class="vehicle-info"></div>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="window.vehicleCompareModule.compareVehicles()" class="btn-primary" 
                    style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                    So sánh
                </button>
                <button onclick="window.vehicleCompareModule.resetComparison()" class="btn-secondary"
                    style="padding: 12px 30px; background: #e2e8f0; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-left: 10px;">
                    Đặt lại
                </button>
            </div>
        </div>
        
        <div id="comparison-result" style="display: none;"></div>
        
        <style>
            .vehicle-select-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .vehicle-select-box h3 {
                margin: 0 0 15px 0;
                color: #333;
            }
            
            .vehicle-dropdown {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .vehicle-info {
                margin-top: 15px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 4px;
                min-height: 100px;
            }
            
            .vehicle-info img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
                margin-bottom: 10px;
            }
            
            .comparison-table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            
            .comparison-table th {
                background: #667eea;
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 600;
            }
            
            .comparison-table td {
                padding: 12px 15px;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .comparison-table tr:hover {
                background: #f8f9fa;
            }
            
            .spec-label {
                font-weight: 600;
                color: #4a5568;
                background: #f7fafc;
            }
            
            .highlight-best {
                background: #d4edda !important;
                font-weight: bold;
                color: #155724;
            }
            
            .category-header {
                background: #e2e8f0 !important;
                font-weight: bold;
                color: #2d3748;
                text-transform: uppercase;
                font-size: 13px;
            }
        </style>
    `;
    
    // Expose functions to window
    window.vehicleCompareModule = {
        selectVehicle,
        compareVehicles,
        resetComparison,
        saveComparison
    };
    
    await loadVehicles();
    await loadAllSpecs();
}

// =====================
// Load Vehicles
// =====================
async function loadVehicles() {
    try {
        const response = await fetchWithAuth(urls.vehicles);
        const data = await response.json();
        allVehicles = Array.isArray(data) ? data : [];
        console.log('Loaded vehicles:', allVehicles.length);
        
        // Populate dropdowns
        for (let i = 1; i <= 3; i++) {
            const dropdown = document.getElementById(`vehicle-${i}`);
            if (dropdown) {
                allVehicles.forEach(vehicle => {
                    const option = document.createElement('option');
                    option.value = vehicle.vehicleId || vehicle.vehicle_id;
                    const modelName = vehicle.modelName || vehicle.model_name || 'Unknown';
                    const version = vehicle.version || '';
                    const color = vehicle.color || '';
                    option.textContent = `${modelName} ${version} - ${color}`;
                    dropdown.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading vehicles:', error);
        allVehicles = [];
        alert('Không thể tải danh sách xe');
    }
}

// =====================
// Load All Specs
// =====================
async function loadAllSpecs() {
    try {
        const response = await fetchWithAuth(urls.vehicleSpecs);
        if (!response.ok) {
            console.warn('Failed to load specs from API, status:', response.status);
            // Fallback to hardcoded data for testing
            allSpecs = [
                {vehicleId: 1, batteryCapacity: '87.7 kWh', rangeKm: 420, chargingTime: '7h (AC 11kW) / 31 phút (DC 150kW)', motorPower: '260 kW / 350 hp', maxSpeed: 200, seats: 7, trunkCapacity: '376L - 1373L', groundClearance: '175mm', wheelbase: '2950mm', lengthWidthHeight: '4750 x 1934 x 1667', curbWeight: '2100 kg', driveType: 'AWD'},
                {vehicleId: 2, batteryCapacity: '123 kWh', rangeKm: 594, chargingTime: '10h (AC 11kW) / 35 phút (DC 150kW)', motorPower: '300 kW / 402 hp', maxSpeed: 200, seats: 7, trunkCapacity: '423L - 1610L', groundClearance: '198mm', wheelbase: '3050mm', lengthWidthHeight: '5123 x 1976 x 1750', curbWeight: '2450 kg', driveType: 'AWD'},
                {vehicleId: 3, batteryCapacity: '42 kWh', rangeKm: 285, chargingTime: '5h (AC 11kW) / 24 phút (DC 100kW)', motorPower: '110 kW / 147 hp', maxSpeed: 160, seats: 5, trunkCapacity: '374L', groundClearance: '175mm', wheelbase: '2611mm', lengthWidthHeight: '4300 x 1793 x 1613', curbWeight: '1650 kg', driveType: 'FWD'},
                {vehicleId: 4, batteryCapacity: '60 kWh', rangeKm: 491, chargingTime: '8h (AC 11kW) / 27 phút (DC 170kW)', motorPower: '208 kW / 283 hp', maxSpeed: 233, seats: 5, trunkCapacity: '682L', groundClearance: '140mm', wheelbase: '2875mm', lengthWidthHeight: '4720 x 1850 x 1443', curbWeight: '1844 kg', driveType: 'RWD'},
                {vehicleId: 5, batteryCapacity: '60.48 kWh', rangeKm: 420, chargingTime: '6.5h (AC 11kW) / 30 phút (DC 88kW)', motorPower: '150 kW / 204 hp', maxSpeed: 160, seats: 5, trunkCapacity: '440L', groundClearance: '175mm', wheelbase: '2720mm', lengthWidthHeight: '4455 x 1875 x 1615', curbWeight: '1750 kg', driveType: 'FWD'}
            ];
            console.log('Using fallback specs data:', allSpecs.length);
            return;
        }
        const data = await response.json();
        allSpecs = Array.isArray(data) ? data : [];
        console.log('Loaded specs from API:', allSpecs.length, allSpecs);
    } catch (error) {
        console.error('Error loading specs:', error);
        allSpecs = [];
    }
}

// =====================
// Select Vehicle
// =====================
async function selectVehicle(index, vehicleId) {
    const arrayIndex = index - 1; // Convert 1,2,3 to 0,1,2
    
    if (!vehicleId) {
        selectedVehicles[arrayIndex] = null;
        document.getElementById(`vehicle-${index}-info`).innerHTML = '';
        return;
    }
    
    const vehicleIdNum = vehicle => getProp(vehicle, 'vehicleId', 'vehicle_id');
    const vehicle = Array.isArray(allVehicles) ? allVehicles.find(v => vehicleIdNum(v) == vehicleId) : null;
    
    // Get spec from cache (all specs are loaded at init)
    let spec = Array.isArray(allSpecs) ? allSpecs.find(s => {
        const specVehicleId = getProp(s, 'vehicleId', 'vehicle_id');
        return specVehicleId == vehicleId;
    }) : null;
    
    console.log('Selected vehicle:', vehicle, 'spec:', spec, 'vehicleId:', vehicleId);
    
    if (vehicle) {
        selectedVehicles[arrayIndex] = { vehicle, spec };
        displayVehicleInfo(index, vehicle, spec);
    }
}

// =====================
// Display Vehicle Info
// =====================
function displayVehicleInfo(index, vehicle, spec) {
    const infoDiv = document.getElementById(`vehicle-${index}-info`);
    
    const modelName = getProp(vehicle, 'modelName', 'model_name') || 'Unknown';
    const version = getProp(vehicle, 'version') || '';
    const color = getProp(vehicle, 'color') || '';
    const price = getProp(vehicle, 'retailPrice', 'retail_price') || 0;
    
    infoDiv.innerHTML = `
        <div style="font-size: 14px;">
            <p><strong>${modelName} ${version}</strong></p>
            <p style="color: #666; margin: 5px 0;">Màu: ${color}</p>
            <p style="color: #e53e3e; font-size: 18px; font-weight: bold; margin: 10px 0;">
                ${formatCurrency(price)}
            </p>
            ${spec ? `
                <p style="font-size: 12px; color: #666; margin: 5px 0;">
                    🔋 ${getProp(spec, 'batteryCapacity', 'battery_capacity') || 'N/A'} kWh | 
                    🏃 ${getProp(spec, 'rangeKm', 'range_km') || 'N/A'} km
                </p>
            ` : '<p style="color: #999;">Chưa có thông số kỹ thuật</p>'}
        </div>
    `;
}

// =====================
// Helper functions to get property values (handle both camelCase and snake_case)
// =====================
function getProp(obj, ...keys) {
    for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null) {
            return obj[key];
        }
    }
    return null;
}

// =====================
// Compare Vehicles
// =====================
function compareVehicles() {
    const validVehicles = selectedVehicles.filter(v => v != null);
    
    if (validVehicles.length < 2) {
        alert('Vui lòng chọn ít nhất 2 xe để so sánh');
        return;
    }
    
    const resultDiv = document.getElementById('comparison-result');
    resultDiv.style.display = 'block';
    
    let html = '<h2 style="margin-bottom: 20px;">Kết quả so sánh</h2>';
    html += '<table class="comparison-table">';
    
    // Header row
    html += '<thead><tr><th class="spec-label">Thông số</th>';
    validVehicles.forEach((item, idx) => {
        const modelName = getProp(item.vehicle, 'modelName', 'model_name') || '';
        const version = item.vehicle.version || '';
        const color = item.vehicle.color || '';
        html += `<th>${modelName} ${version}<br><small style="font-weight: normal;">${color}</small></th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Price comparison
    html += '<tr class="category-header"><td colspan="' + (validVehicles.length + 1) + '">Giá bán</td></tr>';
    html += '<tr><td class="spec-label">Giá bán lẻ</td>';
    const prices = validVehicles.map(v => getProp(v.vehicle, 'retailPrice', 'retail_price') || 0);
    const minPrice = Math.min(...prices);
    validVehicles.forEach(item => {
        const price = getProp(item.vehicle, 'retailPrice', 'retail_price');
        const isLowest = price === minPrice;
        html += `<td ${isLowest ? 'class="highlight-best"' : ''}>${formatCurrency(price)}</td>`;
    });
    html += '</tr>';
    
    // Technical specs comparison
    if (validVehicles.some(v => v.spec)) {
        html += '<tr class="category-header"><td colspan="' + (validVehicles.length + 1) + '">Thông số Pin & Phạm vi</td></tr>';
        
        // Battery capacity
        html += '<tr><td class="spec-label">Dung lượng pin (kWh)</td>';
        const batteries = validVehicles.map(v => getProp(v.spec, 'batteryCapacity', 'battery_capacity') || 0);
        const maxBattery = Math.max(...batteries);
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'batteryCapacity', 'battery_capacity') || 'N/A';
            const isHighest = value !== 'N/A' && value === maxBattery && maxBattery > 0;
            html += `<td ${isHighest ? 'class="highlight-best"' : ''}>${value}</td>`;
        });
        html += '</tr>';
        
        // Range
        html += '<tr><td class="spec-label">Phạm vi hoạt động (km)</td>';
        const ranges = validVehicles.map(v => getProp(v.spec, 'rangeKm', 'range_km') || 0);
        const maxRange = Math.max(...ranges);
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'rangeKm', 'range_km') || 'N/A';
            const isHighest = value !== 'N/A' && value === maxRange && maxRange > 0;
            html += `<td ${isHighest ? 'class="highlight-best"' : ''}>${value}</td>`;
        });
        html += '</tr>';
        
        // Charging time
        html += '<tr><td class="spec-label">Thời gian sạc (giờ)</td>';
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'chargingTime', 'charging_time') || 'N/A';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
        
        // Performance specs
        html += '<tr class="category-header"><td colspan="' + (validVehicles.length + 1) + '">Hiệu suất</td></tr>';
        
        // Motor power
        html += '<tr><td class="spec-label">Công suất động cơ (kW)</td>';
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'motorPower', 'motor_power') || 'N/A';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
        
        // Top speed
        html += '<tr><td class="spec-label">Tốc độ tối đa (km/h)</td>';
        const speeds = validVehicles.map(v => getProp(v.spec, 'maxSpeed', 'max_speed') || 0);
        const maxSpeed = Math.max(...speeds);
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'maxSpeed', 'max_speed') || 'N/A';
            const isHighest = value !== 'N/A' && value === maxSpeed && maxSpeed > 0;
            html += `<td ${isHighest ? 'class="highlight-best"' : ''}>${value}</td>`;
        });
        html += '</tr>';
        
        // Interior specs
        html += '<tr class="category-header"><td colspan="' + (validVehicles.length + 1) + '">Nội thất</td></tr>';
        
        // Seats
        html += '<tr><td class="spec-label">Số chỗ ngồi</td>';
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'seats') || 'N/A';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
        
        // Trunk capacity
        html += '<tr><td class="spec-label">Dung tích cốp (lít)</td>';
        const trunks = validVehicles.map(v => getProp(v.spec, 'trunkCapacity', 'trunk_capacity'));
        const maxTrunk = 0; // Trunk capacity is string, don't compare
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'trunkCapacity', 'trunk_capacity') || 'N/A';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
        
        // Dimensions
        html += '<tr class="category-header"><td colspan="' + (validVehicles.length + 1) + '">Kích thước & Trọng lượng</td></tr>';
        
        html += '<tr><td class="spec-label">Kích thước (D×R×C) mm</td>';
        validVehicles.forEach(item => {
            const dims = getProp(item.spec, 'lengthWidthHeight', 'length_width_height') || 'N/A';
            html += `<td>${dims}</td>`;
        });
        html += '</tr>';
        
        html += '<tr><td class="spec-label">Khoảng sáng gầm (mm)</td>';
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'groundClearance', 'ground_clearance') || 'N/A';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
        
        html += '<tr><td class="spec-label">Chiều dài cơ sở (mm)</td>';
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'wheelbase') || 'N/A';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
        
        html += '<tr><td class="spec-label">Trọng lượng (kg)</td>';
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'curbWeight', 'curb_weight') || 'N/A';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
        
        html += '<tr><td class="spec-label">Hệ dẫn động</td>';
        validVehicles.forEach(item => {
            const value = getProp(item.spec, 'driveType', 'drive_type') || 'N/A';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    
    resultDiv.innerHTML = html;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =====================
// Reset Comparison
// =====================
function resetComparison() {
    selectedVehicles = [];
    
    for (let i = 1; i <= 3; i++) {
        const dropdown = document.getElementById(`vehicle-${i}`);
        if (dropdown) dropdown.value = '';
        
        const infoDiv = document.getElementById(`vehicle-${i}-info`);
        if (infoDiv) infoDiv.innerHTML = '';
    }
    
    const resultDiv = document.getElementById('comparison-result');
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';
}

// =====================
// Save Comparison
// =====================
async function saveComparison() {
    const validVehicles = selectedVehicles.filter(v => v != null);
    
    if (validVehicles.length < 2) {
        alert('Không có dữ liệu so sánh để lưu');
        return;
    }
    
    try {
        const comparisonData = {
            vehicle_1_id: getProp(validVehicles[0]?.vehicle, 'vehicleId', 'vehicle_id'),
            vehicle_2_id: getProp(validVehicles[1]?.vehicle, 'vehicleId', 'vehicle_id'),
            vehicle_3_id: validVehicles[2] ? getProp(validVehicles[2].vehicle, 'vehicleId', 'vehicle_id') : null,
            comparison_date: new Date().toISOString().split('T')[0],
            notes: 'So sánh từ giao diện web',
            result: 'Đã xem và so sánh'
        };
        
        // Note: Backend API cần có endpoint POST /api/vehicle-comparisons
        const response = await fetchWithAuth(urls.vehicleComparisons || urls.base + '/vehicle-comparisons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comparisonData)
        });
        
        if (response.ok) {
            alert('✅ Đã lưu lịch sử so sánh!');
        } else {
            throw new Error('Failed to save comparison');
        }
    } catch (error) {
        console.error('Error saving comparison:', error);
        alert('⚠️ Không thể lưu so sánh. Bạn có thể in hoặc chụp màn hình để lưu lại.');
    }
}

// =====================
// Format Currency
// =====================
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}
