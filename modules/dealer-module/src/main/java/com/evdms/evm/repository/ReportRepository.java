package com.evdms.evm.repository;

import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.*;

@Repository
@SuppressWarnings({"unchecked", "null"})
public class ReportRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public List<Map<String, Object>> getSalesByStaff() {
        String sql = "SELECT u.full_name as staffName, COUNT(so.order_id) as totalOrders, SUM(so.total_amount) as totalSales " +
                     "FROM salesorders so JOIN users u ON so.salesperson_id = u.user_id GROUP BY u.full_name";
        List<Object[]> results = entityManager.createNativeQuery(sql).getResultList();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("staffName", row[0]);
            map.put("totalOrders", row[1]);
            map.put("totalSales", row[2]);
            list.add(map);
        }
        return list;
    }

    public List<Map<String, Object>> getDebtByCustomer() {
        String sql = "SELECT c.full_name as customerName, SUM(so.total_amount) as totalDebt FROM salesorders so " +
                     "JOIN customers c ON so.customer_id = c.customer_id WHERE so.status = 'Pending' GROUP BY c.full_name";
        List<Object[]> results = entityManager.createNativeQuery(sql).getResultList();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("customerName", row[0]);
            map.put("totalDebt", row[1]);
            list.add(map);
        }
        return list;
    }

    public List<Map<String, Object>> getDebtByManufacturer() {
        String sql = "SELECT d.name as dealerName, SUM(so.total_amount) as debtAmount FROM salesorders so " +
                     "JOIN dealers d ON so.dealer_id = d.id WHERE so.status = 'Delivered' GROUP BY d.name";
        List<Object[]> results = entityManager.createNativeQuery(sql).getResultList();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("dealerName", row[0]);
            map.put("debtAmount", row[1]);
            list.add(map);
        }
        return list;
    }
}
