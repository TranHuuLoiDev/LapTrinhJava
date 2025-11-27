package com.evdms.evm.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evdms.evm.service.EvmReportService;

@RestController
@RequestMapping("/api/evm/reports")
public class EvmReportController {

    private final EvmReportService evmReportService;

    public EvmReportController(EvmReportService evmReportService) {
        this.evmReportService = evmReportService;
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        return evmReportService.getDashboardStatistics();
    }

    @GetMapping("/sales-by-dealer")
    public List<Map<String, Object>> getSalesByDealer() {
        return evmReportService.getSalesByDealer();
    }

    @GetMapping("/inventory-summary")
    public Map<String, Object> getInventorySummary() {
        return evmReportService.getInventorySummary();
    }

    @GetMapping("/top-selling-vehicles")
    public List<Map<String, Object>> getTopSellingVehicles() {
        return evmReportService.getTopSellingVehicles();
    }

    @GetMapping("/dealer-performance")
    public List<Map<String, Object>> getDealerPerformance() {
        return evmReportService.getDealerPerformance();
    }

    @GetMapping("/monthly-sales")
    public List<Map<String, Object>> getMonthlySales() {
        return evmReportService.getMonthlySales();
    }
}
