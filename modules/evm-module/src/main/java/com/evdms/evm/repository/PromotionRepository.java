package com.evdms.evm.repository;

import com.evdms.evm.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    
    List<Promotion> findByIsActiveTrueOrderByStartDateDesc();
    
    List<Promotion> findByPromotionNameContainingIgnoreCase(String name);
    
    List<Promotion> findByIsActiveTrueAndStartDateBeforeAndEndDateAfter(LocalDateTime startDate, LocalDateTime endDate);
}
