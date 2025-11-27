document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/reports/sales-by-staff")
        .then(res => res.json())
        .then(data => {
            let table = "<table border='1'><tr><th>Nhân viên</th><th>Số đơn</th><th>Tổng doanh số</th></tr>";
            data.forEach(row => {
                table += `<tr>
                    <td>${row.staffName}</td>
                    <td>${row.totalOrders}</td>
                    <td>${row.totalSales}</td>
                </tr>`;
            });
            table += "</table>";
            document.getElementById("report-content").innerHTML = table;
        });
});
