import { urls } from './config.js';
import { fetchJson } from './utils.js';

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
    document.getElementById("td-id").value = t.testDriveId;
    document.getElementById("td-customer").value = t.customerId;
    document.getElementById("td-vehicle").value = t.vehicleId;
    document.getElementById("td-date").value = t.preferredDate;
    document.getElementById("td-time").value = t.preferredTime;
    document.getElementById("td-status").value = t.status;
    document.getElementById("td-note").value = t.note || '';
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
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(`Lỗi cập nhật: ${res.status}`);
        } else {
            const res = await fetch(urls.testdrives, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        const res = await fetch(`${urls.testdrives}/${id}`, { method: "DELETE" });
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
    document.getElementById("td-id").value = '';
    document.getElementById("td-customer").value = '';
    document.getElementById("td-vehicle").value = '';
    document.getElementById("td-date").value = '';
    document.getElementById("td-time").value = '';
    document.getElementById("td-status").value = 'Pending';
    document.getElementById("td-note").value = '';
}
    