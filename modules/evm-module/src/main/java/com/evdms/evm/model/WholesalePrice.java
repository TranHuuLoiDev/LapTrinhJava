package com.evdms.evm.model;

import java.math.BigDecimal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "wholesale_prices")
public class WholesalePrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "price_id")
    private Long priceId;

    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    @Column(name = "dealer_id", nullable = false)
    private Long dealerId;

    @Column(name = "wholesale_price", nullable = false)
    private BigDecimal wholesalePrice;

    @Column(name = "effective_from")
    private String effectiveFrom;

    @Column(name = "effective_to")
    private String effectiveTo;

    public Long getPriceId() { return priceId; }
    public void setPriceId(Long priceId) { this.priceId = priceId; }
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public Long getDealerId() { return dealerId; }
    public void setDealerId(Long dealerId) { this.dealerId = dealerId; }
    public BigDecimal getWholesalePrice() { return wholesalePrice; }
    public void setWholesalePrice(BigDecimal wholesalePrice) { this.wholesalePrice = wholesalePrice; }
    public String getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(String effectiveFrom) { this.effectiveFrom = effectiveFrom; }
    public String getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(String effectiveTo) { this.effectiveTo = effectiveTo; }
}
