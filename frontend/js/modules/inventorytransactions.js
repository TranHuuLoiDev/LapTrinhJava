// =====================
// Inventory Transactions Module
// =====================
import { urls } from '../config.js';
import { fetchWithAuth, hasPermission } from '../auth.js';

let allTransactions = [];

export async function loadInventoryTransactions() {
    try {
        const response = await fetchWithAuth(urls.inventoryTransactions);
        allTransactions = await response.json();
        displayInventoryTransactions(allTransactions);
    } catch (error) {
        console.error('Error loading inventory transactions:', error);
        document.getElementById('inventorytransactions-list').innerHTML = '<p class="error">Không thể tải dữ liệu giao dịch kho</p>';
    }
}

function displayInventoryTransactions(transactions) {
    const container = document.getElementById('inventorytransactions-list');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<p>Chưa có giao dịch kho nào</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'inventory');
    
    const html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Kho</th>
                    <th>Xe</th>
                    <th>Đại lý</th>
                    <th>Loại giao dịch</th>
                    <th>Số lượng</th>
                    <th>Từ vị trí</th>
                    <th>Đến vị trí</th>
                    <th>Ngày giao dịch</th>
                    <th>Người thực hiện</th>
                    <th>Ghi chú</th>
                    ${canEdit ? '<th>Thao tác</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${transactions.map(trans => `
                    <tr>
                        <td>${trans.transactionId || 'N/A'}</td>
                        <td>${trans.inventoryId || 'N/A'}</td>
                        <td>${trans.vehicleId || 'N/A'}</td>
                        <td>${trans.dealerId || 'N/A'}</td>
                        <td><span class="type-badge ${trans.transactionType?.toLowerCase()}">${trans.transactionType}</span></td>
                        <td>${trans.quantity}</td>
                        <td>${trans.fromLocation || 'N/A'}</td>
                        <td>${trans.toLocation || 'N/A'}</td>
                        <td>${formatDateTime(trans.transactionDate)}</td>
                        <td>${trans.performedBy || 'N/A'}</td>
                        <td>${truncate(trans.notes, 40)}</td>
                        ${canEdit ? `
                            <td>
                                <button class="btn-view" onclick="viewTransaction(${trans.transactionId})"></button>
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN');
}

function truncate(str, length) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
}

export function viewTransaction(id) {
    const transaction = allTransactions.find(t => t.transactionId === id);
    if (!transaction) return;
    
    const details = `
        <div class="transaction-detail">
            <h3>Chi tiết giao dịch #${transaction.transactionId}</h3>
            <p><strong>Loại:</strong> ${transaction.transactionType}</p>
            <p><strong>Kho:</strong> ${transaction.inventoryId}</p>
            <p><strong>Xe:</strong> ${transaction.vehicleId}</p>
            <p><strong>Số lượng:</strong> ${transaction.quantity}</p>
            <p><strong>Từ:</strong> ${transaction.fromLocation || 'N/A'}</p>
            <p><strong>Đến:</strong> ${transaction.toLocation || 'N/A'}</p>
            <p><strong>Ngày:</strong> ${formatDateTime(transaction.transactionDate)}</p>
            <p><strong>Tham chiếu:</strong> ${transaction.referenceType || 'N/A'} - ${transaction.referenceId || 'N/A'}</p>
            <p><strong>Ghi chú:</strong> ${transaction.notes || 'Không có'}</p>
        </div>
    `;
    
    showModal('Chi tiết giao dịch', details);
}

export async function saveInventoryTransaction() {
    const data = {
        inventoryId: parseInt(document.getElementById('invtrans-inventory-id').value),
        vehicleId: parseInt(document.getElementById('invtrans-vehicle-id').value),
        dealerId: parseInt(document.getElementById('invtrans-dealer-id').value),
        transactionType: document.getElementById('invtrans-type').value,
        quantity: parseInt(document.getElementById('invtrans-quantity').value),
        fromLocation: document.getElementById('invtrans-from').value || null,
        toLocation: document.getElementById('invtrans-to').value || null,
        referenceType: document.getElementById('invtrans-ref-type').value || null,
        referenceId: document.getElementById('invtrans-ref-id').value || null,
        notes: document.getElementById('invtrans-notes').value || null
    };
    
    try {
        const response = await fetchWithAuth(urls.inventoryTransactions, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Tạo giao dịch kho thành công!');
            resetInventoryTransactionForm();
            loadInventoryTransactions();
        } else {
            alert('Lỗi khi tạo giao dịch');
        }
    } catch (error) {
        console.error('Error saving transaction:', error);
        alert('Lỗi kết nối');
    }
}

export function resetInventoryTransactionForm() {
    document.getElementById('inventorytransactions-form').reset();
}

// Filter transactions
export function filterTransactions() {
    const type = document.getElementById('filter-type').value;
    const fromDate = document.getElementById('filter-from-date').value;
    const toDate = document.getElementById('filter-to-date').value;
    
    let filtered = [...allTransactions];
    
    if (type) {
        filtered = filtered.filter(t => t.transactionType === type);
    }
    
    if (fromDate) {
        filtered = filtered.filter(t => new Date(t.transactionDate) >= new Date(fromDate));
    }
    
    if (toDate) {
        filtered = filtered.filter(t => new Date(t.transactionDate) <= new Date(toDate));
    }
    
    displayInventoryTransactions(filtered);
}

function showModal(title, content) {
    // Simple modal implementation
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>${title}</h2>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
}
