package com.evdms.evm.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "dealerpayables")
public class DealerPayable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payable_id")
    private Long payableId;

    @Column(name = "dealer_id", nullable = false)
    private Long dealerId;

    @Column(name = "invoice_number", nullable = false)
    private String invoiceNumber;

    @Column(name = "amount_due", nullable = false)
    private BigDecimal amountDue;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private String status;

    // --- Constructors ---
    public DealerPayable() {}

    public DealerPayable(Long dealerId, String invoiceNumber, BigDecimal amountDue, LocalDate dueDate, String status) {
        this.dealerId = dealerId;
        this.invoiceNumber = invoiceNumber;
        this.amountDue = amountDue;
        this.dueDate = dueDate;
        this.status = status;
    }

    // --- Getters & Setters ---
    public Long getPayableId() { return payableId; }
    public void setPayableId(Long payableId) { this.payableId = payableId; }

    public Long getDealerId() { return dealerId; }
    public void setDealerId(Long dealerId) { this.dealerId = dealerId; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public BigDecimal getAmountDue() { return amountDue; }
    public void setAmountDue(BigDecimal amountDue) { this.amountDue = amountDue; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
