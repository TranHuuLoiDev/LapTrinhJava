package com.evdms.evm.repository;

import com.evdms.evm.model.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    
    List<InventoryTransaction> findByInventoryId(Integer inventoryId);
    
    List<InventoryTransaction> findByVehicleId(Integer vehicleId);
    
    List<InventoryTransaction> findByDealerId(Integer dealerId);
    
    List<InventoryTransaction> findByTransactionType(InventoryTransaction.TransactionType transactionType);
    
    List<InventoryTransaction> findByTransactionDateBetween(LocalDateTime start, LocalDateTime end);
    
    List<InventoryTransaction> findByPerformedBy(Integer userId);
}
