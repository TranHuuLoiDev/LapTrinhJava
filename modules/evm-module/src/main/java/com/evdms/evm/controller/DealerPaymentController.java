package com.evdms.evm.controller;

import com.evdms.evm.model.DealerPayment;
import com.evdms.evm.service.DealerPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dealer-payments")
@CrossOrigin(origins = "*")
public class DealerPaymentController {
    
    @Autowired
    private DealerPaymentService dealerPaymentService;
    
    @GetMapping
    public ResponseEntity<List<DealerPayment>> getAllPayments() {
        List<DealerPayment> payments = dealerPaymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DealerPayment> getPaymentById(@PathVariable Long id) {
        Optional<DealerPayment> payment = dealerPaymentService.getPaymentById(id);
        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<List<DealerPayment>> getPaymentsByDealerId(@PathVariable Integer dealerId) {
        List<DealerPayment> payments = dealerPaymentService.getPaymentsByDealerId(dealerId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/payable/{payableId}")
    public ResponseEntity<List<DealerPayment>> getPaymentsByPayableId(@PathVariable Integer payableId) {
        List<DealerPayment> payments = dealerPaymentService.getPaymentsByPayableId(payableId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<DealerPayment>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<DealerPayment> payments = dealerPaymentService.getPaymentsByDateRange(start, end);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/method/{method}")
    public ResponseEntity<List<DealerPayment>> getPaymentsByMethod(@PathVariable String method) {
        List<DealerPayment> payments = dealerPaymentService.getPaymentsByMethod(method);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/reference/{referenceNumber}")
    public ResponseEntity<List<DealerPayment>> getPaymentsByReference(@PathVariable String referenceNumber) {
        List<DealerPayment> payments = dealerPaymentService.getPaymentsByReference(referenceNumber);
        return ResponseEntity.ok(payments);
    }
    
    @PostMapping
    public ResponseEntity<DealerPayment> createPayment(@RequestBody DealerPayment payment) {
        DealerPayment created = dealerPaymentService.createPayment(payment);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DealerPayment> updatePayment(
            @PathVariable Long id,
            @RequestBody DealerPayment payment) {
        try {
            DealerPayment updated = dealerPaymentService.updatePayment(id, payment);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        dealerPaymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
