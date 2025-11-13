const urls = {
  vehicles: "http://localhost:8080/api/vehicles",
  customers: "http://localhost:8080/api/customers",
  orders: "http://localhost:8080/api/salesorders",
  feedbacks: "http://localhost:8080/api/feedbacks",
  testdrives: "http://localhost:8080/api/testdrives",
  orderitems: "http://localhost:8080/api/orderitems"
};

// =====================
// Hàm fetch an toàn
// =====================
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);
  return res.json();
}

// =====================
// Chuyển trang
// =====================
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  document.querySelector(`.sidebar li[onclick*="${id}"]`).classList.add("active");

  const titleMap = {
    dashboard: "Dashboard tổng hợp",
    vehicles: "Danh sách xe điện",
    customers: "Danh sách khách hàng",
    orders: "Danh sách đơn hàng",
    feedbacks: "Phản hồi khách hàng",
    testdrives: "Lịch lái thử"
  };
  document.getElementById("page-title").textContent = titleMap[id] || "";
}

// =====================
// Dashboard tổng hợp
// =====================
async function loadDashboard() {
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
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  } catch (err) {
    console.error("Lỗi Dashboard:", err);
  }
}

// =====================
// Load từng bảng
// =====================
async function loadVehicles() {
  const container = document.getElementById("vehicle-list");
  try {
    const data = await fetchJson(urls.vehicles);
    container.innerHTML = `
      <table>
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
          ${data.map(v => `
            <tr>
              <td>${v.vehicleId}</td>
              <td>${v.modelName}</td>
              <td>${v.color}</td>
              <td>${v.version}</td>
              <td>${(v.retailPrice ?? 0).toLocaleString("vi-VN")} ₫</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch {
    container.innerHTML = "Không thể tải dữ liệu xe.";
  }
}

async function loadCustomers() {
  const container = document.getElementById("customer-list");
  try {
    const data = await fetchJson(urls.customers);
    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(cu => `
            <tr>
              <td>${cu.customerId}</td>
              <td>${cu.fullName}</td>
              <td>${cu.phone}</td>
              <td>${cu.email}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch {
    container.innerHTML = "Không thể tải dữ liệu khách hàng.";
  }
}

// =====================
// Load dropdown cho Order Form
// =====================
async function populateOrderSelects() {
  const customers = await fetchJson(urls.customers);
  const vehicles = await fetchJson(urls.vehicles);

  const custSelect = document.getElementById("order-customer");
  const vehSelect = document.getElementById("order-vehicle");

  custSelect.innerHTML = `<option value="">Chọn khách hàng</option>` +
    customers.map(c => `<option value="${c.customerId}">${c.fullName}</option>`).join("");

  vehSelect.innerHTML = `<option value="">Chọn xe</option>` +
    vehicles.map(v => `<option value="${v.vehicleId}">${v.modelName}</option>`).join("");
}

// =====================
// Load Orders
// =====================
async function loadOrders() {
  const container = document.getElementById("order-list");
  container.innerHTML = "Đang tải dữ liệu...";
  try {
    const [orders, orderItems, customers, vehicles] = await Promise.all([
      fetchJson(urls.orders),
      fetchJson(urls.orderitems),
      fetchJson(urls.customers),
      fetchJson(urls.vehicles)
    ]);

    // Map customerId -> fullName
    const customerMap = {};
    customers.forEach(c => customerMap[c.customerId] = c.fullName);

    // Map vehicleId -> modelName
    const vehicleMap = {};
    vehicles.forEach(v => vehicleMap[v.vehicleId] = v.modelName);

    // Map orderId -> orderItems[]
    const orderItemsMap = {};
    orderItems.forEach(oi => {
      if (!orderItemsMap[oi.orderId]) orderItemsMap[oi.orderId] = [];
      orderItemsMap[oi.orderId].push(oi);
    });

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Xe</th>
            <th>Trạng thái</th>
            <th>Phương thức</th>
            <th>Tổng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => {
            const items = orderItemsMap[o.orderId] || [];
            const vehicleNames = items.map(i => i.vehicle.modelName).join(", ") || 'Xe lạ';
            return `
              <tr>
                <td>${o.orderId}</td>
                <td>${customerMap[o.customerId] || 'Khách lạ'}</td>
                <td>${vehicleNames}</td>
                <td>${o.status}</td>
                <td>${o.paymentMethod}</td>
                <td>${(o.totalAmount ?? 0).toLocaleString("vi-VN")} ₫</td>
                <td>
                  <button onclick='editOrder(${o.orderId})'>Sửa</button>
                  <button onclick='deleteOrder(${o.orderId})'>Xóa</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // Lưu data tạm để edit
    window.orderData = {};
    orders.forEach(o => window.orderData[o.orderId] = o);
    window.orderItemsMap = orderItemsMap;

  } catch (err) {
    container.innerHTML = `<p style="color:red;">Không thể tải dữ liệu đơn hàng: ${err.message}</p>`;
  }
}

// =====================
// Edit Order
// =====================
function editOrder(orderId) {
  const o = window.orderData[orderId];
  if (!o) return;

  // Nếu dropdown chưa populate, chờ 200ms
  if (!document.getElementById("order-customer").options.length) {
    setTimeout(() => editOrder(orderId), 200);
    return;
  }

  document.getElementById("order-id").value = o.orderId;
  document.getElementById("order-customer").value = o.customerId;
  document.getElementById("order-status").value = o.status;
  document.getElementById("order-payment").value = o.paymentMethod;
  document.getElementById("order-amount").value = o.totalAmount || "";

  const items = window.orderItemsMap[o.orderId] || [];
  document.getElementById("order-vehicle").value = items[0]?.vehicle?.vehicleId || "";
}

async function saveOrder() {
  const customerId = parseInt(document.getElementById("order-customer").value);
  const vehicleId = parseInt(document.getElementById("order-vehicle").value);
  const status = document.getElementById("order-status").value;
  const paymentMethod = document.getElementById("order-payment").value;
  const totalAmount = parseFloat(document.getElementById("order-amount").value) || 0;

  if (!customerId || !vehicleId || !status || !paymentMethod || totalAmount <= 0) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    // 1️⃣ Tạo Order
    const orderRes = await fetch(`${urls.orders}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, status, paymentMethod, totalAmount })
    });
    if (!orderRes.ok) throw new Error(`Lỗi thêm Order: ${orderRes.status}`);
    const order = await orderRes.json(); // nhận orderId từ backend

    // 2️⃣ Tạo OrderItem
    const orderItemRes = await fetch(`${urls.orderitems}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.orderId,
        vehicleId,
        quantity: 1,
        unitPrice: totalAmount,
        discountAmount: 0
      })
    });
    if (!orderItemRes.ok) throw new Error(`Lỗi thêm OrderItem: ${orderItemRes.status}`);

    alert("Lưu đơn hàng thành công!");
    resetOrderForm();
    loadOrders();

  } catch (err) {
    alert(err.message);
  }
}



function resetOrderForm() {
  document.getElementById("order-id").value = '';
  document.getElementById("order-customer").value = '';
  document.getElementById("order-vehicle").value = '';
  document.getElementById("order-status").value = 'Pending';
  document.getElementById("order-payment").value = 'Cash';
  document.getElementById("order-amount").value = '';
}



async function loadFeedbacks() {
  const container = document.getElementById("feedback-list");
  try {
    const data = await fetchJson(urls.feedbacks);
    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Nội dung</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(f => `
            <tr>
              <td>${f.feedbackId ?? 'N/A'}</td>
              <td>${f.subject}</td>
              <td>${f.feedbackType}</td>
              <td>${f.status}</td>
              <td>${f.content}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch {
    container.innerHTML = "Không thể tải dữ liệu phản hồi.";
  }
}

// =====================
// Load dropdown cho TestDrive
// =====================
async function loadCustomerOptions() {
  const select = document.getElementById("td-customer");
  const customers = await fetchJson(urls.customers);
  select.innerHTML = customers.map(c => `<option value="${c.customerId}">${c.fullName}</option>`).join("");
}

async function loadVehicleOptions() {
  const select = document.getElementById("td-vehicle");
  const vehicles = await fetchJson(urls.vehicles);
  select.innerHTML = vehicles.map(v => `<option value="${v.vehicleId}">${v.modelName}</option>`).join("");
}

// =====================
// Load TestDrives với nút Sửa/Xóa
// =====================
async function loadTestDrives() {
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

    container.innerHTML = `
      <table>
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
          ${data.map(t => `
            <tr>
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
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    // Lưu data tạm để dùng khi edit
    window.testDriveData = {};
    data.forEach(t => { window.testDriveData[t.testDriveId] = t; });

  } catch (err) {
    container.innerHTML = `<p style="color:red;">Không thể tải dữ liệu lái thử: ${err.message}</p>`;
  }
}

// =====================
// Edit TestDrive
// =====================
function editTestDrive(id) {
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
async function saveTestDrive() {
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
async function deleteTestDrive(id) {
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
function resetForm() {
  document.getElementById("td-id").value = '';
  document.getElementById("td-customer").value = '';
  document.getElementById("td-vehicle").value = '';
  document.getElementById("td-date").value = '';
  document.getElementById("td-time").value = '';
  document.getElementById("td-status").value = 'Pending';
  document.getElementById("td-note").value = '';
}


// =====================
// Khởi động tất cả
// =====================
(async function init() {
  await Promise.all([loadCustomerOptions(), loadVehicleOptions()]);
  loadDashboard();
  loadVehicles();
  loadCustomers();
  await populateOrderSelects();
  loadOrders();
  loadFeedbacks();
  loadTestDrives();
})();
