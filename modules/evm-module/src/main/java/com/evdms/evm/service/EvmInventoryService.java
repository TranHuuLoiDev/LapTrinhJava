package com.evdms.evm.service;

import com.evdms.evm.model.Inventory;
import com.evdms.evm.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class EvmInventoryService {

    private final InventoryRepository inventoryRepository;

    public EvmInventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<Map<String, Object>> getInventorySummary() {
        List<Inventory> allInventories = inventoryRepository.findAll();
        
        return allInventories.stream()
                .collect(Collectors.groupingBy(Inventory::getVehicleId))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> summary = new HashMap<>();
                    summary.put("vehicleId", entry.getKey());
                    summary.put("totalQuantity", 
                            entry.getValue().stream()
                                    .mapToInt(Inventory::getQuantity)
                                    .sum());
                    return summary;
                })
                .collect(Collectors.toList());
    }

    public long getTotalInventoryByVehicle(Long vehicleId) {
        List<Inventory> inventories = inventoryRepository.findByVehicleId(vehicleId);
        return inventories.stream()
                .mapToInt(Inventory::getQuantity)
                .sum();
    }

    public List<Map<String, Object>> getInventoryByDealer(Long dealerId) {
        List<Inventory> inventories = inventoryRepository.findByDealerId(dealerId);
        
        return inventories.stream()
                .map(inv -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("inventoryId", inv.getInventoryId());
                    data.put("dealerId", inv.getDealerId());
                    data.put("vehicleId", inv.getVehicleId());
                    data.put("quantity", inv.getQuantity());
                    data.put("vinNumber", inv.getVinNumber());
                    data.put("location", inv.getLocation());
                    return data;
                })
                .collect(Collectors.toList());
    }

    public void allocateInventoryToDealer(Long dealerId, Long vehicleId, Long quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Inventory inventory = new Inventory();
        inventory.setDealerId(dealerId);
        inventory.setVehicleId(vehicleId);
        inventory.setQuantity(quantity.intValue());
        inventoryRepository.save(inventory);
    }

    public void updateAllocation(Long allocationId, Long newQuantity) {
        if (newQuantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Inventory inventory = inventoryRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Not found allocation"));

        inventory.setQuantity(newQuantity.intValue());
        inventoryRepository.save(inventory);
    }

    public void adjustInventory(Long vehicleId, Long adjustment) {
        if (adjustment == 0) {
            throw new IllegalArgumentException("Adjustment must not be zero");
        }

        List<Inventory> inventories = inventoryRepository.findByVehicleId(vehicleId);
        if (inventories.isEmpty()) {
            Inventory inventory = new Inventory();
            inventory.setVehicleId(vehicleId);
            inventory.setQuantity(adjustment.intValue());
            inventoryRepository.save(inventory);
        } else {
            Inventory inventory = inventories.get(0);
            inventory.setQuantity(inventory.getQuantity() + adjustment.intValue());
            inventoryRepository.save(inventory);
        }
    }

    public List<Map<String, Object>> getInventoryTurnover() {
        List<Inventory> allInventories = inventoryRepository.findAll();
        
        return allInventories.stream()
                .filter(inv -> inv.getDealerId() != null && inv.getDealerId() > 0)
                .map(inv -> {
                    Map<String, Object> turnover = new HashMap<>();
                    turnover.put("dealerId", inv.getDealerId());
                    turnover.put("vehicleId", inv.getVehicleId());
                    turnover.put("quantity", inv.getQuantity());
                    turnover.put("vinNumber", inv.getVinNumber());
                    return turnover;
                })
                .collect(Collectors.toList());
    }

    public void recordSale(Long dealerId, Long vehicleId, Long quantity) {
        List<Inventory> inventories = inventoryRepository.findByDealerId(dealerId);
        Inventory inventory = inventories.stream()
                .filter(inv -> inv.getVehicleId().equals(vehicleId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Vehicle not found for dealer"));

        if (inventory.getQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient inventory");
        }

        inventory.setQuantity(inventory.getQuantity() - quantity.intValue());
        inventoryRepository.save(inventory);
    }

    public List<Map<String, Object>> getAllInventory() {
        List<Inventory> allInventories = inventoryRepository.findAll();
        return allInventories.stream()
                .map(inv -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("inventoryId", inv.getInventoryId());
                    data.put("dealerId", inv.getDealerId());
                    data.put("vehicleId", inv.getVehicleId());
                    data.put("quantity", inv.getQuantity());
                    data.put("vinNumber", inv.getVinNumber());
                    data.put("location", inv.getLocation());
                    return data;
                })
                .collect(Collectors.toList());
    }

    public void deleteInventory(Long inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        inventoryRepository.delete(inventory);
    }
}
