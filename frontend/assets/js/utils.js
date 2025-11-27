// =====================
// Hàm fetch an toàn
// =====================
export async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);
    return res.json();
}

// =====================
// Chuyển trang
// =====================
export function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const page = document.getElementById(id);
    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    const menuItem = document.querySelector(`.sidebar li[data-page="${id}"]`);
    if (menuItem) {
        menuItem.classList.add("active");
    }

    const titleMap = {
        dashboard: "Dashboard Dealer",
        evmdashboard: "Dashboard EVM",
        vehicles: "Quản lý Xe",
        customers: "Quản lý Khách hàng",
        orders: "Quản lý Đơn hàng",
        feedbacks: "Phản hồi khách hàng",
        testdrives: "Quản lý Lái thử",
        financing: "Tài chính Khách hàng",
        interactions: "Tương tác Khách hàng",
        vehiclespecs: "Thông số Kỹ thuật",
        inventory: "Quản lý Kho",
        inventorytransactions: "Lịch sử Giao dịch Kho",
        dealers: "Quản lý Đại lý",
        dealerpayments: "Thanh toán Đại lý",
        promotions: "Quản lý Khuyến mãi",
        wholesaleprices: "Quản lý Giá sỉ",
        reports: "Báo cáo"
    };
    document.getElementById("page-title").textContent = titleMap[id] || "Dashboard";
    
    // Load specific modules when opening their pages
    if (id === 'orders') {
        import('./Salesorders.js').then(module => {
            module.loadCustomerDropdown();
        });
    }
    
    if (id === 'evmdashboard') {
        import('./evmdashboard.js').then(module => {
            module.initEvmDashboard();
        });
    }
    
    if (id === 'financing') {
        import('./financing.js').then(module => {
            module.loadFinancing();
        });
    }
    
    if (id === 'interactions') {
        import('./interactions.js').then(module => {
            module.loadInteractions();
        });
    }
    
    if (id === 'vehiclespecs') {
        import('./vehiclespecs.js').then(module => {
            module.loadVehicleSpecs();
        });
    }
    
    if (id === 'inventorytransactions') {
        import('./inventorytransactions.js').then(module => {
            module.loadInventoryTransactions();
        });
    }
    
    if (id === 'dealerpayments') {
        import('./dealerpayments.js').then(module => {
            module.loadDealerPayments();
        });
    }
}
