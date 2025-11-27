package com.evdms.evm.repository;

import com.evdms.evm.model.DiscountPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountPolicyRepository extends JpaRepository<DiscountPolicy, Long> {
}
