package com.evdms.evm.repository;

import com.evdms.evm.model.VehicleSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleSpecificationRepository extends JpaRepository<VehicleSpecification, Long> {
    
    Optional<VehicleSpecification> findByVehicleId(Integer vehicleId);
    
    boolean existsByVehicleId(Integer vehicleId);
}
