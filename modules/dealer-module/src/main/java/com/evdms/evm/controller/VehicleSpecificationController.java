package com.evdms.evm.controller;

import com.evdms.evm.model.VehicleSpecification;
import com.evdms.evm.service.VehicleSpecificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicle-specifications")
@CrossOrigin(origins = "*")
public class VehicleSpecificationController {
    
    @Autowired
    private VehicleSpecificationService vehicleSpecificationService;
    
    @GetMapping
    public ResponseEntity<List<VehicleSpecification>> getAllSpecifications() {
        List<VehicleSpecification> specifications = vehicleSpecificationService.getAllSpecifications();
        return ResponseEntity.ok(specifications);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VehicleSpecification> getSpecificationById(@PathVariable Long id) {
        Optional<VehicleSpecification> specification = vehicleSpecificationService.getSpecificationById(id);
        return specification.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<VehicleSpecification> getSpecificationByVehicleId(@PathVariable Integer vehicleId) {
        Optional<VehicleSpecification> specification = vehicleSpecificationService.getSpecificationByVehicleId(vehicleId);
        return specification.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<VehicleSpecification> createSpecification(@RequestBody VehicleSpecification specification) {
        VehicleSpecification created = vehicleSpecificationService.createSpecification(specification);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<VehicleSpecification> updateSpecification(
            @PathVariable Long id,
            @RequestBody VehicleSpecification specification) {
        try {
            VehicleSpecification updated = vehicleSpecificationService.updateSpecification(id, specification);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecification(@PathVariable Long id) {
        vehicleSpecificationService.deleteSpecification(id);
        return ResponseEntity.noContent().build();
    }
}
