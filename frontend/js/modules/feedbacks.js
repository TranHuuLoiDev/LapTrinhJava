import { urls } from '../config.js';
import { fetchJson } from './utils.js';

// =====================
// Init function for dashboard
// =====================
export async function init(container) {
    container.innerHTML = '<div id="feedback-list">Đang tải...</div>';
    await loadFeedbacks();
}

// =====================
// Load Feedbacks
// =====================
export async function loadFeedbacks() {
    const container = document.getElementById("feedback-list");
    try {
        const data = await fetchJson(urls.feedbacks);
        container.innerHTML = `<table>
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
                ${data.map(f => `<tr>
                    <td>${f.feedbackId ?? 'N/A'}</td>
                    <td>${f.subject}</td>
                    <td>${f.feedbackType}</td>
                    <td>${f.status}</td>
                    <td>${f.content}</td>
                </tr>`).join("")}
            </tbody>
        </table>`;
    } catch {
        container.innerHTML = "Không thể tải dữ liệu phản hồi.";
    }
}
