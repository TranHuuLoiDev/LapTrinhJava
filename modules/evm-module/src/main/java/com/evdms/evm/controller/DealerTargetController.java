package com.evdms.evm.controller;

import com.evdms.evm.model.DealerTarget;
import com.evdms.evm.service.DealerTargetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dealer-targets")
public class DealerTargetController {
    @Autowired
    private DealerTargetService dealerTargetService;

    @GetMapping
    public List<DealerTarget> getAllTargets() {
        return dealerTargetService.getAllTargets();
    }

    @GetMapping("/{id}")
    public DealerTarget getTargetById(@PathVariable Long id) {
        return dealerTargetService.getTargetById(id);
    }

    @PostMapping
    public DealerTarget saveTarget(@RequestBody DealerTarget target) {
        return dealerTargetService.saveTarget(target);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealerTarget> updateTarget(@PathVariable Long id, @RequestBody DealerTarget target) {
        return ResponseEntity.ok(dealerTargetService.updateTarget(id, target));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTarget(@PathVariable Long id) {
        dealerTargetService.deleteTarget(id);
        return ResponseEntity.ok("Target deleted successfully");
    }
}
