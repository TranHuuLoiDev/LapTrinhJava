package com.evdms.evm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evdms.evm.model.DealerPayable;

@Repository
public interface DealerPayableRepository extends JpaRepository<DealerPayable, Long> {

    java.util.List<DealerPayable> findByDealerId(Long dealerId);
}
