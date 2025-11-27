package com.evdms.evm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customerinteractions")
public class CustomerInteraction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interaction_id")
    private Long interactionId;
    
    @Column(name = "customer_id", nullable = false)
    private Integer customerId;
    
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "interaction_type", length = 50, nullable = false)
    private String interactionType;
    
    @Column(name = "interaction_date")
    private LocalDateTime interactionDate;
    
    @Column(name = "subject", length = 200)
    private String subject;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "next_follow_up")
    private LocalDateTime nextFollowUp;
    
    @Column(name = "status", length = 20)
    private String status = "Completed";
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public CustomerInteraction() {
        this.interactionDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getInteractionId() {
        return interactionId;
    }

    public void setInteractionId(Long interactionId) {
        this.interactionId = interactionId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getInteractionType() {
        return interactionType;
    }

    public void setInteractionType(String interactionType) {
        this.interactionType = interactionType;
    }

    public LocalDateTime getInteractionDate() {
        return interactionDate;
    }

    public void setInteractionDate(LocalDateTime interactionDate) {
        this.interactionDate = interactionDate;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getNextFollowUp() {
        return nextFollowUp;
    }

    public void setNextFollowUp(LocalDateTime nextFollowUp) {
        this.nextFollowUp = nextFollowUp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
