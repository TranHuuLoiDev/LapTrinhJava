package com.evdms.evm.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evdms.evm.model.Dealer;
import com.evdms.evm.model.DealerPayable;
import com.evdms.evm.model.Feedback;
import com.evdms.evm.model.Inventory;
import com.evdms.evm.model.Promotion;
import com.evdms.evm.model.SalesOrder;
import com.evdms.evm.model.TestDrive;
import com.evdms.evm.repository.DealerPayableRepository;
import com.evdms.evm.repository.DealerRepository;
import com.evdms.evm.repository.FeedbackRepository;
import com.evdms.evm.repository.InventoryRepository;
import com.evdms.evm.repository.PromotionRepository;
import com.evdms.evm.repository.SalesOrderRepository;
import com.evdms.evm.repository.TestDriveRepository;
import com.evdms.evm.repository.VehicleRepository;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final SalesOrderRepository salesOrderRepository;
    private final VehicleRepository vehicleRepository;
    private final InventoryRepository inventoryRepository;
    private final PromotionRepository promotionRepository;
    private final DealerRepository dealerRepository;
    private final DealerPayableRepository dealerPayableRepository;
    private final FeedbackRepository feedbackRepository;
    private final TestDriveRepository testDriveRepository;

    public ReportService(SalesOrderRepository salesOrderRepository,
                        VehicleRepository vehicleRepository,
                        InventoryRepository inventoryRepository,
                        PromotionRepository promotionRepository,
                        DealerRepository dealerRepository,
                        DealerPayableRepository dealerPayableRepository,
                        FeedbackRepository feedbackRepository,
                        TestDriveRepository testDriveRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.vehicleRepository = vehicleRepository;
        this.inventoryRepository = inventoryRepository;
        this.promotionRepository = promotionRepository;
        this.dealerRepository = dealerRepository;
        this.dealerPayableRepository = dealerPayableRepository;
        this.feedbackRepository = feedbackRepository;
        this.testDriveRepository = testDriveRepository;
    }

    public List<Map<String, Object>> getSalesReportByDealer() {
        List<Map<String, Object>> reports = new ArrayList<>();
        List<Dealer> dealers = dealerRepository.findAll();
        
        for (Dealer dealer : dealers) {
            Map<String, Object> report = new HashMap<>();
            report.put("dealerId", dealer.getDealerId());
            report.put("dealerName", dealer.getDealerName());
            report.put("address", dealer.getAddress());
            
            List<SalesOrder> orders = salesOrderRepository.findAll().stream()
                .filter(o -> o.getDealerId() != null && o.getDealerId().equals(dealer.getDealerId()))
                .collect(Collectors.toList());
            
            double totalSales = orders.stream()
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0)
                .sum();
            
            report.put("totalOrders", orders.size());
            report.put("totalSales", totalSales);
            reports.add(report);
        }
        
        return reports;
    }

    public Map<String, Object> getSalesReportByDealerAndPeriod(Long dealerId, String startDate, String endDate) {
        Map<String, Object> report = new HashMap<>();
        report.put("dealerId", dealerId);
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalSales", 0);
        return report;
    }

    public List<Map<String, Object>> getSalesReportByRegion() {
        return new ArrayList<>();
    }

    public List<Map<String, Object>> getSalesReportByVehicle() {
        return new ArrayList<>();
    }

    public List<Map<String, Object>> getInventoryReport() {
        List<Map<String, Object>> reports = new ArrayList<>();
        List<Inventory> inventories = inventoryRepository.findAll();
        
        for (Inventory inv : inventories) {
            Map<String, Object> report = new HashMap<>();
            report.put("inventoryId", inv.getInventoryId());
            report.put("vehicleId", inv.getVehicleId());
            report.put("dealerId", inv.getDealerId());
            report.put("quantity", inv.getQuantity());
            report.put("location", inv.getLocation());
            report.put("vinNumber", inv.getVinNumber());
            reports.add(report);
        }
        
        return reports;
    }

    public List<Map<String, Object>> getInventoryTurnoverReport() {
        return new ArrayList<>();
    }

    public List<Map<String, Object>> getDealerPerformanceReport() {
        return new ArrayList<>();
    }

    public List<Map<String, Object>> getDealerPayablesReport() {
        List<Map<String, Object>> reports = new ArrayList<>();
        List<DealerPayable> payables = dealerPayableRepository.findAll();
        
        for (DealerPayable payable : payables) {
            Map<String, Object> report = new HashMap<>();
            report.put("payableId", payable.getPayableId());
            report.put("dealerId", payable.getDealerId());
            report.put("invoiceNumber", payable.getInvoiceNumber());
            report.put("amountDue", payable.getAmountDue());
            report.put("dueDate", payable.getDueDate());
            report.put("status", payable.getStatus());
            reports.add(report);
        }
        
        return reports;
    }

    public List<Map<String, Object>> getActivePromotionReport() {
        List<Map<String, Object>> reports = new ArrayList<>();
        List<Promotion> promotions = promotionRepository.findAll().stream()
            .filter(p -> p.getIsActive() != null && p.getIsActive())
            .collect(Collectors.toList());
        
        for (Promotion promo : promotions) {
            Map<String, Object> report = new HashMap<>();
            report.put("promotionId", promo.getPromotionId());
            report.put("promotionName", promo.getPromotionName());
            report.put("description", promo.getDescription());
            report.put("discountPercentage", promo.getDiscountPercentage());
            report.put("discountAmount", promo.getDiscountAmount());
            report.put("startDate", promo.getStartDate());
            report.put("endDate", promo.getEndDate());
            reports.add(report);
        }
        
        return reports;
    }

    public Map<String, Object> getPromotionCostReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("totalDiscountGiven", 0);
        return report;
    }

    public Map<String, Object> getFeedbackReport() {
        Map<String, Object> report = new HashMap<>();
        List<Feedback> feedbacks = feedbackRepository.findAll();
        
        report.put("totalFeedbacks", feedbacks.size());
        
        double avgRating = feedbacks.stream()
            .filter(f -> f.getRating() != null)
            .mapToInt(Feedback::getRating)
            .average()
            .orElse(0.0);
        
        report.put("averageRating", Math.round(avgRating * 100.0) / 100.0);
        
        long rating5 = feedbacks.stream().filter(f -> f.getRating() != null && f.getRating() == 5).count();
        long rating4 = feedbacks.stream().filter(f -> f.getRating() != null && f.getRating() == 4).count();
        long rating3 = feedbacks.stream().filter(f -> f.getRating() != null && f.getRating() == 3).count();
        long rating2 = feedbacks.stream().filter(f -> f.getRating() != null && f.getRating() == 2).count();
        long rating1 = feedbacks.stream().filter(f -> f.getRating() != null && f.getRating() == 1).count();
        
        report.put("rating5Count", rating5);
        report.put("rating4Count", rating4);
        report.put("rating3Count", rating3);
        report.put("rating2Count", rating2);
        report.put("rating1Count", rating1);
        
        return report;
    }

    public Map<String, Object> getTestDriveReport() {
        Map<String, Object> report = new HashMap<>();
        List<TestDrive> testDrives = testDriveRepository.findAll();
        
        report.put("totalTestDrives", testDrives.size());
        
        long completed = testDrives.stream()
            .filter(t -> "Completed".equalsIgnoreCase(t.getStatus()))
            .count();
        
        long confirmed = testDrives.stream()
            .filter(t -> "Confirmed".equalsIgnoreCase(t.getStatus()))
            .count();
        
        long pending = testDrives.stream()
            .filter(t -> "Pending".equalsIgnoreCase(t.getStatus()))
            .count();
        
        report.put("completedTestDrives", completed);
        report.put("confirmedTestDrives", confirmed);
        report.put("pendingTestDrives", pending);
        
        return report;
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> dashboard = new HashMap<>();
        
        List<SalesOrder> orders = salesOrderRepository.findAll();
        double totalSales = orders.stream()
            .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0)
            .sum();
        
        dashboard.put("totalSales", totalSales);
        dashboard.put("totalOrders", orders.size());
        
        List<Inventory> inventories = inventoryRepository.findAll();
        int totalInventory = inventories.stream()
            .mapToInt(i -> {
                Integer qty = i.getQuantity();
                return qty != null ? qty : 0;
            })
            .sum();
        dashboard.put("totalInventory", totalInventory);
        
        long dealerCount = dealerRepository.count();
        dashboard.put("dealerCount", dealerCount);
        
        long vehicleCount = vehicleRepository.count();
        dashboard.put("vehicleCount", vehicleCount);
        
        return dashboard;
    }

    public Map<String, Object> getDailyReport(String date) {
        Map<String, Object> report = new HashMap<>();
        report.put("date", date);
        report.put("totalSales", 0);
        report.put("orderCount", 0);
        return report;
    }

    public Map<String, Object> getMonthlyReport(int year, int month) {
        Map<String, Object> report = new HashMap<>();
        report.put("year", year);
        report.put("month", month);
        report.put("totalSales", 0);
        return report;
    }

    public Map<String, Object> getYearlyReport(int year) {
        Map<String, Object> report = new HashMap<>();
        report.put("year", year);
        report.put("totalSales", 0);
        return report;
    }
}
