document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/dealers")
        .then(res => res.json())
        .then(data => {
            let table = "<table border='1'><tr><th>Tên đại lý</th><th>Địa chỉ</th><th>SĐT</th></tr>";
            data.forEach(row => {
                table += `<tr>
                    <td>${row.name}</td>
                    <td>${row.address}</td>
                    <td>${row.phone}</td>
                </tr>`;
            });
            table += "</table>";
            document.getElementById("dealer-content").innerHTML = table;
        });
});
