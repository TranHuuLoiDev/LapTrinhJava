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

import com.evdms.evm.model.OrderItem;
import com.evdms.evm.service.OrderItemService;

@RestController
@RequestMapping("/api/orderitems")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    // --- GET tất cả order items ---
    @GetMapping
    public List<OrderItem> getAllOrderItems() {
        return orderItemService.getAllOrderItems();
    }

    // --- GET theo ID ---
    @GetMapping("/{id}")
    public OrderItem getOrderItemById(@PathVariable("id") Long id) {
        return orderItemService.getOrderItemById(id);
    }

    // --- POST thêm mới ---
    @PostMapping
    public OrderItem addOrderItem(@RequestBody OrderItem orderItem) {
        return orderItemService.saveOrderItem(orderItem);
    }

    // --- DELETE theo ID ---
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrderItem(@PathVariable("id") Long id) {
        try {
            orderItemService.deleteOrderItem(id);
            return ResponseEntity.ok("OrderItem with ID " + id + " has been deleted");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        }
    }

    // --- PUT cập nhật ---
    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> updateOrderItem(
            @PathVariable("id") Long id,
            @RequestBody OrderItem updatedOrderItem) {
        try {
            OrderItem orderItem = orderItemService.updateOrderItem(id, updatedOrderItem);
            return ResponseEntity.ok(orderItem);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
