package com.evdms.evm.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.Inventory;
import com.evdms.evm.repository.InventoryRepository;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory not found with id " + id));
    }

    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Long id, Inventory updatedInventory) {
        return inventoryRepository.findById(id)
                .map(inv -> {
                    inv.setVehicleId(updatedInventory.getVehicleId());
                    inv.setDealerId(updatedInventory.getDealerId());
                    inv.setQuantity(updatedInventory.getQuantity());
                    inv.setVinNumber(updatedInventory.getVinNumber());
                    inv.setLocation(updatedInventory.getLocation());
                    return inventoryRepository.save(inv);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory not found with id " + id));
    }

    public void deleteInventory(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory not found with id " + id);
        }
        inventoryRepository.deleteById(id);
    }
}
