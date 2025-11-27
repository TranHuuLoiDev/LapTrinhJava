import { urls } from './config.js';
import { fetchJson } from './utils.js';
import { initEvmDashboard } from './evmdashboard.js';

// =====================
// Auth Check
// =====================
const AUTH_API = 'http://localhost:8080/api/session';

async function checkAuthentication() {
    // Skip auth check if on login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }

    try {
        const response = await fetch(`${AUTH_API}/check`, {
            credentials: 'include'
        });

        const data = await response.json();

        if (!data.success) {
            // Not logged in, redirect to login
            window.location.href = 'login.html';
            return;
        }

        // Update admin info in header
        const user = data.user;
        const adminInfoSpan = document.querySelector('.admin-info span');
        if (adminInfoSpan) {
            adminInfoSpan.textContent = user.fullName;
        }

        // Store user info
        localStorage.setItem('user', JSON.stringify(user));

    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = 'login.html';
    }
}

// =====================
// Logout Function
// =====================
window.logout = async function() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    try {
        await fetch(`${AUTH_API}/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';

    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = 'login.html';
    }
};

// =====================
// Load Sales Orders (giống TestDrive)
// =====================
export async function loadSalesOrders() {
    const container = document.getElementById("salesorder-list");
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
// Edit (giống TestDrive)
// =====================
export function editSalesOrder(id) {
    const o = window.salesOrderData[id];
    if (!o) return;

    document.getElementById("so-id").value = o.orderId;
    document.getElementById("so-customer").value = o.customerId;
    document.getElementById("so-total").value = o.totalAmount;
    document.getElementById("so-status").value = o.status;
    document.getElementById("so-payment").value = o.paymentMethod;
    document.getElementById("so-date").value = o.orderDate || "";
    document.getElementById("so-delivery-exp").value = o.deliveryDateExpected || "";
    document.getElementById("so-delivery-act").value = o.deliveryDateActual || "";
}

// =====================
// Save (POST / PUT) — giống TestDrive
// =====================
export async function saveSalesOrder() {
    const id = document.getElementById("so-id").value;

    const payload = {
        customerId: document.getElementById("so-customer").value,
        totalAmount: document.getElementById("so-total").value,
        status: document.getElementById("so-status").value,
        paymentMethod: document.getElementById("so-payment").value,
        orderDate: document.getElementById("so-date").value,
        deliveryDateExpected: document.getElementById("so-delivery-exp").value,
        deliveryDateActual: document.getElementById("so-delivery-act").value
    };

    if (!payload.customerId) {
        alert("Vui lòng chọn khách hàng!");
        return;
    }

    try {
        if (id) {
            // PUT update
            const res = await fetch(`${urls.orders}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Lỗi cập nhật!");
        } else {
            // POST create
            const res = await fetch(urls.orders, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Lỗi tạo mới!");
        }

        alert("Lưu thành công!");
        resetSalesOrderForm();
        loadSalesOrders();

    } catch (err) {
        alert(err.message);
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

// =====================
// Initialize EVM Dashboard
// =====================
window.addEventListener('DOMContentLoaded', async () => {
    // Check authentication first
    await checkAuthentication();

    // Check if we're on EVM Dashboard page
    const evmDashboardSection = document.getElementById('evmdashboard');
    if (evmDashboardSection && !evmDashboardSection.classList.contains('hidden')) {
        initEvmDashboard();
    }
});

// Export for global access
window.initEvmDashboard = initEvmDashboard;
