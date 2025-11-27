package com.evdms.evm.repository;

import com.evdms.evm.model.CustomerInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomerInteractionRepository extends JpaRepository<CustomerInteraction, Long> {
    
    List<CustomerInteraction> findByCustomerId(Integer customerId);
    
    List<CustomerInteraction> findByUserId(Integer userId);
    
    List<CustomerInteraction> findByInteractionType(String interactionType);
    
    List<CustomerInteraction> findByStatus(String status);
    
    List<CustomerInteraction> findByCustomerIdOrderByInteractionDateDesc(Integer customerId);
    
    List<CustomerInteraction> findByNextFollowUpBetween(LocalDateTime start, LocalDateTime end);
}
