package com.evdms.evm.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.OrderItem;
import com.evdms.evm.repository.OrderItemRepository;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found"));
    }

    public OrderItem saveOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public void deleteOrderItem(Long id) {
        if (!orderItemRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found");
        }
        orderItemRepository.deleteById(id);
    }

    public OrderItem updateOrderItem(Long id, OrderItem updatedOrderItem) {
        return orderItemRepository.findById(id).map(orderItem -> {
            orderItem.setOrderId(updatedOrderItem.getOrderId());
            orderItem.setVehicle(updatedOrderItem.getVehicle());
            orderItem.setQuantity(updatedOrderItem.getQuantity());
            orderItem.setUnitPrice(updatedOrderItem.getUnitPrice());
            orderItem.setDiscountAmount(updatedOrderItem.getDiscountAmount());
            return orderItemRepository.save(orderItem);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found"));
    }
}
