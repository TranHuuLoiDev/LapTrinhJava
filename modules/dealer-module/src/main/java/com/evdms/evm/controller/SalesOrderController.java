package com.evdms.evm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    // --- GET tất cả salesorders ---
    @GetMapping
    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderService.getAllSalesOrders();
    }

    // --- GET salesorder theo ID ---
    @GetMapping("/{id}")
    public SalesOrder getSalesOrderById(@PathVariable("id") Long id) {
        return salesOrderService.getSalesOrderById(id);
    }

    // --- POST: thêm mới ---
    @PostMapping
    public SalesOrder addSalesOrder(@RequestBody SalesOrder salesOrder) {
        return salesOrderService.saveSalesOrder(salesOrder);
    }

    // --- DELETE salesorder theo ID ---
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSalesOrder(@PathVariable("id") Long id) {
        try {
            salesOrderService.deleteSalesOrder(id);
            return ResponseEntity.ok("SalesOrder with ID " + id + " has been deleted");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        }
    }

    // --- PUT: cập nhật salesorder ---
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
