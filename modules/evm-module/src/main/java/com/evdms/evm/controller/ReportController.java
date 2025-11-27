package com.evdms.evm.controller;

import com.evdms.evm.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evm/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    @GetMapping("/sales/by-dealer")
    public ResponseEntity<List<Map<String, Object>>> getSalesReportByDealer() {
        List<Map<String, Object>> report = reportService.getSalesReportByDealer();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/sales/by-dealer/{dealerId}")
    public ResponseEntity<?> getSalesReportByDealerAndPeriod(
            @PathVariable Long dealerId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            Map<String, Object> report = reportService.getSalesReportByDealerAndPeriod(dealerId, startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Error", e.getMessage()));
        }
    }
    @GetMapping("/sales/by-region")
    public ResponseEntity<List<Map<String, Object>>> getSalesReportByRegion() {
        List<Map<String, Object>> report = reportService.getSalesReportByRegion();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/sales/by-vehicle")
    public ResponseEntity<List<Map<String, Object>>> getSalesReportByVehicle() {
        List<Map<String, Object>> report = reportService.getSalesReportByVehicle();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/inventory/status")
    public ResponseEntity<List<Map<String, Object>>> getInventoryReport() {
        List<Map<String, Object>> report = reportService.getInventoryReport();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/inventory/turnover")
    public ResponseEntity<List<Map<String, Object>>> getInventoryTurnoverReport() {
        List<Map<String, Object>> report = reportService.getInventoryTurnoverReport();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/dealer/performance")
    public ResponseEntity<List<Map<String, Object>>> getDealerPerformanceReport() {
        List<Map<String, Object>> report = reportService.getDealerPerformanceReport();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/dealer/payables")
    public ResponseEntity<List<Map<String, Object>>> getDealerPayablesReport() {
        List<Map<String, Object>> report = reportService.getDealerPayablesReport();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/promotion/active")
    public ResponseEntity<List<Map<String, Object>>> getActivePromotionReport() {
        List<Map<String, Object>> report = reportService.getActivePromotionReport();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/promotion/discount")
    public ResponseEntity<?> getPromotionCostReport() {
        Map<String, Object> report = reportService.getPromotionCostReport();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/feedback/summary")
    public ResponseEntity<?> getFeedbackReport() {
        Map<String, Object> report = reportService.getFeedbackReport();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/testdrive/summary")
    public ResponseEntity<?> getTestDriveReport() {
        Map<String, Object> report = reportService.getTestDriveReport();
        return ResponseEntity.ok(report);
    }
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardReport() {
        Map<String, Object> dashboard = reportService.getDashboardSummary();
        return ResponseEntity.ok(dashboard);
    }
    @GetMapping("/daily/{date}")
    public ResponseEntity<?> getDailyReport(@PathVariable String date) {
        try {
            Map<String, Object> report = reportService.getDailyReport(date);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Error", e.getMessage()));
        }
    }
    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyReport(@RequestParam int year, @RequestParam int month) {
        try {
            Map<String, Object> report = reportService.getMonthlyReport(year, month);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Error", e.getMessage()));
        }
    }
    @GetMapping("/yearly/{year}")
    public ResponseEntity<?> getYearlyReport(@PathVariable int year) {
        try {
            Map<String, Object> report = reportService.getYearlyReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Error", e.getMessage()));
        }
    }

    public static class ErrorResponse {
        private final String error;
        private final String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        public String getError() { return error; }
        public String getMessage() { return message; }
    }
}
