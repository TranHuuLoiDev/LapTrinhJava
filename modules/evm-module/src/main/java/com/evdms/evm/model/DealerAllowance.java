package com.evdms.evm.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "dealer_allowances")
public class DealerAllowance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allowance_id")
    private Long allowanceId;

    @Column(name = "dealer_id", nullable = false)
    private Long dealerId;

    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    @Column(name = "wholesale_price", nullable = false)
    private BigDecimal wholesalePrice;

    @Column(name = "retail_price", nullable = false)
    private BigDecimal retailPrice;

    @Column(name = "discount_percentage")
    private Double discountPercentage;

    @Column(name = "allowed_quantity")
    private Integer allowedQuantity;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public DealerAllowance() {}

    public DealerAllowance(Long dealerId, Long vehicleId, BigDecimal wholesalePrice,
                          BigDecimal retailPrice, Double discountPercentage, Integer allowedQuantity) {
        this.dealerId = dealerId;
        this.vehicleId = vehicleId;
        this.wholesalePrice = wholesalePrice;
        this.retailPrice = retailPrice;
        this.discountPercentage = discountPercentage;
        this.allowedQuantity = allowedQuantity;
        this.isActive = true;
    }

    public Long getAllowanceId() { return allowanceId; }
    public void setAllowanceId(Long allowanceId) { this.allowanceId = allowanceId; }

    public Long getDealerId() { return dealerId; }
    public void setDealerId(Long dealerId) { this.dealerId = dealerId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public BigDecimal getWholesalePrice() { return wholesalePrice; }
    public void setWholesalePrice(BigDecimal wholesalePrice) { this.wholesalePrice = wholesalePrice; }

    public BigDecimal getRetailPrice() { return retailPrice; }
    public void setRetailPrice(BigDecimal retailPrice) { this.retailPrice = retailPrice; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }

    public Integer getAllowedQuantity() { return allowedQuantity; }
    public void setAllowedQuantity(Integer allowedQuantity) { this.allowedQuantity = allowedQuantity; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
