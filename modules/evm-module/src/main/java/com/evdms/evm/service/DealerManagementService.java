package com.evdms.evm.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evdms.evm.controller.DealerManagementController.DealerRequest;
import com.evdms.evm.model.Dealer;
import com.evdms.evm.model.DealerPayable;
import com.evdms.evm.model.SalesOrder;
import com.evdms.evm.repository.DealerPayableRepository;
import com.evdms.evm.repository.DealerRepository;
import com.evdms.evm.repository.SalesOrderRepository;

@Service
@Transactional
@SuppressWarnings("null")
public class DealerManagementService {

    private final DealerRepository dealerRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final DealerPayableRepository dealerPayableRepository;

    public DealerManagementService(DealerRepository dealerRepository,
                                   SalesOrderRepository salesOrderRepository,
                                   DealerPayableRepository dealerPayableRepository) {
        this.dealerRepository = dealerRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.dealerPayableRepository = dealerPayableRepository;
    }

    // Get all dealers
    public List<Map<String, Object>> getAllDealers() {
        List<Dealer> dealers = dealerRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Dealer dealer : dealers) {
            Map<String, Object> dealerMap = new HashMap<>();
            dealerMap.put("dealerId", dealer.getDealerId());
            dealerMap.put("dealerName", dealer.getDealerName());
            dealerMap.put("address", dealer.getAddress());
            dealerMap.put("phone", dealer.getPhone());
            dealerMap.put("contractStartDate", dealer.getContractStartDate());
            dealerMap.put("salesQuota", dealer.getSalesQuota());
            dealerMap.put("isActive", true); // Default value
            result.add(dealerMap);
        }
        
        return result;
    }
    
    // Create new dealer
    public Map<String, Object> createDealer(DealerRequest request) {
        Dealer dealer = new Dealer();
        dealer.setDealerName(request.dealerName);
        dealer.setAddress(request.address);
        dealer.setPhone(request.phone);
        
        if (request.contractStartDate != null && !request.contractStartDate.isEmpty()) {
            try {
                dealer.setContractStartDate(LocalDate.parse(request.contractStartDate));
            } catch (Exception e) {
                // Ignore parse error
            }
        }
        
        if (request.salesQuota != null) {
            dealer.setSalesQuota(BigDecimal.valueOf(request.salesQuota));
        }
        
        Dealer savedDealer = dealerRepository.save(dealer);
        
        Map<String, Object> result = new HashMap<>();
        result.put("dealerId", savedDealer.getDealerId());
        result.put("dealerName", savedDealer.getDealerName());
        result.put("address", savedDealer.getAddress());
        result.put("phone", savedDealer.getPhone());
        result.put("contractStartDate", savedDealer.getContractStartDate());
        result.put("salesQuota", savedDealer.getSalesQuota());
        result.put("isActive", true);
        
        return result;
    }
    
    // Update dealer
    public Map<String, Object> updateDealer(Long dealerId, DealerRequest request) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found with ID: " + dealerId));
        
        dealer.setDealerName(request.dealerName);
        dealer.setAddress(request.address);
        dealer.setPhone(request.phone);
        
        if (request.contractStartDate != null && !request.contractStartDate.isEmpty()) {
            try {
                dealer.setContractStartDate(LocalDate.parse(request.contractStartDate));
            } catch (Exception e) {
                // Ignore parse error
            }
        }
        
        if (request.salesQuota != null) {
            dealer.setSalesQuota(BigDecimal.valueOf(request.salesQuota));
        }
        
        Dealer savedDealer = dealerRepository.save(dealer);
        
        Map<String, Object> result = new HashMap<>();
        result.put("dealerId", savedDealer.getDealerId());
        result.put("dealerName", savedDealer.getDealerName());
        result.put("address", savedDealer.getAddress());
        result.put("phone", savedDealer.getPhone());
        result.put("contractStartDate", savedDealer.getContractStartDate());
        result.put("salesQuota", savedDealer.getSalesQuota());
        result.put("isActive", true);
        
        return result;
    }
    
    // Delete dealer
    public void deleteDealer(Long dealerId) {
        if (!dealerRepository.existsById(dealerId)) {
            throw new RuntimeException("Dealer not found with ID: " + dealerId);
        }
        dealerRepository.deleteById(dealerId);
    }

    public void createDealerContract(Long dealerId, String contractName, String startDate, String endDate) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        dealer.setDealerName(contractName);
        try {
            dealer.setContractStartDate(LocalDate.parse(startDate));
        } catch (Exception ex) {
        }
        dealerRepository.save(dealer);
    }

    public void updateDealerContract(Long dealerId, String contractName, String startDate, String endDate) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        dealer.setDealerName(contractName);
        try {
            dealer.setContractStartDate(LocalDate.parse(startDate));
        } catch (Exception ex) {}
        dealerRepository.save(dealer);
    }

    public Map<String, Object> getDealerContract(Long dealerId) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Map<String, Object> contract = new HashMap<>();
        contract.put("dealerId", dealer.getDealerId());
        contract.put("dealerName", dealer.getDealerName());
        contract.put("contractStartDate", dealer.getContractStartDate());
        contract.put("salesQuota", dealer.getSalesQuota());
        
        return contract;
    }

    public void setSalesQuota(Long dealerId, Double quotaAmount, String quotaPeriod) {
        if (quotaAmount <= 0) {
            throw new IllegalArgumentException("Quota must be positive");
        }

        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        dealer.setSalesQuota(BigDecimal.valueOf(quotaAmount));
        dealerRepository.save(dealer);
    }

    public void updateSalesQuota(Long dealerId, Double quotaAmount, String quotaPeriod) {
        setSalesQuota(dealerId, quotaAmount, quotaPeriod);
    }

    public Map<String, Object> getSalesQuota(Long dealerId) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Map<String, Object> quota = new HashMap<>();
        quota.put("dealerId", dealer.getDealerId());
        quota.put("dealerName", dealer.getDealerName());
        quota.put("quotaAmount", dealer.getSalesQuota());
        
        return quota;
    }

    public List<Map<String, Object>> getDealerPayables(Long dealerId) {
        List<DealerPayable> payables = dealerPayableRepository.findByDealerId(dealerId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (DealerPayable p : payables) {
            Map<String, Object> item = new HashMap<>();
            item.put("invoiceNumber", p.getInvoiceNumber());
            item.put("amountDue", p.getAmountDue());
            item.put("dueDate", p.getDueDate());
            item.put("status", p.getStatus());
            result.add(item);
        }
        return result;
    }

    public Map<String, Object> getTotalPayables(Long dealerId) {
        List<DealerPayable> payables = dealerPayableRepository.findByDealerId(dealerId);
        double total = 0;
        for (DealerPayable p : payables) {
            if ("Pending".equalsIgnoreCase(p.getStatus())) {
                total += p.getAmountDue() != null ? p.getAmountDue().doubleValue() : 0;
            }
        }

        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Map<String, Object> result = new HashMap<>();
        result.put("dealerId", dealerId);
        result.put("dealerName", dealer.getDealerName());
        result.put("totalPayables", total);
        result.put("pendingCount", payables.stream().filter(p -> "Pending".equalsIgnoreCase(p.getStatus())).count());
        return result;
    }

    public void recordPayment(Long dealerId, Double paymentAmount, String paymentMethod) {
        if (paymentAmount <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive");
        }

        List<DealerPayable> payables = dealerPayableRepository.findByDealerId(dealerId);
        List<DealerPayable> target = payables.stream()
                .filter(p -> "Pending".equalsIgnoreCase(p.getStatus()))
                .sorted(Comparator.comparing(DealerPayable::getDueDate))
                .collect(Collectors.toList());

        if (target.isEmpty()) throw new RuntimeException("No payables to pay");

        double remaining = paymentAmount;
        for (DealerPayable p : target) {
            if (remaining <= 0) break;
            double amountDue = p.getAmountDue() != null ? p.getAmountDue().doubleValue() : 0;
            if (remaining >= amountDue) {
                p.setStatus("Paid");
                remaining -= amountDue;
            } else {
                p.setAmountDue(BigDecimal.valueOf(amountDue - remaining));
                p.setStatus("Pending");
                remaining = 0;
            }
            dealerPayableRepository.save(p);
        }
    }

    public Map<String, Object> getDealerPerformance(Long dealerId) {
        Dealer dealer = dealerRepository.findById(dealerId)
            .orElseThrow(() -> new RuntimeException("Dealer not found"));

        List<SalesOrder> orders = salesOrderRepository.findByDealerId(dealerId);
        double totalSales = orders.stream()
            .filter(o -> o.getStatus() != null && o.getStatus() == SalesOrder.Status.Delivered)
            .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0)
            .sum();

        double quotaAmount = dealer.getSalesQuota() != null ? dealer.getSalesQuota().doubleValue() : 0;
        double achievementRate = quotaAmount > 0 ? (totalSales / quotaAmount * 100) : 0;

        Map<String, Object> performance = new HashMap<>();
        performance.put("dealerId", dealerId);
        performance.put("dealerName", dealer.getDealerName());
        performance.put("quota", quotaAmount);
        performance.put("actualSales", totalSales);
        performance.put("achievementRate", String.format("%.2f%%", achievementRate));
        performance.put("completedOrders", orders.stream()
            .filter(o -> o.getStatus() != null && o.getStatus() == SalesOrder.Status.Delivered)
            .count());
        return performance;
    }

    public List<Map<String, Object>> getAllDealersPerformance() {
        List<Dealer> dealers = dealerRepository.findAll();
        
        return dealers.stream()
                .map(dealer -> {
                    try {
                        return getDealerPerformance(dealer.getDealerId());
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getDealerRankingBySales() {
        List<Dealer> dealers = dealerRepository.findAll();
        
        return dealers.stream()
                .map(dealer -> {
                    List<SalesOrder> orders = salesOrderRepository.findByDealerId(dealer.getDealerId());
                    double totalSales = orders.stream()
                            .filter(order -> order.getStatus() != null && order.getStatus() == SalesOrder.Status.Delivered)
                            .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0)
                            .sum();

                    Map<String, Object> ranking = new HashMap<>();
                    ranking.put("dealerId", dealer.getDealerId());
                    ranking.put("dealerName", dealer.getDealerName());
                    ranking.put("totalSales", totalSales);
                    ranking.put("completedOrders", orders.stream()
                            .filter(o -> o.getStatus() != null && o.getStatus() == SalesOrder.Status.Delivered)
                            .count());
                    return ranking;
                })
                .sorted(Comparator.comparingDouble((Map<String, Object> m) -> 
                        ((Number) m.get("totalSales")).doubleValue()).reversed())
                .collect(Collectors.toList());
    }
}
