// =====================
// Dealer Payments Module (Thanh toán Đại lý)
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allPayments = [];

// =====================
// Init function for dashboard
// =====================
export async function init(container, user, role) {
    container.innerHTML = `
        <h2 style="margin-bottom: 20px;">Thanh toán Đại lý</h2>
        <div style="margin-bottom: 20px;">
            <button onclick="window.dealerPaymentsModule.showAddForm()" class="btn-primary" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                ➕ Ghi nhận thanh toán
            </button>
        </div>
        <div id="payments-list">⏳ Đang tải dữ liệu thanh toán...</div>
        <div id="payments-form" style="display: none;"></div>
    `;
    
    // Expose functions to window
    window.dealerPaymentsModule = {
        showAddForm,
        editPayment,
        deletePayment,
        savePayment,
        cancelForm,
        loadPayments
    };
    
    window.editPayment = editPayment;
    window.deletePayment = deletePayment;
    
    await loadPayments();
}

// =====================
// Load Payments
// =====================
export async function loadPayments() {
    const listContainer = document.getElementById('payments-list');
    try {
        console.log('🔍 Loading dealer payments from:', urls.dealerPayments);
        const response = await fetchWithAuth(urls.dealerPayments);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        allPayments = await response.json();
        console.log('✅ Loaded payments:', allPayments.length);
        displayPayments(allPayments);
    } catch (error) {
        console.error('❌ Error loading payments:', error);
        listContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;">
                <p style="color: #856404; font-size: 1.1em; margin-bottom: 10px;">⚠️ Không thể tải dữ liệu thanh toán</p>
                <p style="color: #666; font-size: 0.9em;">Lỗi: ${error.message}</p>
                <button onclick="window.dealerPaymentsModule.loadPayments()" style="margin-top: 15px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔄 Thử lại
                </button>
            </div>
        `;
    }
}

function displayPayments(payments) {
    const container = document.getElementById('payments-list');
    
    if (!payments || payments.length === 0) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666;">
                <p style="font-size: 1.2em; margin-bottom: 10px;">📋 Chưa có thanh toán nào</p>
                <button onclick="window.dealerPaymentsModule.showAddForm()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ➕ Ghi nhận thanh toán đầu tiên
                </button>
            </div>
        `;
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'dealerpayments');
    const canDelete = hasPermission('canDelete', 'dealerpayments');
    
    const html = `
        <table class="data-table" style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <th style="padding: 12px; text-align: left;">ID</th>
                    <th style="padding: 12px; text-align: left;">Đại lý</th>
                    <th style="padding: 12px; text-align: left;">Ngày TT</th>
                    <th style="padding: 12px; text-align: right;">Số tiền</th>
                    <th style="padding: 12px; text-align: left;">Phương thức</th>
                    <th style="padding: 12px; text-align: left;">Số tham chiếu</th>
                    <th style="padding: 12px; text-align: left;">Ngân hàng</th>
                    ${canEdit || canDelete ? '<th style="padding: 12px; text-align: center;">Hành động</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${payments.map(payment => `
                    <tr style="border-bottom: 1px solid #eee; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                        <td style="padding: 12px; font-weight: 600; color: #667eea;">${payment.paymentId || 'N/A'}</td>
                        <td style="padding: 12px; font-weight: 600;">${payment.dealerName || 'N/A'}</td>
                        <td style="padding: 12px;">${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                        <td style="padding: 12px; text-align: right; font-weight: 600; color: #4caf50;">${(payment.amountPaid || 0).toLocaleString('vi-VN')} ₫</td>
                        <td style="padding: 12px;">${payment.paymentMethod || 'N/A'}</td>
                        <td style="padding: 12px;">${payment.referenceNumber || '-'}</td>
                        <td style="padding: 12px;">${payment.bankName || '-'}</td>
                        ${canEdit || canDelete ? `
                            <td style="padding: 12px; text-align: center;">
                                ${canEdit ? `<button onclick="editPayment(${payment.paymentId})" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Sửa</button>` : ''}
                                ${canDelete ? `<button onclick="deletePayment(${payment.paymentId})" style="padding: 6px 12px; background: #ef5350; color: white; border: none; border-radius: 4px; cursor: pointer;">🗑️ Xóa</button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Placeholder functions (implement later)
function showAddForm() {
    alert('Chức năng đang phát triển');
}

function editPayment(id) {
    alert(`Sửa thanh toán #${id} - Chức năng đang phát triển`);
}

function deletePayment(id) {
    if (confirm('⚠️ Bạn có chắc muốn xóa thanh toán này?')) {
        alert(`Xóa thanh toán #${id} - Chức năng đang phát triển`);
    }
}

function savePayment() {
    alert('Lưu - Chức năng đang phát triển');
}

function cancelForm() {
    const formContainer = document.getElementById('payments-form');
    formContainer.style.display = 'none';
    formContainer.innerHTML = '';
}
