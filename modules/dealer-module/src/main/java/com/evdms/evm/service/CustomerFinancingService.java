package com.evdms.evm.service;

import com.evdms.evm.model.CustomerFinancing;
import com.evdms.evm.repository.CustomerFinancingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class CustomerFinancingService {
    
    @Autowired
    private CustomerFinancingRepository customerFinancingRepository;
    
    public List<CustomerFinancing> getAllFinancing() {
        return customerFinancingRepository.findAll();
    }
    
    public Optional<CustomerFinancing> getFinancingById(Long id) {
        return customerFinancingRepository.findById(id);
    }
    
    public List<CustomerFinancing> getFinancingByCustomerId(Integer customerId) {
        return customerFinancingRepository.findByCustomerId(customerId);
    }
    
    public Optional<CustomerFinancing> getFinancingByOrderId(Integer orderId) {
        return customerFinancingRepository.findByOrderId(orderId);
    }
    
    public List<CustomerFinancing> getFinancingByStatus(String status) {
        return customerFinancingRepository.findByStatus(status);
    }
    
    public CustomerFinancing createFinancing(CustomerFinancing financing) {
        return customerFinancingRepository.save(financing);
    }
    
    public CustomerFinancing updateFinancing(Long id, CustomerFinancing financing) {
        if (customerFinancingRepository.existsById(id)) {
            financing.setFinancingId(id);
            return customerFinancingRepository.save(financing);
        }
        throw new RuntimeException("Financing not found with id: " + id);
    }
    
    public void deleteFinancing(Long id) {
        customerFinancingRepository.deleteById(id);
    }
}
