package com.evdms.evm.controller;

import com.evdms.evm.model.CustomerFinancing;
import com.evdms.evm.service.CustomerFinancingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer-financing")
@CrossOrigin(origins = "*")
public class CustomerFinancingController {
    
    @Autowired
    private CustomerFinancingService customerFinancingService;
    
    @GetMapping
    public ResponseEntity<List<CustomerFinancing>> getAllFinancing() {
        List<CustomerFinancing> financingList = customerFinancingService.getAllFinancing();
        return ResponseEntity.ok(financingList);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CustomerFinancing> getFinancingById(@PathVariable Long id) {
        Optional<CustomerFinancing> financing = customerFinancingService.getFinancingById(id);
        return financing.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerFinancing>> getFinancingByCustomerId(@PathVariable Integer customerId) {
        List<CustomerFinancing> financingList = customerFinancingService.getFinancingByCustomerId(customerId);
        return ResponseEntity.ok(financingList);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<CustomerFinancing> getFinancingByOrderId(@PathVariable Integer orderId) {
        Optional<CustomerFinancing> financing = customerFinancingService.getFinancingByOrderId(orderId);
        return financing.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CustomerFinancing>> getFinancingByStatus(@PathVariable String status) {
        List<CustomerFinancing> financingList = customerFinancingService.getFinancingByStatus(status);
        return ResponseEntity.ok(financingList);
    }
    
    @PostMapping
    public ResponseEntity<CustomerFinancing> createFinancing(@RequestBody CustomerFinancing financing) {
        CustomerFinancing created = customerFinancingService.createFinancing(financing);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CustomerFinancing> updateFinancing(
            @PathVariable Long id,
            @RequestBody CustomerFinancing financing) {
        try {
            CustomerFinancing updated = customerFinancingService.updateFinancing(id, financing);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinancing(@PathVariable Long id) {
        customerFinancingService.deleteFinancing(id);
        return ResponseEntity.noContent().build();
    }
}
