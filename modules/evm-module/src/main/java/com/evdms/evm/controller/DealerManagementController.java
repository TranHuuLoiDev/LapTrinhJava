package com.evdms.evm.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evdms.evm.service.DealerManagementService;

@RestController
@RequestMapping("/api/dealers")
public class DealerManagementController {

    private final DealerManagementService dealerManagementService;

    public DealerManagementController(DealerManagementService dealerManagementService) {
        this.dealerManagementService = dealerManagementService;
    }
    
    // GET all dealers
    @GetMapping
    public ResponseEntity<?> getAllDealers() {
        try {
            List<Map<String, Object>> dealers = dealerManagementService.getAllDealers();
            return ResponseEntity.ok(dealers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to load dealers", e.getMessage()));
        }
    }
    
    // CREATE new dealer
    @PostMapping
    public ResponseEntity<?> createDealer(@RequestBody DealerRequest request) {
        try {
            Map<String, Object> newDealer = dealerManagementService.createDealer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newDealer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to create dealer", e.getMessage()));
        }
    }
    
    // UPDATE dealer
    @PutMapping("/{dealerId}")
    public ResponseEntity<?> updateDealer(@PathVariable Long dealerId, @RequestBody DealerRequest request) {
        try {
            Map<String, Object> updatedDealer = dealerManagementService.updateDealer(dealerId, request);
            return ResponseEntity.ok(updatedDealer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to update dealer", e.getMessage()));
        }
    }
    
    // DELETE dealer
    @DeleteMapping("/{dealerId}")
    public ResponseEntity<?> deleteDealer(@PathVariable Long dealerId) {
        try {
            dealerManagementService.deleteDealer(dealerId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Dealer deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to delete dealer", e.getMessage()));
        }
    }
    
    @PostMapping("/{dealerId}/contract")
    public ResponseEntity<?> createDealerContract(@PathVariable Long dealerId, @RequestBody ContractRequest request) {
        try {
            dealerManagementService.createDealerContract(dealerId, request.contractName, request.startDate, request.endDate);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Created");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed", e.getMessage()));
        }
    }
    @PutMapping("/{dealerId}/contract")
    public ResponseEntity<?> updateDealerContract(@PathVariable Long dealerId, @RequestBody ContractRequest request) {
        try {
            dealerManagementService.updateDealerContract(dealerId, request.contractName, request.startDate, request.endDate);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Updated");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Update failed", e.getMessage()));
        }
    }
    @GetMapping("/{dealerId}/contract")
    public ResponseEntity<?> getDealerContract(@PathVariable Long dealerId) {
        try {
            Map<String, Object> contract = dealerManagementService.getDealerContract(dealerId);
            return ResponseEntity.ok(contract);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Not found", e.getMessage()));
        }
    }
    @PostMapping("/{dealerId}/quota")
    public ResponseEntity<?> setSalesQuota(@PathVariable Long dealerId, @RequestBody QuotaRequest request) {
        try {
            dealerManagementService.setSalesQuota(dealerId, request.quotaAmount, request.quotaPeriod);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Quota set");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed", e.getMessage()));
        }
    }
    @PutMapping("/{dealerId}/quota")
    public ResponseEntity<?> updateSalesQuota(@PathVariable Long dealerId, @RequestBody QuotaRequest request) {
        try {
            dealerManagementService.updateSalesQuota(dealerId, request.quotaAmount, request.quotaPeriod);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Updated");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Update failed", e.getMessage()));
        }
    }
    @GetMapping("/{dealerId}/quota")
    public ResponseEntity<?> getSalesQuota(@PathVariable Long dealerId) {
        try {
            Map<String, Object> quota = dealerManagementService.getSalesQuota(dealerId);
            return ResponseEntity.ok(quota);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Not found", e.getMessage()));
        }
    }
    @GetMapping("/{dealerId}/payables")
    public ResponseEntity<?> getDealerPayables(@PathVariable Long dealerId) {
        try {
            List<Map<String, Object>> payables = dealerManagementService.getDealerPayables(dealerId);
            return ResponseEntity.ok(payables);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Not found", e.getMessage()));
        }
    }
    @GetMapping("/{dealerId}/payables/total")
    public ResponseEntity<?> getTotalPayables(@PathVariable Long dealerId) {
        try {
            Map<String, Object> totalPayables = dealerManagementService.getTotalPayables(dealerId);
            return ResponseEntity.ok(totalPayables);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Not found", e.getMessage()));
        }
    }
    @PostMapping("/{dealerId}/payables/payment")
    public ResponseEntity<?> payPayables(@PathVariable Long dealerId, @RequestBody PaymentRequest request) {
        try {
            dealerManagementService.recordPayment(dealerId, request.paymentAmount, request.paymentMethod);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Payment recorded");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Payment failed", e.getMessage()));
        }
    }
    @GetMapping("/{dealerId}/performance")
    public ResponseEntity<?> getDealerPerformance(@PathVariable Long dealerId) {
        try {
            Map<String, Object> performance = dealerManagementService.getDealerPerformance(dealerId);
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Not found", e.getMessage()));
        }
    }
    @GetMapping("/performance/all")
    public ResponseEntity<List<Map<String, Object>>> getAllDealersPerformance() {
        List<Map<String, Object>> performances = dealerManagementService.getAllDealersPerformance();
        return ResponseEntity.ok(performances);
    }
    @GetMapping("/ranking/sales")
    public ResponseEntity<List<Map<String, Object>>> getDealerRankingBySales() {
        List<Map<String, Object>> ranking = dealerManagementService.getDealerRankingBySales();
        return ResponseEntity.ok(ranking);
    }

    public static class ContractRequest {
        public String contractName;
        public String startDate;
        public String endDate;
    }

    public static class QuotaRequest {
        public Double quotaAmount;
        public String quotaPeriod;
    }

    public static class PaymentRequest {
        public Double paymentAmount;
        public String paymentMethod;
    }
    
    public static class DealerRequest {
        public String dealerName;
        public String address;
        public String phone;
        public String contractStartDate;
        public Double salesQuota;
        public Boolean isActive;
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
