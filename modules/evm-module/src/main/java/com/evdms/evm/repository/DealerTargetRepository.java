package com.evdms.evm.repository;

import com.evdms.evm.model.DealerTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DealerTargetRepository extends JpaRepository<DealerTarget, Long> {
}
