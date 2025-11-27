package com.evdms.evm.service;

import com.evdms.evm.model.InventoryTransaction;
import com.evdms.evm.repository.InventoryTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class InventoryTransactionService {
    
    @Autowired
    private InventoryTransactionRepository inventoryTransactionRepository;
    
    public List<InventoryTransaction> getAllTransactions() {
        return inventoryTransactionRepository.findAll();
    }
    
    public Optional<InventoryTransaction> getTransactionById(Long id) {
        return inventoryTransactionRepository.findById(id);
    }
    
    public List<InventoryTransaction> getTransactionsByInventoryId(Integer inventoryId) {
        return inventoryTransactionRepository.findByInventoryId(inventoryId);
    }
    
    public List<InventoryTransaction> getTransactionsByVehicleId(Integer vehicleId) {
        return inventoryTransactionRepository.findByVehicleId(vehicleId);
    }
    
    public List<InventoryTransaction> getTransactionsByDealerId(Integer dealerId) {
        return inventoryTransactionRepository.findByDealerId(dealerId);
    }
    
    public List<InventoryTransaction> getTransactionsByType(String type) {
        try {
            InventoryTransaction.TransactionType transactionType = InventoryTransaction.TransactionType.valueOf(type.toUpperCase());
            return inventoryTransactionRepository.findByTransactionType(transactionType);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
    
    public List<InventoryTransaction> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return inventoryTransactionRepository.findByTransactionDateBetween(start, end);
    }
    
    public InventoryTransaction createTransaction(InventoryTransaction transaction) {
        return inventoryTransactionRepository.save(transaction);
    }
    
    public InventoryTransaction updateTransaction(Long id, InventoryTransaction transaction) {
        if (inventoryTransactionRepository.existsById(id)) {
            transaction.setTransactionId(id);
            return inventoryTransactionRepository.save(transaction);
        }
        throw new RuntimeException("Transaction not found with id: " + id);
    }
    
    public void deleteTransaction(Long id) {
        inventoryTransactionRepository.deleteById(id);
    }
}
