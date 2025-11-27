import { urls } from './config.js';
import { fetchJson } from './utils.js';

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

    const payload = {
        customerId: parseInt(document.getElementById("so-customer").value),
        totalAmount: parseFloat(document.getElementById("so-total").value),
        status: document.getElementById("so-status").value,
        paymentMethod: document.getElementById("so-payment").value,
        orderDate: document.getElementById("so-date").value || (existingOrder && existingOrder.orderDate ? existingOrder.orderDate.split("T")[0] : null),
        deliveryDateExpected: document.getElementById("so-delivery-exp").value || (existingOrder && existingOrder.deliveryDateExpected ? existingOrder.deliveryDateExpected.split("T")[0] : null),
        deliveryDateActual: document.getElementById("so-delivery-act").value || (existingOrder && existingOrder.deliveryDateActual ? existingOrder.deliveryDateActual.split("T")[0] : null),

        dealerId: existingOrder ? existingOrder.dealerId : 1,
        salespersonId: existingOrder ? existingOrder.salespersonId : 1
    };

    if (!payload.customerId) {
        alert("Vui lòng chọn khách hàng!");
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
    document.getElementById("so-id").value = "";
    document.getElementById("so-customer").value = "";
    document.getElementById("so-total").value = "";
    document.getElementById("so-status").value = "Pending";
    document.getElementById("so-payment").value = "";
    document.getElementById("so-date").value = "";
    document.getElementById("so-delivery-exp").value = "";
    document.getElementById("so-delivery-act").value = "";
}
