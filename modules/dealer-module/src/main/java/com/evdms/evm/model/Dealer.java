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
@Table(name = "dealers")
public class Dealer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dealer_id")
    private Long dealerId;

    @Column(name = "dealer_name")
    private String dealerName;

    @Column
    private String address;

    @Column
    private String phone;

    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    @Column(name = "sales_quota")
    private BigDecimal salesQuota;

    public Dealer() {}

    public Long getDealerId() { return dealerId; }
    public void setDealerId(Long dealerId) { this.dealerId = dealerId; }

    public String getDealerName() { return dealerName; }
    public void setDealerName(String dealerName) { this.dealerName = dealerName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getContractStartDate() { return contractStartDate; }
    public void setContractStartDate(LocalDate contractStartDate) { this.contractStartDate = contractStartDate; }

    public BigDecimal getSalesQuota() { return salesQuota; }
    public void setSalesQuota(BigDecimal salesQuota) { this.salesQuota = salesQuota; }
}
