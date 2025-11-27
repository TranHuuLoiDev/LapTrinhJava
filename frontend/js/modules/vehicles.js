import { urls } from '../config.js';
import { fetchJson } from './utils.js';

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = '<div id="vehicle-list">Đang tải...</div>';
    await loadVehicles();
}

// =====================
// Load từng bảng
// =====================
export async function loadVehicles() {
    const container = document.getElementById("vehicle-list");
    try {
        const data = await fetchJson(urls.vehicles);
        container.innerHTML = `<table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên xe</th>
                    <th>Màu</th>
                    <th>Phiên bản</th>
                    <th>Giá bán</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(v => `<tr>
                    <td>${v.vehicleId}</td>
                    <td>${v.modelName}</td>
                    <td>${v.color}</td>
                    <td>${v.version}</td>
                    <td>${(v.retailPrice ?? 0).toLocaleString("vi-VN")} ₫</td>
                </tr>`).join("")}
            </tbody>
        </table>`;
    } catch {
        container.innerHTML = "Không thể tải dữ liệu xe.";
    }
}
