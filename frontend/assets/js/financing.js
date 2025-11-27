// =====================
// Customer Financing Module
// =====================
import { urls } from './config.js';
import { fetchWithAuth, hasPermission } from './auth.js';

let allFinancing = [];

export async function loadFinancing() {
    try {
        const response = await fetchWithAuth(urls.financing);
        allFinancing = await response.json();
        displayFinancing(allFinancing);
    } catch (error) {
        console.error('Error loading financing:', error);
        document.getElementById('financing-list').innerHTML = '<p class="error">Không thể tải dữ liệu tài chính</p>';
    }
}

function displayFinancing(financing) {
    const container = document.getElementById('financing-list');
    
    if (!financing || financing.length === 0) {
        container.innerHTML = '<p>Chưa có hồ sơ tài chính nào</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'financing');
    const canDelete = hasPermission('canDelete', 'financing');
    
    const html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Đơn hàng</th>
                    <th>Ngân hàng</th>
                    <th>Số tiền vay</th>
                    <th>Lãi suất (%)</th>
                    <th>Kỳ hạn (tháng)</th>
                    <th>Trả hàng tháng</th>
                    <th>Trạng thái</th>
                    ${canEdit || canDelete ? '<th>Thao tác</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${financing.map(f => `
                    <tr>
                        <td>${f.financingId || 'N/A'}</td>
                        <td>${f.customerId || 'N/A'}</td>
                        <td>${f.orderId || 'N/A'}</td>
                        <td>${f.bankName || 'N/A'}</td>
                        <td>${formatCurrency(f.loanAmount)}</td>
                        <td>${f.interestRate}%</td>
                        <td>${f.loanTermMonths}</td>
                        <td>${formatCurrency(f.monthlyPayment)}</td>
                        <td><span class="status-${f.status?.toLowerCase()}">${f.status}</span></td>
                        ${canEdit || canDelete ? `
                            <td>
                                ${canEdit ? `<button class="btn-edit" onclick="editFinancing(${f.financingId})"></button>` : ''}
                                ${canDelete ? `<button class="btn-delete" onclick="deleteFinancing(${f.financingId})"></button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function formatCurrency(amount) {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function editFinancing(id) {
    const financing = allFinancing.find(f => f.financingId === id);
    if (!financing) return;
    
    document.getElementById('fin-id').value = financing.financingId || '';
    document.getElementById('fin-customer-id').value = financing.customerId || '';
    document.getElementById('fin-order-id').value = financing.orderId || '';
    document.getElementById('fin-bank').value = financing.bankName || '';
    document.getElementById('fin-loan-amount').value = financing.loanAmount || '';
    document.getElementById('fin-interest').value = financing.interestRate || '';
    document.getElementById('fin-term').value = financing.loanTermMonths || '';
    document.getElementById('fin-monthly').value = financing.monthlyPayment || '';
    document.getElementById('fin-down').value = financing.downPayment || '';
    document.getElementById('fin-status').value = financing.status || 'Pending';
    document.getElementById('fin-approved-date').value = financing.approvedDate || '';
}

export async function saveFinancing() {
    const finId = document.getElementById('fin-id').value;
    const data = {
        customerId: parseInt(document.getElementById('fin-customer-id').value),
        orderId: parseInt(document.getElementById('fin-order-id').value),
        bankName: document.getElementById('fin-bank').value,
        loanAmount: parseFloat(document.getElementById('fin-loan-amount').value),
        interestRate: parseFloat(document.getElementById('fin-interest').value),
        loanTermMonths: parseInt(document.getElementById('fin-term').value),
        monthlyPayment: parseFloat(document.getElementById('fin-monthly').value),
        downPayment: parseFloat(document.getElementById('fin-down').value),
        status: document.getElementById('fin-status').value,
        approvedDate: document.getElementById('fin-approved-date').value || null
    };
    
    try {
        const method = finId ? 'PUT' : 'POST';
        const url = finId ? `${urls.financing}/${finId}` : urls.financing;
        
        const response = await fetchWithAuth(url, {
            method,
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Lưu hồ sơ tài chính thành công!');
            resetFinancingForm();
            loadFinancing();
        } else {
            alert('Lỗi khi lưu hồ sơ');
        }
    } catch (error) {
        console.error('Error saving financing:', error);
        alert('Lỗi kết nối');
    }
}

export async function deleteFinancing(id) {
    if (!confirm('Bạn có chắc muốn xóa hồ sơ tài chính này?')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.financing}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa thành công!');
            loadFinancing();
        } else {
            alert('Lỗi khi xóa');
        }
    } catch (error) {
        console.error('Error deleting financing:', error);
        alert('Lỗi kết nối');
    }
}

export function resetFinancingForm() {
    document.getElementById('financing-form').reset();
    document.getElementById('fin-id').value = '';
}

// Calculate monthly payment
export function calculateMonthlyPayment() {
    const loanAmount = parseFloat(document.getElementById('fin-loan-amount').value) || 0;
    const interestRate = parseFloat(document.getElementById('fin-interest').value) || 0;
    const loanTermMonths = parseInt(document.getElementById('fin-term').value) || 1;
    const downPayment = parseFloat(document.getElementById('fin-down').value) || 0;
    
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
                          (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
    
    document.getElementById('fin-monthly').value = monthlyPayment.toFixed(2);
}
