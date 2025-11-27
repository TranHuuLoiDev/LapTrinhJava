package com.evdms.evm.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "model_name", nullable = false)
    private String modelName;

    @Column(name = "version")
    private String version;

    @Column(name = "color")
    private String color;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "retail_price", nullable = false)
    private BigDecimal retailPrice;

    @Column(length = 1000)
    private String description;

    public Vehicle() {}

    public Vehicle(String modelName, String version, String color,
                   BigDecimal basePrice, BigDecimal retailPrice,
                   String description) {
        this.modelName = modelName;
        this.version = version;
        this.color = color;
        this.basePrice = basePrice;
        this.retailPrice = retailPrice;
        this.description = description;
    }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public BigDecimal getRetailPrice() { return retailPrice; }
    public void setRetailPrice(BigDecimal retailPrice) { this.retailPrice = retailPrice; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
