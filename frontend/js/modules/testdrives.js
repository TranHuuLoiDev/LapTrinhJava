import { urls } from '../config.js';
import { fetchJson } from './utils.js';

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div id="testdrive-list">Đang tải...</div>
        <div id="testdrive-form" style="display: none; margin-top: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 20px;"> Form Sửa Lái thử</h3>
            <input type="hidden" id="td-id">
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Khách hàng:</label>
                <select id="td-customer" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">Chọn khách hàng</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Xe:</label>
                <select id="td-vehicle" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">Chọn xe</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Ngày:</label>
                    <input type="date" id="td-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Giờ:</label>
                    <input type="time" id="td-time" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Trạng thái:</label>
                <select id="td-status" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Ghi chú:</label>
                <textarea id="td-note" placeholder="Nhập ghi chú..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px;"></textarea>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="window.testDriveModule.saveTestDrive()" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Lưu</button>
                <button onclick="window.testDriveModule.resetForm()" style="flex: 1; padding: 10px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"> Hủy</button>
            </div>
        </div>
    `;
    
    // Expose functions to window
    window.testDriveModule = {
        editTestDrive,
        deleteTestDrive,
        saveTestDrive,
        resetForm
    };
    
    // Make functions globally accessible for inline onclick
    window.editTestDrive = editTestDrive;
    window.deleteTestDrive = deleteTestDrive;
    
    await loadTestDrives();
    await loadDropdownData();
}

// =====================
// Load TestDrives với nút Sửa/Xóa
// =====================
export async function loadTestDrives() {
    const container = document.getElementById("testdrive-list");
    container.innerHTML = "Đang tải dữ liệu...";
    try {
        const [data, customers, vehicles] = await Promise.all([
            fetchJson(urls.testdrives),
            fetchJson(urls.customers),
            fetchJson(urls.vehicles)
        ]);

        const customerMap = {};
        customers.forEach(c => customerMap[c.customerId] = c.fullName);
        const vehicleMap = {};
        vehicles.forEach(v => vehicleMap[v.vehicleId] = v.modelName);

        container.innerHTML = `<table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Xe</th>
                    <th>Ngày giờ</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(t => `<tr>
                    <td>${t.testDriveId}</td>
                    <td>${customerMap[t.customerId] || 'Khách lạ'}</td>
                    <td>${vehicleMap[t.vehicleId] || 'Xe lạ'}</td>
                    <td>${t.preferredDate} ${t.preferredTime}</td>
                    <td>${t.status}</td>
                    <td>${t.note || 'Không có'}</td>
                    <td>
                        <button onclick='editTestDrive(${t.testDriveId})'>Sửa</button>
                        <button onclick='deleteTestDrive(${t.testDriveId})'>Xóa</button>
                    </td>
                </tr>`).join("")}
            </tbody>
        </table>`;

        // Lưu data tạm để dùng khi edit
        window.testDriveData = {};
        data.forEach(t => window.testDriveData[t.testDriveId] = t);

    } catch (err) {
        container.innerHTML = `<p style="color:red;">Không thể tải dữ liệu lái thử: ${err.message}</p>`;
    }
}

// =====================
// Edit TestDrive
// =====================
export function editTestDrive(id) {
    const t = window.testDriveData[id];
    if (!t) return;
    
    // Show form
    const form = document.getElementById("testdrive-form");
    if (form) form.style.display = 'block';
    
    // Populate form fields
    document.getElementById("td-id").value = t.testDriveId;
    document.getElementById("td-customer").value = t.customerId;
    document.getElementById("td-vehicle").value = t.vehicleId;
    document.getElementById("td-date").value = t.preferredDate;
    document.getElementById("td-time").value = t.preferredTime;
    document.getElementById("td-status").value = t.status;
    document.getElementById("td-note").value = t.note || '';
}

// =====================
// Load dropdown data
// =====================
async function loadDropdownData() {
    try {
        const [customers, vehicles] = await Promise.all([
            fetchJson(urls.customers),
            fetchJson(urls.vehicles)
        ]);
        
        const customerSelect = document.getElementById("td-customer");
        const vehicleSelect = document.getElementById("td-vehicle");
        
        if (customerSelect) {
            customerSelect.innerHTML = '<option value="">Chọn khách hàng</option>' + 
                customers.map(c => `<option value="${c.customerId}">${c.fullName}</option>`).join('');
        }
        
        if (vehicleSelect) {
            vehicleSelect.innerHTML = '<option value="">Chọn xe</option>' + 
                vehicles.map(v => `<option value="${v.vehicleId}">${v.modelName} - ${v.color}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading dropdown data:', error);
    }
}

// =====================
// Save TestDrive (POST / PUT)
// =====================
export async function saveTestDrive() {
    const id = document.getElementById("td-id").value;
    const customerId = document.getElementById("td-customer").value;
    const vehicleId = document.getElementById("td-vehicle").value;
    const preferredDate = document.getElementById("td-date").value;
    const preferredTime = document.getElementById("td-time").value;
    const status = document.getElementById("td-status").value;
    const note = document.getElementById("td-note").value;

    if (!customerId || !vehicleId || !preferredDate || !preferredTime) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const payload = { customerId, vehicleId, preferredDate, preferredTime, status, note };

    try {
        if (id) {
            const res = await fetch(`${urls.testdrives}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(`Lỗi cập nhật: ${res.status}`);
        } else {
            const res = await fetch(urls.testdrives, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(`Lỗi thêm mới: ${res.status}`);
        }
        alert("Lưu thành công!");
        resetForm();
        loadTestDrives();
    } catch (err) {
        alert(err.message);
    }
}

// =====================
// Delete TestDrive
// =====================
export async function deleteTestDrive(id) {
    if (!confirm("Bạn có chắc muốn xóa lịch lái thử này?")) return;
    try {
        const res = await fetch(`${urls.testdrives}/${id}`, { 
            method: "DELETE",
            credentials: 'include'
        });
        if (!res.ok) throw new Error(`Lỗi xóa: ${res.status}`);
        alert("Xóa thành công!");
        loadTestDrives();
    } catch (err) {
        alert(err.message);
    }
}

// =====================
// Reset Form
// =====================
export function resetForm() {
    const form = document.getElementById("testdrive-form");
    if (form) form.style.display = 'none';
    
    document.getElementById("td-id").value = '';
    document.getElementById("td-customer").value = '';
    document.getElementById("td-vehicle").value = '';
    document.getElementById("td-date").value = '';
    document.getElementById("td-time").value = '';
    document.getElementById("td-status").value = 'Pending';
    document.getElementById("td-note").value = '';
}
    
