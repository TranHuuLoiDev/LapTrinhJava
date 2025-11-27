package com.evdms.evm.repository;

import com.evdms.evm.model.DealerAllowance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DealerAllowanceRepository extends JpaRepository<DealerAllowance, Long> {
    
    List<DealerAllowance> findByDealerIdAndIsActiveTrue(Long dealerId);
    
    List<DealerAllowance> findByVehicleIdAndIsActiveTrue(Long vehicleId);
    
    Optional<DealerAllowance> findByDealerIdAndVehicleIdAndIsActiveTrue(Long dealerId, Long vehicleId);
    
    List<DealerAllowance> findByIsActiveTrue();
}
