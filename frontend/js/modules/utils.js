// =====================
// Hàm fetch an toàn
// =====================
export async function fetchJson(url) {
    const res = await fetch(url, { credentials: 'include' });
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
            module.init();
        }).catch(err => console.error('Error loading financing module:', err));
    }
    
    if (id === 'interactions') {
        import('./interactions.js').then(module => {
            module.init();
        }).catch(err => console.error('Error loading interactions module:', err));
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

// =====================
// Notification System
// =====================
export function showNotification(message, type = 'info') {
    // Xóa notification cũ nếu có
    const oldNotification = document.querySelector('.notification-toast');
    if (oldNotification) {
        oldNotification.remove();
    }

    // Tạo notification mới
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;

    // Màu sắc theo loại
    const colors = {
        success: { bg: '#4caf50', color: 'white' },
        error: { bg: '#f44336', color: 'white' },
        warning: { bg: '#ff9800', color: 'white' },
        info: { bg: '#2196f3', color: 'white' }
    };

    const style = colors[type] || colors.info;
    notification.style.background = style.bg;
    notification.style.color = style.color;
    notification.textContent = message;

    // Thêm animation CSS nếu chưa có
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(notification);

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
