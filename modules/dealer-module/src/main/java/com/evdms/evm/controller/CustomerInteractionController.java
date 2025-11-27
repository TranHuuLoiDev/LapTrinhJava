package com.evdms.evm.controller;

import com.evdms.evm.model.CustomerInteraction;
import com.evdms.evm.service.CustomerInteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer-interactions")
@CrossOrigin(origins = "*")
public class CustomerInteractionController {
    
    @Autowired
    private CustomerInteractionService customerInteractionService;
    
    @GetMapping
    public ResponseEntity<List<CustomerInteraction>> getAllInteractions() {
        List<CustomerInteraction> interactions = customerInteractionService.getAllInteractions();
        return ResponseEntity.ok(interactions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CustomerInteraction> getInteractionById(@PathVariable Long id) {
        Optional<CustomerInteraction> interaction = customerInteractionService.getInteractionById(id);
        return interaction.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerInteraction>> getInteractionsByCustomerId(@PathVariable Integer customerId) {
        List<CustomerInteraction> interactions = customerInteractionService.getInteractionsByCustomerId(customerId);
        return ResponseEntity.ok(interactions);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomerInteraction>> getInteractionsByUserId(@PathVariable Integer userId) {
        List<CustomerInteraction> interactions = customerInteractionService.getInteractionsByUserId(userId);
        return ResponseEntity.ok(interactions);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<CustomerInteraction>> getInteractionsByType(@PathVariable String type) {
        List<CustomerInteraction> interactions = customerInteractionService.getInteractionsByType(type);
        return ResponseEntity.ok(interactions);
    }
    
    @GetMapping("/follow-ups")
    public ResponseEntity<List<CustomerInteraction>> getPendingFollowUps(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<CustomerInteraction> interactions = customerInteractionService.getPendingFollowUps(start, end);
        return ResponseEntity.ok(interactions);
    }
    
    @PostMapping
    public ResponseEntity<CustomerInteraction> createInteraction(@RequestBody CustomerInteraction interaction) {
        CustomerInteraction created = customerInteractionService.createInteraction(interaction);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CustomerInteraction> updateInteraction(
            @PathVariable Long id,
            @RequestBody CustomerInteraction interaction) {
        try {
            CustomerInteraction updated = customerInteractionService.updateInteraction(id, interaction);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInteraction(@PathVariable Long id) {
        customerInteractionService.deleteInteraction(id);
        return ResponseEntity.noContent().build();
    }
}
