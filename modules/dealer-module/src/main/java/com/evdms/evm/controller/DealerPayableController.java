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

import com.evdms.evm.model.DealerPayable;
import com.evdms.evm.service.DealerPayableService;

@RestController
@RequestMapping("/api/dealerpayables")
public class DealerPayableController {

    private final DealerPayableService dealerPayableService;

    public DealerPayableController(DealerPayableService dealerPayableService) {
        this.dealerPayableService = dealerPayableService;
    }

    @GetMapping
    public List<DealerPayable> getAllDealerPayables() {
        return dealerPayableService.getAllDealerPayables();
    }

    @GetMapping("/{id}")
    public DealerPayable getDealerPayableById(@PathVariable("id") Long id) {
        return dealerPayableService.getDealerPayableById(id);
    }

    @PostMapping
    public DealerPayable addDealerPayable(@RequestBody DealerPayable dealerPayable) {
        return dealerPayableService.saveDealerPayable(dealerPayable);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealerPayable> updateDealerPayable(
            @PathVariable("id") Long id,
            @RequestBody DealerPayable updatedPayable) {
        try {
            DealerPayable payable = dealerPayableService.updateDealerPayable(id, updatedPayable);
            return ResponseEntity.ok(payable);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDealerPayable(@PathVariable("id") Long id) {
        try {
            dealerPayableService.deleteDealerPayable(id);
            return ResponseEntity.ok("DealerPayable with ID " + id + " has been deleted");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        }
    }
}
