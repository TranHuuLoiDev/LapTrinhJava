package com.evdms.evm.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "feedback_type", nullable = false)
    private String feedbackType;

    @Column(nullable = false)
    private String subject;

    @Column(length = 2000)
    private String content;

    @Column(nullable = false)
    private Integer rating;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Column(nullable = false)
    private String status;

    // --- Constructors ---
    public Feedback() {}

    public Feedback(Long customerId, String feedbackType, String subject, String content,
                    Integer rating, LocalDateTime submissionDate, String status) {
        this.customerId = customerId;
        this.feedbackType = feedbackType;
        this.subject = subject;
        this.content = content;
        this.rating = rating;
        this.submissionDate = submissionDate;
        this.status = status;
    }

    // --- Getters & Setters ---
    public Long getFeedbackId() { return feedbackId; }
    public void setFeedbackId(Long feedbackId) { this.feedbackId = feedbackId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getFeedbackType() { return feedbackType; }
    public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
