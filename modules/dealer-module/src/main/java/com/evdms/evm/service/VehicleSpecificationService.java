package com.evdms.evm.service;

import com.evdms.evm.model.VehicleSpecification;
import com.evdms.evm.repository.VehicleSpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class VehicleSpecificationService {
    
    @Autowired
    private VehicleSpecificationRepository vehicleSpecificationRepository;
    
    public List<VehicleSpecification> getAllSpecifications() {
        return vehicleSpecificationRepository.findAll();
    }
    
    public Optional<VehicleSpecification> getSpecificationById(Long id) {
        return vehicleSpecificationRepository.findById(id);
    }
    
    public Optional<VehicleSpecification> getSpecificationByVehicleId(Integer vehicleId) {
        return vehicleSpecificationRepository.findByVehicleId(vehicleId);
    }
    
    public VehicleSpecification createSpecification(VehicleSpecification specification) {
        return vehicleSpecificationRepository.save(specification);
    }
    
    public VehicleSpecification updateSpecification(Long id, VehicleSpecification specification) {
        if (vehicleSpecificationRepository.existsById(id)) {
            specification.setSpecId(id);
            return vehicleSpecificationRepository.save(specification);
        }
        throw new RuntimeException("Specification not found with id: " + id);
    }
    
    public void deleteSpecification(Long id) {
        vehicleSpecificationRepository.deleteById(id);
    }
}
