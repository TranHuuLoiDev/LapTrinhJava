package com.evdms.evm.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.Feedback;
import com.evdms.evm.repository.FeedbackRepository;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    @SuppressWarnings("null")
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found with id " + id));
    }

    @SuppressWarnings("null")
    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    @SuppressWarnings("null")
    public Feedback updateFeedback(Long id, Feedback updatedFeedback) {
        return feedbackRepository.findById(id)
                .map(feedback -> {
                    feedback.setCustomerId(updatedFeedback.getCustomerId());
                    feedback.setFeedbackType(updatedFeedback.getFeedbackType());
                    feedback.setSubject(updatedFeedback.getSubject());
                    feedback.setContent(updatedFeedback.getContent());
                    feedback.setRating(updatedFeedback.getRating());
                    feedback.setSubmissionDate(updatedFeedback.getSubmissionDate());
                    feedback.setStatus(updatedFeedback.getStatus());
                    return feedbackRepository.save(feedback);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found with id " + id));
    }

    @SuppressWarnings("null")
    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found with id " + id);
        }
        feedbackRepository.deleteById(id);
    }
}
