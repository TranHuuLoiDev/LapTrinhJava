package com.evdms.evm.service;

import com.evdms.evm.model.DiscountPolicy;
import com.evdms.evm.repository.DiscountPolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@SuppressWarnings("null")
public class DiscountPolicyService {
    @Autowired
    private DiscountPolicyRepository discountPolicyRepository;

    public List<DiscountPolicy> getAllPolicies() {
        return discountPolicyRepository.findAll();
    }

    public DiscountPolicy getPolicyById(Long id) {
        return discountPolicyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Policy not found"));
    }

    public DiscountPolicy savePolicy(DiscountPolicy policy) {
        return discountPolicyRepository.save(policy);
    }

    public DiscountPolicy updatePolicy(Long id, DiscountPolicy updatedPolicy) {
        DiscountPolicy existing = getPolicyById(id);
        existing.setDealerId(updatedPolicy.getDealerId());
        existing.setMinQuantity(updatedPolicy.getMinQuantity());
        existing.setDiscountPercent(updatedPolicy.getDiscountPercent());
        existing.setDescription(updatedPolicy.getDescription());
        return discountPolicyRepository.save(existing);
    }

    public void deletePolicy(Long id) {
        if (!discountPolicyRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Policy not found");
        }
        discountPolicyRepository.deleteById(id);
    }
}
