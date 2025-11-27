package com.evdms.evm.controller;

import com.evdms.evm.model.InventoryTransaction;
import com.evdms.evm.service.InventoryTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory-transactions")
@CrossOrigin(origins = "*")
public class InventoryTransactionController {
    
    @Autowired
    private InventoryTransactionService inventoryTransactionService;
    
    @GetMapping
    public ResponseEntity<List<InventoryTransaction>> getAllTransactions() {
        List<InventoryTransaction> transactions = inventoryTransactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InventoryTransaction> getTransactionById(@PathVariable Long id) {
        Optional<InventoryTransaction> transaction = inventoryTransactionService.getTransactionById(id);
        return transaction.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/inventory/{inventoryId}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByInventoryId(@PathVariable Integer inventoryId) {
        List<InventoryTransaction> transactions = inventoryTransactionService.getTransactionsByInventoryId(inventoryId);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByVehicleId(@PathVariable Integer vehicleId) {
        List<InventoryTransaction> transactions = inventoryTransactionService.getTransactionsByVehicleId(vehicleId);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByDealerId(@PathVariable Integer dealerId) {
        List<InventoryTransaction> transactions = inventoryTransactionService.getTransactionsByDealerId(dealerId);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByType(@PathVariable String type) {
        List<InventoryTransaction> transactions = inventoryTransactionService.getTransactionsByType(type);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<InventoryTransaction> transactions = inventoryTransactionService.getTransactionsByDateRange(start, end);
        return ResponseEntity.ok(transactions);
    }
    
    @PostMapping
    public ResponseEntity<InventoryTransaction> createTransaction(@RequestBody InventoryTransaction transaction) {
        InventoryTransaction created = inventoryTransactionService.createTransaction(transaction);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<InventoryTransaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody InventoryTransaction transaction) {
        try {
            InventoryTransaction updated = inventoryTransactionService.updateTransaction(id, transaction);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        inventoryTransactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
