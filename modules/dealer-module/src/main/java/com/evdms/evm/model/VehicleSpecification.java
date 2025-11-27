package com.evdms.evm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehiclespecifications")
public class VehicleSpecification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Long specId;
    
    @Column(name = "vehicle_id", nullable = false, unique = true)
    private Integer vehicleId;
    
    @Column(name = "battery_capacity", length = 50)
    private String batteryCapacity;
    
    @Column(name = "range_km")
    private Integer rangeKm;
    
    @Column(name = "charging_time", length = 100)
    private String chargingTime;
    
    @Column(name = "motor_power", length = 50)
    private String motorPower;
    
    @Column(name = "max_speed")
    private Integer maxSpeed;
    
    @Column(name = "seats")
    private Integer seats;
    
    @Column(name = "trunk_capacity", length = 50)
    private String trunkCapacity;
    
    @Column(name = "ground_clearance", length = 50)
    private String groundClearance;
    
    @Column(name = "wheelbase", length = 50)
    private String wheelbase;
    
    @Column(name = "length_width_height", length = 100)
    private String lengthWidthHeight;
    
    @Column(name = "curb_weight", length = 50)
    private String curbWeight;
    
    @Column(name = "drive_type", length = 50)
    private String driveType;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public VehicleSpecification() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getSpecId() {
        return specId;
    }

    public void setSpecId(Long specId) {
        this.specId = specId;
    }

    public Integer getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getBatteryCapacity() {
        return batteryCapacity;
    }

    public void setBatteryCapacity(String batteryCapacity) {
        this.batteryCapacity = batteryCapacity;
    }

    public Integer getRangeKm() {
        return rangeKm;
    }

    public void setRangeKm(Integer rangeKm) {
        this.rangeKm = rangeKm;
    }

    public String getChargingTime() {
        return chargingTime;
    }

    public void setChargingTime(String chargingTime) {
        this.chargingTime = chargingTime;
    }

    public String getMotorPower() {
        return motorPower;
    }

    public void setMotorPower(String motorPower) {
        this.motorPower = motorPower;
    }

    public Integer getMaxSpeed() {
        return maxSpeed;
    }

    public void setMaxSpeed(Integer maxSpeed) {
        this.maxSpeed = maxSpeed;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public String getTrunkCapacity() {
        return trunkCapacity;
    }

    public void setTrunkCapacity(String trunkCapacity) {
        this.trunkCapacity = trunkCapacity;
    }

    public String getGroundClearance() {
        return groundClearance;
    }

    public void setGroundClearance(String groundClearance) {
        this.groundClearance = groundClearance;
    }

    public String getWheelbase() {
        return wheelbase;
    }

    public void setWheelbase(String wheelbase) {
        this.wheelbase = wheelbase;
    }

    public String getLengthWidthHeight() {
        return lengthWidthHeight;
    }

    public void setLengthWidthHeight(String lengthWidthHeight) {
        this.lengthWidthHeight = lengthWidthHeight;
    }

    public String getCurbWeight() {
        return curbWeight;
    }

    public void setCurbWeight(String curbWeight) {
        this.curbWeight = curbWeight;
    }

    public String getDriveType() {
        return driveType;
    }

    public void setDriveType(String driveType) {
        this.driveType = driveType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
