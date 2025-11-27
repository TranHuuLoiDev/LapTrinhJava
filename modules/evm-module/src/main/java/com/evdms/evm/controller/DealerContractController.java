package com.evdms.evm.controller;

import com.evdms.evm.model.DealerContract;
import com.evdms.evm.service.DealerContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dealer-contracts")
public class DealerContractController {
    @Autowired
    private DealerContractService dealerContractService;

    @GetMapping
    public List<DealerContract> getAllContracts() {
        return dealerContractService.getAllContracts();
    }

    @GetMapping("/{id}")
    public DealerContract getContractById(@PathVariable Long id) {
        return dealerContractService.getContractById(id);
    }

    @PostMapping
    public DealerContract saveContract(@RequestBody DealerContract contract) {
        return dealerContractService.saveContract(contract);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealerContract> updateContract(@PathVariable Long id, @RequestBody DealerContract contract) {
        return ResponseEntity.ok(dealerContractService.updateContract(id, contract));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContract(@PathVariable Long id) {
        dealerContractService.deleteContract(id);
        return ResponseEntity.ok("Contract deleted successfully");
    }
}
