package com.evdms.evm.service;

import com.evdms.evm.model.DealerPayment;
import com.evdms.evm.repository.DealerPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class DealerPaymentService {
    
    @Autowired
    private DealerPaymentRepository dealerPaymentRepository;
    
    public List<DealerPayment> getAllPayments() {
        return dealerPaymentRepository.findAll();
    }
    
    public Optional<DealerPayment> getPaymentById(Long id) {
        return dealerPaymentRepository.findById(id);
    }
    
    public List<DealerPayment> getPaymentsByDealerId(Integer dealerId) {
        return dealerPaymentRepository.findByDealerId(dealerId);
    }
    
    public List<DealerPayment> getPaymentsByPayableId(Integer payableId) {
        return dealerPaymentRepository.findByPayableId(payableId);
    }
    
    public List<DealerPayment> getPaymentsByDateRange(LocalDate start, LocalDate end) {
        return dealerPaymentRepository.findByPaymentDateBetween(start, end);
    }
    
    public List<DealerPayment> getPaymentsByMethod(String method) {
        return dealerPaymentRepository.findByPaymentMethod(method);
    }
    
    public List<DealerPayment> getPaymentsByReference(String referenceNumber) {
        return dealerPaymentRepository.findByReferenceNumber(referenceNumber);
    }
    
    public DealerPayment createPayment(DealerPayment payment) {
        return dealerPaymentRepository.save(payment);
    }
    
    public DealerPayment updatePayment(Long id, DealerPayment payment) {
        if (dealerPaymentRepository.existsById(id)) {
            payment.setPaymentId(id);
            return dealerPaymentRepository.save(payment);
        }
        throw new RuntimeException("Payment not found with id: " + id);
    }
    
    public void deletePayment(Long id) {
        dealerPaymentRepository.deleteById(id);
    }
}
