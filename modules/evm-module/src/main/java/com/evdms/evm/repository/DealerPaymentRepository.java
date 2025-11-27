package com.evdms.evm.repository;

import com.evdms.evm.model.DealerPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DealerPaymentRepository extends JpaRepository<DealerPayment, Long> {
    
    List<DealerPayment> findByDealerId(Integer dealerId);
    
    List<DealerPayment> findByPayableId(Integer payableId);
    
    List<DealerPayment> findByPaymentDateBetween(LocalDate start, LocalDate end);
    
    List<DealerPayment> findByPaymentMethod(String paymentMethod);
    
    List<DealerPayment> findByReferenceNumber(String referenceNumber);
}
