package com.evdms.evm.repository;

import com.evdms.evm.model.CustomerFinancing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerFinancingRepository extends JpaRepository<CustomerFinancing, Long> {
    
    List<CustomerFinancing> findByCustomerId(Integer customerId);
    
    Optional<CustomerFinancing> findByOrderId(Integer orderId);
    
    List<CustomerFinancing> findByStatus(String status);
    
    List<CustomerFinancing> findByBankName(String bankName);
}
