package com.evdms.evm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.SalesOrder;
import com.evdms.evm.repository.SalesOrderRepository;

@Service
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;

    public SalesOrderService(SalesOrderRepository salesOrderRepository) {
        this.salesOrderRepository = salesOrderRepository;
    }

    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    public SalesOrder getSalesOrderById(Long id) {
        Optional<SalesOrder> order = salesOrderRepository.findById(id);
        return order.orElse(null);
    }

    public SalesOrder saveSalesOrder(SalesOrder salesOrder) {
        return salesOrderRepository.save(salesOrder);
    }

    public SalesOrder updateSalesOrder(Long id, SalesOrder updatedOrder) {
        return salesOrderRepository.findById(id)
            .map(order -> {
                order.setOrderDate(updatedOrder.getOrderDate());
                order.setCustomerId(updatedOrder.getCustomerId());
                order.setDealerId(updatedOrder.getDealerId());
                order.setSalespersonId(updatedOrder.getSalespersonId());
                order.setTotalAmount(updatedOrder.getTotalAmount());
                order.setStatus(updatedOrder.getStatus());
                order.setPaymentMethod(updatedOrder.getPaymentMethod());
                order.setDeliveryDateExpected(updatedOrder.getDeliveryDateExpected());
                order.setDeliveryDateActual(updatedOrder.getDeliveryDateActual());
                return salesOrderRepository.save(order);
            })
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SalesOrder not found with id " + id));
    }

    public void deleteSalesOrder(Long id) {
        if (!salesOrderRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "SalesOrder not found with id " + id);
        }
        salesOrderRepository.deleteById(id);
    }
}
