import { urls } from '../config.js';
import { fetchJson } from './utils.js';

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div class="content-section">
            <div class="section-header">
                <h2>Khách hàng</h2>
                <button class="btn-primary" onclick="window.showCustomerForm()">+ Thêm khách hàng</button>
            </div>
            
            <div id="customer-form" style="display: none; background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 id="form-title">Thêm khách hàng mới</h3>
                <input type="hidden" id="customer-id">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                    <div>
                        <label>Họ tên *</label>
                        <input type="text" id="customer-name" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label>Điện thoại *</label>
                        <input type="tel" id="customer-phone" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label>Email *</label>
                        <input type="email" id="customer-email" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label>Địa chỉ</label>
                        <input type="text" id="customer-address" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button onclick="window.saveCustomer()" class="btn-primary">Lưu</button>
                    <button onclick="window.resetCustomerForm()" class="btn-secondary">Hủy</button>
                </div>
            </div>
            
            <div id="customer-list">Đang tải...</div>
        </div>
    `;
    
    // Expose functions to window
    window.showCustomerForm = showCustomerForm;
    window.saveCustomer = saveCustomer;
    window.editCustomer = editCustomer;
    window.deleteCustomer = deleteCustomer;
    window.resetCustomerForm = resetCustomerForm;
    
    await loadCustomers();
}

// Show/hide form
function showCustomerForm() {
    const form = document.getElementById('customer-form');
    if (!form) {
        console.error('Customer form not found!');
        return;
    }
    
    console.log('Toggling form, current display:', form.style.display);
    
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        document.getElementById('form-title').textContent = 'Thêm khách hàng mới';
    } else {
        form.style.display = 'none';
    }
}

// =====================
// Load Customers
// =====================
export async function loadCustomers() {
    const container = document.getElementById("customer-list");
    try {
        const data = await fetchJson(urls.customers);
        
        // Save to cache
        window.customerData = {};
        data.forEach(c => window.customerData[c.customerId] = c);
        
        container.innerHTML = `<table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Điện thoại</th>
                    <th>Email</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(cu => `<tr>
                    <td>${cu.customerId}</td>
                    <td>${cu.fullName}</td>
                    <td>${cu.phone}</td>
                    <td>${cu.email}</td>
                    <td>
                        <button class="btn-edit" onclick="window.editCustomer(${cu.customerId})">Sửa</button>
                        <button class="btn-delete" onclick="window.deleteCustomer(${cu.customerId})">Xóa</button>
                    </td>
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

// =====================
// Edit Customer
// =====================
export function editCustomer(id) {
    const c = window.customerData[id];
    if (!c) return;

    // Show form
    document.getElementById('customer-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Sửa khách hàng';

    document.getElementById("customer-id").value = c.customerId;
    document.getElementById("customer-name").value = c.fullName;
    document.getElementById("customer-phone").value = c.phone;
    document.getElementById("customer-email").value = c.email;
    document.getElementById("customer-address").value = c.address || '';
}

// =====================
// Save Customer (POST/PUT)
// =====================
export async function saveCustomer() {
    const id = document.getElementById("customer-id").value;
    const existingCustomer = id ? window.customerData[id] : null;

    const payload = {
        fullName: document.getElementById("customer-name").value,
        phone: document.getElementById("customer-phone").value,
        email: document.getElementById("customer-email").value,
        address: document.getElementById("customer-address").value || null,
        dealerId: existingCustomer ? existingCustomer.dealerId : 1  // Default dealer
    };

    if (!payload.fullName || !payload.phone || !payload.email) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
    }

    try {
        let res;
        if (id) {
            // PUT update
            res = await fetch(`${urls.customers}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } else {
            // POST create
            res = await fetch(urls.customers, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        if (!res.ok) {
            const text = await res.text();
            console.error("API Error:", text);
            throw new Error(`Lỗi API: ${text}`);
        }

        alert("Lưu thành công!");
        resetCustomerForm();
        loadCustomers();

    } catch (err) {
        console.error(err);
        alert("Lỗi khi lưu khách hàng: " + err.message);
    }
}

// =====================
// Delete Customer
// =====================
export async function deleteCustomer(id) {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

    try {
        const res = await fetch(`${urls.customers}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Không thể xóa!");

        alert("Xóa thành công!");
        loadCustomers();

    } catch (err) {
        alert(err.message);
    }
}

// =====================
// Reset Form
// =====================
export function resetCustomerForm() {
    // Don't hide the form, just clear values
    const fields = ['customer-id', 'customer-name', 'customer-phone', 'customer-email', 'customer-address'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}
