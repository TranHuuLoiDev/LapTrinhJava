package com.evdms.evm.repository;

import com.evdms.evm.model.DealerContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DealerContractRepository extends JpaRepository<DealerContract, Long> {
}
