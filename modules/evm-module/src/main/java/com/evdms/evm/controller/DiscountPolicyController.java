package com.evdms.evm.controller;

import com.evdms.evm.model.DiscountPolicy;
import com.evdms.evm.service.DiscountPolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/discount-policies")
public class DiscountPolicyController {
    @Autowired
    private DiscountPolicyService discountPolicyService;

    @GetMapping
    public List<DiscountPolicy> getAllPolicies() {
        return discountPolicyService.getAllPolicies();
    }

    @GetMapping("/{id}")
    public DiscountPolicy getPolicyById(@PathVariable Long id) {
        return discountPolicyService.getPolicyById(id);
    }

    @PostMapping
    public DiscountPolicy savePolicy(@RequestBody DiscountPolicy policy) {
        return discountPolicyService.savePolicy(policy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiscountPolicy> updatePolicy(@PathVariable Long id, @RequestBody DiscountPolicy policy) {
        return ResponseEntity.ok(discountPolicyService.updatePolicy(id, policy));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePolicy(@PathVariable Long id) {
        discountPolicyService.deletePolicy(id);
        return ResponseEntity.ok("Policy deleted successfully");
    }
}
