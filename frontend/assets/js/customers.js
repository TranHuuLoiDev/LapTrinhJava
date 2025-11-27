import { urls } from './config.js';
import { fetchJson } from './utils.js';

// =====================
// Load Customers
// =====================
export async function loadCustomers() {
    const container = document.getElementById("customer-list");
    try {
        const data = await fetchJson(urls.customers);
        container.innerHTML = `<table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Điện thoại</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(cu => `<tr>
                    <td>${cu.customerId}</td>
                    <td>${cu.fullName}</td>
                    <td>${cu.phone}</td>
                    <td>${cu.email}</td>
                </tr>`).join("")}
            </tbody>
        </table>`;
    } catch {
        container.innerHTML = "Không thể tải dữ liệu khách hàng.";
    }
}

// =====================
// Load dropdown cho Order Form
// =====================
export async function populateOrderSelects() {
    const customers = await fetchJson(urls.customers);
    const vehicles = await fetchJson(urls.vehicles);
    const custSelect = document.getElementById("order-customer");
    const vehSelect = document.getElementById("order-vehicle");
    custSelect.innerHTML = `<option value="">Chọn khách hàng</option>` + customers.map(c => `<option value="${c.customerId}">${c.fullName}</option>`).join("");
    vehSelect.innerHTML = `<option value="">Chọn xe</option>` + vehicles.map(v => `<option value="${v.vehicleId}">${v.modelName}</option>`).join("");
}

// =====================
// Load dropdown cho TestDrive
// =====================
export async function loadCustomerOptions() {
    const select = document.getElementById("td-customer");
    const customers = await fetchJson(urls.customers);
    select.innerHTML = customers.map(c => `<option value="${c.customerId}">${c.fullName}</option>`).join("");
}

export async function loadVehicleOptions() {
    const select = document.getElementById("td-vehicle");
    const vehicles = await fetchJson(urls.vehicles);
    select.innerHTML = vehicles.map(v => `<option value="${v.vehicleId}">${v.modelName}</option>`).join("");
}
