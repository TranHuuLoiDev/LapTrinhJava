package com.evdms.evm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.Inventory;
import com.evdms.evm.service.InventoryService;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // --- GET tất cả inventories ---
    @GetMapping
    public List<Inventory> getAllInventories() {
        return inventoryService.getAllInventories();
    }

    // --- GET inventory theo ID ---
    @GetMapping("/{id}")
    public Inventory getInventoryById(@PathVariable("id") Long id) {
        return inventoryService.getInventoryById(id);
    }

    // --- POST: thêm inventory mới ---
    @PostMapping
    public Inventory addInventory(@RequestBody Inventory inventory) {
        return inventoryService.saveInventory(inventory);
    }

    // --- PUT: cập nhật inventory ---
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable("id") Long id,
            @RequestBody Inventory updatedInventory) {
        try {
            Inventory inventory = inventoryService.updateInventory(id, updatedInventory);
            return ResponseEntity.ok(inventory);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // --- DELETE inventory ---
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(@PathVariable("id") Long id) {
        try {
            inventoryService.deleteInventory(id);
            return ResponseEntity.ok("Inventory with ID " + id + " has been deleted");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        }
    }
}
