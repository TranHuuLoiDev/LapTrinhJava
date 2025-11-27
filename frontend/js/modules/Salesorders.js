import { urls } from '../config.js';
import { fetchJson } from './utils.js';

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = `
        <div class="content-section">
            <div class="section-header">
                <h2>Đơn hàng</h2>
                <button class="btn-primary" onclick="window.showOrderForm()">+ Thêm đơn hàng</button>
            </div>
            
            <div id="order-form" style="display: none; background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 id="form-title">Thêm đơn hàng mới</h3>
                <input type="hidden" id="so-id">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                    <div>
                        <label>Khách hàng *</label>
                        <select id="so-customer" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></select>
                    </div>
                    <div>
                        <label>Tổng tiền *</label>
                        <input type="number" id="so-total" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label>Trạng thái *</label>
                        <select id="so-status" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Quotation">Quotation</option>
                        </select>
                    </div>
                    <div>
                        <label>Thanh toán *</label>
                        <select id="so-payment" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="Cash">Cash</option>
                            <option value="Installment">Installment</option>
                        </select>
                    </div>
                    <div>
                        <label>Ngày đặt</label>
                        <input type="date" id="so-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label>Dự kiến giao</label>
                        <input type="date" id="so-delivery-exp" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label>Thực tế giao</label>
                        <input type="date" id="so-delivery-act" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button onclick="window.saveSalesOrder()" class="btn-primary">Lưu</button>
                    <button onclick="window.resetSalesOrderForm()" class="btn-secondary">Hủy</button>
                </div>
            </div>
            
            <div id="order-list">Đang tải...</div>
        </div>
    `;
    
    // Expose functions to window
    window.showOrderForm = showOrderForm;
    window.saveSalesOrder = saveSalesOrder;
    window.editSalesOrder = editSalesOrder;
    window.deleteSalesOrder = deleteSalesOrder;
    window.resetSalesOrderForm = resetSalesOrderForm;
    
    await loadCustomerDropdown();
    await loadSalesOrders();
}

// Show/hide form
function showOrderForm() {
    const form = document.getElementById('order-form');
    if (!form) {
        console.error('Order form not found!');
        return;
    }
    
    console.log('Toggling order form, current display:', form.style.display);
    
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        document.getElementById('form-title').textContent = 'Thêm đơn hàng mới';
    } else {
        form.style.display = 'none';
    }
}

// =====================
// Load Sales Orders (giống TestDrive)
// =====================
export async function loadSalesOrders() {
    const container = document.getElementById("order-list");
    container.innerHTML = "Đang tải dữ liệu...";

    try {
        const [orders, customers] = await Promise.all([
            fetchJson(urls.orders),
            fetchJson(urls.customers)
        ]);

        const customerMap = {};
        customers.forEach(c => customerMap[c.customerId] = c.fullName);

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thanh toán</th>
                        <th>Ngày đặt</th>
                        <th>Dự kiến giao</th>
                        <th>Thực tế giao</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(o => `
                        <tr>
                            <td>${o.orderId}</td>
                            <td>${customerMap[o.customerId] || "Không rõ"}</td>
                            <td>${o.totalAmount}</td>
                            <td>${o.status}</td>
                            <td>${o.paymentMethod}</td>
                            <td>${o.orderDate || ""}</td>
                            <td>${o.deliveryDateExpected || ""}</td>
                            <td>${o.deliveryDateActual || ""}</td>
                            <td>
                                <button onclick="editSalesOrder(${o.orderId})">Sửa</button>
                                <button onclick="deleteSalesOrder(${o.orderId})">Xóa</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        // Lưu cache — giống TestDrive
        window.salesOrderData = {};
        orders.forEach(o => window.salesOrderData[o.orderId] = o);

    } catch (err) {
        container.innerHTML = `<p style="color:red;">Không thể tải dữ liệu: ${err.message}</p>`;
    }
}

// =====================
// Load Customer Dropdown
// =====================
export async function loadCustomerDropdown() {
    const select = document.getElementById("so-customer");
    if (!select) return; // Element chưa tồn tại
    
    try {
        const customers = await fetchJson(urls.customers);

        select.innerHTML = `<option value="">Chọn khách hàng</option>` +
            customers.map(c => 
                `<option value="${c.customerId}">${c.fullName}</option>`
            ).join("");

    } catch (err) {
        select.innerHTML = `<option value="">Lỗi tải khách hàng</option>`;
    }
}


// =====================
// Edit (giống TestDrive)
// =====================
export function editSalesOrder(id) {
    const o = window.salesOrderData[id];
    if (!o) return;

    // Show form
    document.getElementById('order-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Sửa đơn hàng';

    // Lấy chỉ phần ngày "YYYY-MM-DD" cho input type="date"
    document.getElementById("so-id").value = o.orderId;
    document.getElementById("so-customer").value = o.customerId;
    document.getElementById("so-total").value = o.totalAmount;
    document.getElementById("so-status").value = o.status;
    document.getElementById("so-payment").value = o.paymentMethod;
    document.getElementById("so-date").value = o.orderDate ? o.orderDate.split("T")[0] : "";
    document.getElementById("so-delivery-exp").value = o.deliveryDateExpected ? o.deliveryDateExpected.split("T")[0] : "";
    document.getElementById("so-delivery-act").value = o.deliveryDateActual ? o.deliveryDateActual.split("T")[0] : "";
}

// =====================
// Save (POST / PUT) — giống TestDrive
// =====================
export async function saveSalesOrder() {
    const id = document.getElementById("so-id").value;
    const existingOrder = id ? window.salesOrderData[id] : null;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const payload = {
        customerId: parseInt(document.getElementById("so-customer").value),
        totalAmount: parseFloat(document.getElementById("so-total").value),
        status: document.getElementById("so-status").value,
        paymentMethod: document.getElementById("so-payment").value,
        orderDate: document.getElementById("so-date").value || today,  // Use today if empty
        deliveryDateExpected: document.getElementById("so-delivery-exp").value || null,
        deliveryDateActual: document.getElementById("so-delivery-act").value || null,
        dealerId: existingOrder ? existingOrder.dealerId : 1,  // Default dealer
        salespersonId: existingOrder ? existingOrder.salespersonId : 4  // Default salesperson (dealer1staff)
    };

    if (!payload.customerId || !payload.totalAmount) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
    }

    try {
        let res;
        if (id) {
            // PUT update
            res = await fetch(`${urls.orders}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } else {
            // POST create
            res = await fetch(urls.orders, {
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
        document.getElementById('order-form').style.display = 'none';
        resetSalesOrderForm();
        loadSalesOrders();

    } catch (err) {
        console.error(err);
        alert("Lỗi khi lưu đơn hàng: " + err.message);
    }
}




// =====================
// Delete — giống TestDrive
// =====================
export async function deleteSalesOrder(id) {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

    try {
        const res = await fetch(`${urls.orders}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Không thể xóa!");

        alert("Xóa thành công!");
        loadSalesOrders();

    } catch (err) {
        alert(err.message);
    }
}

// =====================
// Reset Form — giống TestDrive
// =====================
export function resetSalesOrderForm() {
    // Don't hide the form, just clear values
    const fields = ['so-id', 'so-customer', 'so-total', 'so-status', 'so-payment', 'so-date', 'so-delivery-exp', 'so-delivery-act'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === 'so-status') {
                el.value = 'Pending';
            } else {
                el.value = '';
            }
        }
    });
}
