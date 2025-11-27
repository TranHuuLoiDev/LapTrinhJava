package com.evdms.evm.controller;

import java.util.List;

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
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.SalesOrder;
import com.evdms.evm.service.SalesOrderService;

@RestController
@RequestMapping("/api/salesorders")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    @GetMapping
    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderService.getAllSalesOrders();
    }

    @GetMapping("/{id}")
    public SalesOrder getSalesOrderById(@PathVariable("id") Long id) {
        return salesOrderService.getSalesOrderById(id);
    }

    @PostMapping
    public ResponseEntity<?> addSalesOrder(@RequestBody SalesOrder salesOrder) {
        try {
            System.out.println("Received SalesOrder: " + salesOrder);
            System.out.println("Customer ID: " + salesOrder.getCustomerId());
            System.out.println("Total Amount: " + salesOrder.getTotalAmount());
            System.out.println("Status: " + salesOrder.getStatus());
            System.out.println("Payment Method: " + salesOrder.getPaymentMethod());
            System.out.println("Order Date: " + salesOrder.getOrderDate());
            
            SalesOrder saved = salesOrderService.saveSalesOrder(salesOrder);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error saving sales order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSalesOrder(@PathVariable("id") Long id) {
        try {
            salesOrderService.deleteSalesOrder(id);
            return ResponseEntity.ok("SalesOrder with ID " + id + " has been deleted");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesOrder> updateSalesOrder(
            @PathVariable("id") Long id,
            @RequestBody SalesOrder updatedOrder) {
        try {
            SalesOrder order = salesOrderService.updateSalesOrder(id, updatedOrder);
            return ResponseEntity.ok(order);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
    }
    
}
