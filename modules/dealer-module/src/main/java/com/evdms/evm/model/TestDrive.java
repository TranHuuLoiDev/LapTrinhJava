package com.evdms.evm.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "testdrives")
public class TestDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_drive_id")
    private Long testDriveId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    @Column(name = "dealer_id")
    private Long dealerId;

    @Column(name = "preferred_date")
    private LocalDate preferredDate;

    @Column(name = "preferred_time")
    private LocalTime preferredTime;

    @Column(name = "status")
    private String status;

    @Column(name = "note", length = 1000)
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public TestDrive() {}

    public TestDrive(Long customerId, Long vehicleId, Long dealerId,
                     LocalDate preferredDate, LocalTime preferredTime,
                     String status, String note, LocalDateTime createdAt) {
        this.customerId = customerId;
        this.vehicleId = vehicleId;
        this.dealerId = dealerId;
        this.preferredDate = preferredDate;
        this.preferredTime = preferredTime;
        this.status = status;
        this.note = note;
        this.createdAt = createdAt;
    }

    public Long getTestDriveId() { return testDriveId; }
    public void setTestDriveId(Long testDriveId) { this.testDriveId = testDriveId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public Long getDealerId() { return dealerId; }
    public void setDealerId(Long dealerId) { this.dealerId = dealerId; }

    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }

    public LocalTime getPreferredTime() { return preferredTime; }
    public void setPreferredTime(LocalTime preferredTime) { this.preferredTime = preferredTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
