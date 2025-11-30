package com.evdms.evm.service;

import com.evdms.evm.model.DealerPayment;
import com.evdms.evm.repository.DealerPaymentRepository;
import com.evdms.evm.repository.DealerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class DealerPaymentService {
    
    @Autowired
    private DealerPaymentRepository dealerPaymentRepository;
    
    @Autowired
    private DealerRepository dealerRepository;
    
    public List<Map<String, Object>> getAllPayments() {
        List<DealerPayment> payments = dealerPaymentRepository.findAll();
        return payments.stream().map(this::convertToMap).collect(Collectors.toList());
    }
    
    private Map<String, Object> convertToMap(DealerPayment payment) {
        Map<String, Object> map = new HashMap<>();
        map.put("paymentId", payment.getPaymentId());
        map.put("payableId", payment.getPayableId());
        map.put("dealerId", payment.getDealerId());
        map.put("paymentDate", payment.getPaymentDate());
        map.put("amountPaid", payment.getAmountPaid());
        map.put("paymentMethod", payment.getPaymentMethod());
        map.put("referenceNumber", payment.getReferenceNumber());
        map.put("bankName", payment.getBankName());
        map.put("notes", payment.getNotes());
        
        // JOIN với Dealers để lấy dealerName
        if (payment.getDealerId() != null) {
            dealerRepository.findById(payment.getDealerId().longValue()).ifPresent(dealer -> {
                map.put("dealerName", dealer.getDealerName());
            });
        }
        
        return map;
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
