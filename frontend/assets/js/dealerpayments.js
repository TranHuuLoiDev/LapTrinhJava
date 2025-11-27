// =====================
// Dealer Payments Module (EVM)
// =====================
import { urls } from './config.js';
import { fetchWithAuth, hasPermission } from './auth.js';

let allPayments = [];

export async function loadDealerPayments() {
    try {
        const response = await fetchWithAuth(urls.dealerPayments);
        allPayments = await response.json();
        displayDealerPayments(allPayments);
    } catch (error) {
        console.error('Error loading dealer payments:', error);
        document.getElementById('dealerpayments-list').innerHTML = '<p class="error">Không thể tải dữ liệu thanh toán</p>';
    }
}

function displayDealerPayments(payments) {
    const container = document.getElementById('dealerpayments-list');
    
    if (!payments || payments.length === 0) {
        container.innerHTML = '<p>Chưa có thanh toán nào</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'dealerpayments');
    const canDelete = hasPermission('canDelete', 'dealerpayments');
    
    const html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Công nợ</th>
                    <th>Đại lý</th>
                    <th>Ngày thanh toán</th>
                    <th>Số tiền</th>
                    <th>Phương thức</th>
                    <th>Số tham chiếu</th>
                    <th>Ngân hàng</th>
                    <th>Người tạo</th>
                    ${canEdit || canDelete ? '<th>Thao tác</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${payments.map(payment => `
                    <tr>
                        <td>${payment.paymentId || 'N/A'}</td>
                        <td>${payment.payableId || 'N/A'}</td>
                        <td>${payment.dealerId || 'N/A'}</td>
                        <td>${formatDate(payment.paymentDate)}</td>
                        <td>${formatCurrency(payment.amountPaid)}</td>
                        <td><span class="method-badge">${payment.paymentMethod}</span></td>
                        <td>${payment.referenceNumber || 'N/A'}</td>
                        <td>${payment.bankName || 'N/A'}</td>
                        <td>${payment.createdBy || 'N/A'}</td>
                        ${canEdit || canDelete ? `
                            <td>
                                ${canEdit ? `<button class="btn-edit" onclick="editDealerPayment(${payment.paymentId})"></button>` : ''}
                                ${canDelete ? `<button class="btn-delete" onclick="deleteDealerPayment(${payment.paymentId})"></button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
}

function formatCurrency(amount) {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function editDealerPayment(id) {
    const payment = allPayments.find(p => p.paymentId === id);
    if (!payment) return;
    
    document.getElementById('dp-id').value = payment.paymentId || '';
    document.getElementById('dp-payable-id').value = payment.payableId || '';
    document.getElementById('dp-dealer-id').value = payment.dealerId || '';
    document.getElementById('dp-date').value = payment.paymentDate || '';
    document.getElementById('dp-amount').value = payment.amountPaid || '';
    document.getElementById('dp-method').value = payment.paymentMethod || 'Cash';
    document.getElementById('dp-reference').value = payment.referenceNumber || '';
    document.getElementById('dp-bank').value = payment.bankName || '';
}

export async function saveDealerPayment() {
    const paymentId = document.getElementById('dp-id').value;
    const data = {
        payableId: parseInt(document.getElementById('dp-payable-id').value),
        dealerId: parseInt(document.getElementById('dp-dealer-id').value),
        paymentDate: document.getElementById('dp-date').value,
        amountPaid: parseFloat(document.getElementById('dp-amount').value),
        paymentMethod: document.getElementById('dp-method').value,
        referenceNumber: document.getElementById('dp-reference').value || null,
        bankName: document.getElementById('dp-bank').value || null,
        createdBy: 'Admin' // Should get from current user
    };
    
    try {
        const method = paymentId ? 'PUT' : 'POST';
        const url = paymentId ? `${urls.dealerPayments}/${paymentId}` : urls.dealerPayments;
        
        const response = await fetchWithAuth(url, {
            method,
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Lưu thanh toán thành công!');
            resetDealerPaymentForm();
            loadDealerPayments();
        } else {
            alert('Lỗi khi lưu thanh toán');
        }
    } catch (error) {
        console.error('Error saving payment:', error);
        alert('Lỗi kết nối');
    }
}

export async function deleteDealerPayment(id) {
    if (!confirm('Bạn có chắc muốn xóa thanh toán này?')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.dealerPayments}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa thành công!');
            loadDealerPayments();
        } else {
            alert('Lỗi khi xóa');
        }
    } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Lỗi kết nối');
    }
}

export function resetDealerPaymentForm() {
    document.getElementById('dealerpayments-form').reset();
    document.getElementById('dp-id').value = '';
}

// Load payments by dealer
export async function loadPaymentsByDealer(dealerId) {
    try {
        const response = await fetchWithAuth(`${urls.dealerPayments}/dealer/${dealerId}`);
        const payments = await response.json();
        displayDealerPayments(payments);
    } catch (error) {
        console.error('Error loading dealer payments:', error);
    }
}
