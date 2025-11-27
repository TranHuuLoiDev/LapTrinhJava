import { urls } from './config.js';
import { fetchJson } from './utils.js';

// =====================
// Dashboard tổng hợp
// =====================
export async function loadDashboard() {
    try {
        const [v, c, o, f, t] = await Promise.all([
            fetchJson(urls.vehicles),
            fetchJson(urls.customers),
            fetchJson(urls.orders),
            fetchJson(urls.feedbacks),
            fetchJson(urls.testdrives)
        ]);

        document.getElementById("totalVehicles").textContent = `Xe: ${v.length}`;
        document.getElementById("totalCustomers").textContent = `Khách hàng: ${c.length}`;
        document.getElementById("totalOrders").textContent = `Đơn hàng: ${o.length}`;
        document.getElementById("totalFeedbacks").textContent = `Phản hồi: ${f.length}`;
        document.getElementById("totalTestDrives").textContent = `Lái thử: ${t.length}`;

        // Biểu đồ doanh thu giả lập
        const ctx = document.getElementById("salesChart");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11"],
                datasets: [{
                    label: "Doanh thu (tỷ VND)",
                    data: [5, 7, 9, 6, 10, 8],
                    backgroundColor: "#3b82f680"
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    } catch (err) {
        console.error("Lỗi Dashboard:", err);
    }
}
