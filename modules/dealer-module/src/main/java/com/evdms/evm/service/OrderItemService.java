package com.evdms.evm.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.OrderItem;
import com.evdms.evm.model.SalesOrder;
import com.evdms.evm.repository.OrderItemRepository;
import com.evdms.evm.repository.SalesOrderRepository;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final SalesOrderRepository salesOrderRepository;

    public OrderItemService(OrderItemRepository orderItemRepository,
                            SalesOrderRepository salesOrderRepository) {
        this.orderItemRepository = orderItemRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @SuppressWarnings("null")
    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found"));
    }

    @SuppressWarnings("null")

    public OrderItem saveOrderItem(OrderItem orderItem) {
        if (orderItem.getOrder() == null || orderItem.getOrder().getOrderId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is required");
        }
                SalesOrder order = salesOrderRepository.findById(orderItem.getOrder().getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SalesOrder not found"));

        orderItem.setOrder(order);
        return orderItemRepository.save(orderItem);
    }

    @SuppressWarnings("null")
    public void deleteOrderItem(Long id) {
        if (!orderItemRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found");
        }
        orderItemRepository.deleteById(id);
    }

    @SuppressWarnings("null")
    public OrderItem updateOrderItem(Long id, OrderItem updatedOrderItem) {
        return orderItemRepository.findById(id).map(orderItem -> {

            if (updatedOrderItem.getOrder() != null && updatedOrderItem.getOrder().getOrderId() != null) {
                SalesOrder order = salesOrderRepository.findById(updatedOrderItem.getOrder().getOrderId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SalesOrder not found"));
                orderItem.setOrder(order);
            }
            orderItem.setVehicle(updatedOrderItem.getVehicle());
            orderItem.setQuantity(updatedOrderItem.getQuantity());
            orderItem.setUnitPrice(updatedOrderItem.getUnitPrice());
            orderItem.setDiscountAmount(updatedOrderItem.getDiscountAmount());
            return orderItemRepository.save(orderItem);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found"));
    }
}
