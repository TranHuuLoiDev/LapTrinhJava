// =====================
// Customer Interactions Module
// =====================
import { urls } from './config.js';
import { fetchWithAuth, hasPermission, getCurrentUser } from './auth.js';

let allInteractions = [];

export async function loadInteractions() {
    try {
        const response = await fetchWithAuth(urls.interactions);
        allInteractions = await response.json();
        displayInteractions(allInteractions);
    } catch (error) {
        console.error('Error loading interactions:', error);
        document.getElementById('interactions-list').innerHTML = '<p class="error">Không thể tải dữ liệu tương tác</p>';
    }
}

function displayInteractions(interactions) {
    const container = document.getElementById('interactions-list');
    
    if (!interactions || interactions.length === 0) {
        container.innerHTML = '<p>Chưa có tương tác nào</p>';
        return;
    }
    
    const canEdit = hasPermission('canEdit', 'interactions');
    const canDelete = hasPermission('canDelete', 'interactions');
    
    const html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Nhân viên</th>
                    <th>Loại</th>
                    <th>Ngày</th>
                    <th>Chủ đề</th>
                    <th>Ghi chú</th>
                    <th>Follow-up</th>
                    <th>Trạng thái</th>
                    ${canEdit || canDelete ? '<th>Thao tác</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${interactions.map(int => `
                    <tr>
                        <td>${int.interactionId || 'N/A'}</td>
                        <td>${int.customerId || 'N/A'}</td>
                        <td>${int.userId || 'N/A'}</td>
                        <td><span class="type-badge ${int.interactionType?.toLowerCase()}">${int.interactionType}</span></td>
                        <td>${formatDateTime(int.interactionDate)}</td>
                        <td>${int.subject || ''}</td>
                        <td>${truncate(int.notes, 50)}</td>
                        <td>${formatDateTime(int.nextFollowUp)}</td>
                        <td><span class="status-${int.status?.toLowerCase()}">${int.status}</span></td>
                        ${canEdit || canDelete ? `
                            <td>
                                ${canEdit ? `<button class="btn-edit" onclick="editInteraction(${int.interactionId})"></button>` : ''}
                                ${canDelete ? `<button class="btn-delete" onclick="deleteInteraction(${int.interactionId})"></button>` : ''}
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

export function editInteraction(id) {
    const interaction = allInteractions.find(i => i.interactionId === id);
    if (!interaction) return;
    
    document.getElementById('int-id').value = interaction.interactionId || '';
    document.getElementById('int-customer-id').value = interaction.customerId || '';
    document.getElementById('int-type').value = interaction.interactionType || 'Call';
    document.getElementById('int-subject').value = interaction.subject || '';
    document.getElementById('int-notes').value = interaction.notes || '';
    document.getElementById('int-date').value = interaction.interactionDate ? interaction.interactionDate.substring(0, 16) : '';
    document.getElementById('int-followup').value = interaction.nextFollowUp ? interaction.nextFollowUp.substring(0, 16) : '';
    document.getElementById('int-status').value = interaction.status || 'Pending';
}

export async function saveInteraction() {
    const intId = document.getElementById('int-id').value;
    const user = getCurrentUser();
    
    const data = {
        customerId: parseInt(document.getElementById('int-customer-id').value),
        userId: user?.userId || 1,
        interactionType: document.getElementById('int-type').value,
        subject: document.getElementById('int-subject').value,
        notes: document.getElementById('int-notes').value,
        interactionDate: document.getElementById('int-date').value,
        nextFollowUp: document.getElementById('int-followup').value || null,
        status: document.getElementById('int-status').value
    };
    
    try {
        const method = intId ? 'PUT' : 'POST';
        const url = intId ? `${urls.interactions}/${intId}` : urls.interactions;
        
        const response = await fetchWithAuth(url, {
            method,
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Lưu tương tác thành công!');
            resetInteractionForm();
            loadInteractions();
        } else {
            alert('Lỗi khi lưu tương tác');
        }
    } catch (error) {
        console.error('Error saving interaction:', error);
        alert('Lỗi kết nối');
    }
}

export async function deleteInteraction(id) {
    if (!confirm('Bạn có chắc muốn xóa tương tác này?')) return;
    
    try {
        const response = await fetchWithAuth(`${urls.interactions}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Xóa thành công!');
            loadInteractions();
        } else {
            alert('Lỗi khi xóa');
        }
    } catch (error) {
        console.error('Error deleting interaction:', error);
        alert('Lỗi kết nối');
    }
}

export function resetInteractionForm() {
    document.getElementById('interactions-form').reset();
    document.getElementById('int-id').value = '';
    // Set default date to now
    const now = new Date().toISOString().substring(0, 16);
    document.getElementById('int-date').value = now;
}

// Load interactions by customer
export async function loadInteractionsByCustomer(customerId) {
    try {
        const response = await fetchWithAuth(`${urls.interactions}/customer/${customerId}`);
        const interactions = await response.json();
        displayInteractions(interactions);
    } catch (error) {
        console.error('Error loading customer interactions:', error);
    }
}
