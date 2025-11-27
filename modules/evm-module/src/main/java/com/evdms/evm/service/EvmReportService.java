package com.evdms.evm.service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evdms.evm.model.Dealer;
import com.evdms.evm.model.Inventory;
import com.evdms.evm.model.SalesOrder;
import com.evdms.evm.model.Vehicle;
import com.evdms.evm.repository.CustomerRepository;
import com.evdms.evm.repository.DealerRepository;
import com.evdms.evm.repository.InventoryRepository;
import com.evdms.evm.repository.SalesOrderRepository;
import com.evdms.evm.repository.VehicleRepository;

@Service
@Transactional(readOnly = true)
public class EvmReportService {

    private final SalesOrderRepository salesOrderRepository;
    private final VehicleRepository vehicleRepository;
    private final InventoryRepository inventoryRepository;
    private final DealerRepository dealerRepository;
    private final CustomerRepository customerRepository;

    public EvmReportService(
            SalesOrderRepository salesOrderRepository,
            VehicleRepository vehicleRepository,
            InventoryRepository inventoryRepository,
            DealerRepository dealerRepository,
            CustomerRepository customerRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.vehicleRepository = vehicleRepository;
        this.inventoryRepository = inventoryRepository;
        this.dealerRepository = dealerRepository;
        this.customerRepository = customerRepository;
    }

    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();

        long totalVehicles = vehicleRepository.count();
        long totalDealers = dealerRepository.count();
        long totalCustomers = customerRepository.count();
        long totalOrders = salesOrderRepository.count();

        List<SalesOrder> completedOrders = salesOrderRepository.findAll().stream()
                .filter(order -> SalesOrder.Status.Delivered.equals(order.getStatus()))
                .toList();

        BigDecimal totalRevenue = completedOrders.stream()
                .map(SalesOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalInventory = inventoryRepository.findAll().stream()
                .mapToLong(inv -> inv.getQuantity() != null ? inv.getQuantity() : 0)
                .sum();

        stats.put("totalVehicles", totalVehicles);
        stats.put("totalDealers", totalDealers);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalInventory", totalInventory);
        stats.put("completedOrders", completedOrders.size());

        return stats;
    }

    public List<Map<String, Object>> getSalesByDealer() {
        List<Map<String, Object>> salesByDealer = new ArrayList<>();
        List<Dealer> dealers = dealerRepository.findAll();

        for (Dealer dealer : dealers) {
            List<SalesOrder> dealerOrders = salesOrderRepository.findAll().stream()
                    .filter(order -> dealer.getDealerId().equals(order.getDealerId()))
                    .filter(order -> SalesOrder.Status.Delivered.equals(order.getStatus()))
                    .toList();

            BigDecimal totalSales = dealerOrders.stream()
                    .map(SalesOrder::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dealerSales = new HashMap<>();
            dealerSales.put("dealerId", dealer.getDealerId());
            dealerSales.put("dealerName", dealer.getDealerName());
            dealerSales.put("totalOrders", dealerOrders.size());
            dealerSales.put("totalSales", totalSales);

            salesByDealer.add(dealerSales);
        }

        salesByDealer.sort((a, b) -> 
            ((BigDecimal) b.get("totalSales")).compareTo((BigDecimal) a.get("totalSales"))
        );

        return salesByDealer;
    }

    public Map<String, Object> getInventorySummary() {
        Map<String, Object> summary = new HashMap<>();
        List<Inventory> inventories = inventoryRepository.findAll();

        long totalStock = inventories.stream()
                .mapToLong(inv -> inv.getQuantity() != null ? inv.getQuantity() : 0)
                .sum();

        summary.put("totalStock", totalStock);
        summary.put("totalVehicleModels", vehicleRepository.count());
        summary.put("totalDealers", dealerRepository.count());

        return summary;
    }

    public List<Map<String, Object>> getTopSellingVehicles() {
        List<Map<String, Object>> topVehicles = new ArrayList<>();
        List<Vehicle> vehicles = vehicleRepository.findAll();

        for (Vehicle vehicle : vehicles) {
            long salesCount = salesOrderRepository.findAll().stream()
                    .filter(order -> SalesOrder.Status.Delivered.equals(order.getStatus()))
                    .flatMap(order -> order.getOrderItems().stream())
                    .filter(item -> vehicle.getVehicleId().equals(item.getVehicle().getVehicleId()))
                    .count();

            if (salesCount > 0) {
                Map<String, Object> vehicleStats = new HashMap<>();
                vehicleStats.put("vehicleId", vehicle.getVehicleId());
                vehicleStats.put("modelName", vehicle.getModelName());
                vehicleStats.put("version", vehicle.getVersion());
                vehicleStats.put("color", vehicle.getColor());
                vehicleStats.put("salesCount", salesCount);

                topVehicles.add(vehicleStats);
            }
        }

        topVehicles.sort((a, b) -> 
            Long.compare((Long) b.get("salesCount"), (Long) a.get("salesCount"))
        );

        return topVehicles.stream().limit(10).toList();
    }

    public List<Map<String, Object>> getDealerPerformance() {
        List<Map<String, Object>> performance = new ArrayList<>();
        List<Dealer> dealers = dealerRepository.findAll();

        for (Dealer dealer : dealers) {
            List<SalesOrder> dealerOrders = salesOrderRepository.findAll().stream()
                    .filter(order -> dealer.getDealerId().equals(order.getDealerId()))
                    .toList();

            long completedOrders = dealerOrders.stream()
                    .filter(order -> SalesOrder.Status.Delivered.equals(order.getStatus()))
                    .count();

            BigDecimal totalRevenue = dealerOrders.stream()
                    .filter(order -> SalesOrder.Status.Delivered.equals(order.getStatus()))
                    .map(SalesOrder::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dealerPerf = new HashMap<>();
            dealerPerf.put("dealerId", dealer.getDealerId());
            dealerPerf.put("dealerName", dealer.getDealerName());
            dealerPerf.put("address", dealer.getAddress());
            dealerPerf.put("totalOrders", dealerOrders.size());
            dealerPerf.put("completedOrders", completedOrders);
            dealerPerf.put("totalRevenue", totalRevenue);
            dealerPerf.put("completionRate", 
                dealerOrders.isEmpty() ? 0 : (completedOrders * 100.0 / dealerOrders.size())
            );

            performance.add(dealerPerf);
        }

        performance.sort((a, b) -> 
            ((BigDecimal) b.get("totalRevenue")).compareTo((BigDecimal) a.get("totalRevenue"))
        );

        return performance;
    }

    public List<Map<String, Object>> getMonthlySales() {
        List<Map<String, Object>> monthlySales = new ArrayList<>();
        List<SalesOrder> orders = salesOrderRepository.findAll().stream()
                .filter(order -> SalesOrder.Status.Delivered.equals(order.getStatus()))
                .toList();

        Map<String, BigDecimal> salesByMonth = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (SalesOrder order : orders) {
            if (order.getOrderDate() != null) {
                String monthKey = order.getOrderDate().format(formatter);
                salesByMonth.merge(monthKey, order.getTotalAmount(), BigDecimal::add);
            }
        }

        salesByMonth.forEach((month, total) -> {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", month);
            monthData.put("totalSales", total);
            monthlySales.add(monthData);
        });

        monthlySales.sort((a, b) -> 
            ((String) a.get("month")).compareTo((String) b.get("month"))
        );

        return monthlySales;
    }
}
