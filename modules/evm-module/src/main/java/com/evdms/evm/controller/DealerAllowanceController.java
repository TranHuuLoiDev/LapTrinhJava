package com.evdms.evm.controller;

import com.evdms.evm.model.DealerAllowance;
import com.evdms.evm.service.DealerAllowanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evm/allowances")
public class DealerAllowanceController {

    private final DealerAllowanceService dealerAllowanceService;

    public DealerAllowanceController(DealerAllowanceService dealerAllowanceService) {
        this.dealerAllowanceService = dealerAllowanceService;
    }
    @GetMapping
    public ResponseEntity<List<DealerAllowance>> getAllAllowances() {
        List<DealerAllowance> allowances = dealerAllowanceService.getAllAllowances();
        return ResponseEntity.ok(allowances);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getAllowanceById(@PathVariable Long id) {
        try {
            DealerAllowance allowance = dealerAllowanceService.getAllowanceById(id);
            return ResponseEntity.ok(allowance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Not found", e.getMessage()));
        }
    }
    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<List<DealerAllowance>> getAllowancesByDealer(@PathVariable Long dealerId) {
        List<DealerAllowance> allowances = dealerAllowanceService.getAllowancesByDealer(dealerId);
        return ResponseEntity.ok(allowances);
    }
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<DealerAllowance>> getAllowancesByVehicle(@PathVariable Long vehicleId) {
        List<DealerAllowance> allowances = dealerAllowanceService.getAllowancesByVehicle(vehicleId);
        return ResponseEntity.ok(allowances);
    }
    @GetMapping("/dealer/{dealerId}/vehicle/{vehicleId}")
    public ResponseEntity<?> getAllowanceByDealerAndVehicle(@PathVariable Long dealerId, @PathVariable Long vehicleId) {
        try {
            DealerAllowance allowance = dealerAllowanceService.getAllowanceByDealerAndVehicle(dealerId, vehicleId);
            return ResponseEntity.ok(allowance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Not found", e.getMessage()));
        }
    }
    @PostMapping
    public ResponseEntity<?> createAllowance(@RequestBody DealerAllowance allowance) {
        try {
            DealerAllowance created = dealerAllowanceService.createAllowance(allowance);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Error creating allowance", e.getMessage()));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAllowance(@PathVariable Long id, @RequestBody DealerAllowance allowanceDetails) {
        try {
            DealerAllowance updated = dealerAllowanceService.updateAllowance(id, allowanceDetails);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Update failed", e.getMessage()));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAllowance(@PathVariable Long id) {
        try {
            dealerAllowanceService.deleteAllowance(id);
            return ResponseEntity.ok(new SuccessResponse("Deleted", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Not found", e.getMessage()));
        }
    }
    @GetMapping("/active/list")
    public ResponseEntity<List<DealerAllowance>> getActiveAllowances() {
        List<DealerAllowance> allowances = dealerAllowanceService.getActiveAllowances();
        return ResponseEntity.ok(allowances);
    }

    public static class SuccessResponse {
        private final String message;
        private final Object data;

        public SuccessResponse(String message, Object data) {
            this.message = message;
            this.data = data;
        }

        public String getMessage() { return message; }
        public Object getData() { return data; }
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
