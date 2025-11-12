package com.evdms.evm.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "salesorders")
public class SalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "dealer_id")
    private Long dealerId;

    @Column(name = "salesperson_id")
    private Long salespersonId;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;

    private String status;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "delivery_date_expected")
    private LocalDate deliveryDateExpected;

    @Column(name = "delivery_date_actual")
    private LocalDate deliveryDateActual;

    // --- Constructors ---
    public SalesOrder() {}

    public SalesOrder(LocalDateTime orderDate, Long customerId, Long dealerId, Long salespersonId,
                      BigDecimal totalAmount, String status, String paymentMethod,
                      LocalDate deliveryDateExpected, LocalDate deliveryDateActual) {
        this.orderDate = orderDate;
        this.customerId = customerId;
        this.dealerId = dealerId;
        this.salespersonId = salespersonId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.deliveryDateExpected = deliveryDateExpected;
        this.deliveryDateActual = deliveryDateActual;
    }

    // --- Getters & Setters ---
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getDealerId() { return dealerId; }
    public void setDealerId(Long dealerId) { this.dealerId = dealerId; }

    public Long getSalespersonId() { return salespersonId; }
    public void setSalespersonId(Long salespersonId) { this.salespersonId = salespersonId; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDate getDeliveryDateExpected() { return deliveryDateExpected; }
    public void setDeliveryDateExpected(LocalDate deliveryDateExpected) { this.deliveryDateExpected = deliveryDateExpected; }

    public LocalDate getDeliveryDateActual() { return deliveryDateActual; }
    public void setDeliveryDateActual(LocalDate deliveryDateActual) { this.deliveryDateActual = deliveryDateActual; }
}
