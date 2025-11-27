package com.evdms.evm.service;

import com.evdms.evm.model.CustomerInteraction;
import com.evdms.evm.repository.CustomerInteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class CustomerInteractionService {
    
    @Autowired
    private CustomerInteractionRepository customerInteractionRepository;
    
    public List<CustomerInteraction> getAllInteractions() {
        return customerInteractionRepository.findAll();
    }
    
    public Optional<CustomerInteraction> getInteractionById(Long id) {
        return customerInteractionRepository.findById(id);
    }
    
    public List<CustomerInteraction> getInteractionsByCustomerId(Integer customerId) {
        return customerInteractionRepository.findByCustomerIdOrderByInteractionDateDesc(customerId);
    }
    
    public List<CustomerInteraction> getInteractionsByUserId(Integer userId) {
        return customerInteractionRepository.findByUserId(userId);
    }
    
    public List<CustomerInteraction> getInteractionsByType(String type) {
        return customerInteractionRepository.findByInteractionType(type);
    }
    
    public List<CustomerInteraction> getPendingFollowUps(LocalDateTime start, LocalDateTime end) {
        return customerInteractionRepository.findByNextFollowUpBetween(start, end);
    }
    
    public CustomerInteraction createInteraction(CustomerInteraction interaction) {
        return customerInteractionRepository.save(interaction);
    }
    
    public CustomerInteraction updateInteraction(Long id, CustomerInteraction interaction) {
        if (customerInteractionRepository.existsById(id)) {
            interaction.setInteractionId(id);
            return customerInteractionRepository.save(interaction);
        }
        throw new RuntimeException("Interaction not found with id: " + id);
    }
    
    public void deleteInteraction(Long id) {
        customerInteractionRepository.deleteById(id);
    }
}
