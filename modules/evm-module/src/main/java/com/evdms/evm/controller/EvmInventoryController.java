package com.evdms.evm.controller;

import com.evdms.evm.service.EvmInventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evm/inventory")
public class EvmInventoryController {

    private final EvmInventoryService inventoryService;

    public EvmInventoryController(EvmInventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }
    @GetMapping("/summary")
    public ResponseEntity<List<Map<String, Object>>> getInventorySummary() {
        List<Map<String, Object>> summary = inventoryService.getInventorySummary();
        return ResponseEntity.ok(summary);
    }
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<?> getTotalInventoryByVehicle(@PathVariable Long vehicleId) {
        try {
            long quantity = inventoryService.getTotalInventoryByVehicle(vehicleId);
            Map<String, Object> response = new HashMap<>();
            response.put("vehicleId", vehicleId);
            response.put("totalQuantity", quantity);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Error", e.getMessage()));
        }
    }
    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<?> getInventoryByDealer(@PathVariable Long dealerId) {
        try {
            List<Map<String, Object>> inventory = inventoryService.getInventoryByDealer(dealerId);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Error", e.getMessage()));
        }
    }
    @PostMapping("/allocate")
    public ResponseEntity<?> allocateInventoryToDealer(@RequestBody AllocationRequest request) {
        try {
            inventoryService.allocateInventoryToDealer(request.dealerId, request.vehicleId, request.quantity);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cấp phát Success");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Error cấp phát", e.getMessage()));
        }
    }
    @PutMapping("/allocate/{allocationId}")
    public ResponseEntity<?> updateAllocation(@PathVariable Long allocationId, @RequestBody UpdateAllocationRequest request) {
        try {
            inventoryService.updateAllocation(allocationId, request.quantity);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Updated");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Update failed", e.getMessage()));
        }
    }
    @PostMapping("/adjust")
    public ResponseEntity<?> adjustInventory(@RequestBody AdjustmentRequest request) {
        try {
            inventoryService.adjustInventory(request.vehicleId, request.adjustment);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Điều chỉnh Success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Error điều chỉnh", e.getMessage()));
        }
    }
    @GetMapping("/turnover")
    public ResponseEntity<List<Map<String, Object>>> getInventoryTurnover() {
        List<Map<String, Object>> turnover = inventoryService.getInventoryTurnover();
        return ResponseEntity.ok(turnover);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllInventory() {
        List<Map<String, Object>> allInventory = inventoryService.getAllInventory();
        return ResponseEntity.ok(allInventory);
    }

    @DeleteMapping("/{inventoryId}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long inventoryId) {
        try {
            inventoryService.deleteInventory(inventoryId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Error", e.getMessage()));
        }
    }

    public static class AllocationRequest {
        public Long dealerId;
        public Long vehicleId;
        public Long quantity;
    }

    public static class UpdateAllocationRequest {
        public Long quantity;
    }

    public static class AdjustmentRequest {
        public Long vehicleId;
        public Long adjustment;
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
