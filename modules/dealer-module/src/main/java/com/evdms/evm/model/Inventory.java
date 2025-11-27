package com.evdms.evm.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "dealer_id")
    private Long dealerId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "vin_number")
    private String vinNumber;

    @Column
    private String location;

    public Inventory() {}

    public Inventory(Long vehicleId, Long dealerId, Integer quantity, String vinNumber, String location) {
        this.vehicleId = vehicleId;
        this.dealerId = dealerId;
        this.quantity = quantity;
        this.vinNumber = vinNumber;
        this.location = location;
    }

    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public Long getDealerId() { return dealerId; }
    public void setDealerId(Long dealerId) { this.dealerId = dealerId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getVinNumber() { return vinNumber; }
    public void setVinNumber(String vinNumber) { this.vinNumber = vinNumber; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
