package com.evdms.evm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.Feedback;
import com.evdms.evm.service.FeedbackService;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // --- GET tất cả feedback ---
    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    // --- GET feedback theo ID ---
    @GetMapping("/{id}")
    public Feedback getFeedbackById(@PathVariable("id") Long id) {
        return feedbackService.getFeedbackById(id);
    }

    // --- POST: thêm feedback mới ---
    @PostMapping
    public Feedback addFeedback(@RequestBody Feedback feedback) {
        return feedbackService.saveFeedback(feedback);
    }

    // --- PUT: cập nhật feedback ---
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(
            @PathVariable("id") Long id,
            @RequestBody Feedback updatedFeedback) {
        try {
            Feedback feedback = feedbackService.updateFeedback(id, updatedFeedback);
            return ResponseEntity.ok(feedback);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // --- DELETE feedback ---
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable("id") Long id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.ok("Feedback with ID " + id + " has been deleted");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        }
    }
}
