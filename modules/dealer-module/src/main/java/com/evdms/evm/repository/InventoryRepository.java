package com.evdms.evm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evdms.evm.model.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    java.util.List<Inventory> findByVehicleId(Long vehicleId);
    java.util.List<Inventory> findByDealerId(Long dealerId);
}
