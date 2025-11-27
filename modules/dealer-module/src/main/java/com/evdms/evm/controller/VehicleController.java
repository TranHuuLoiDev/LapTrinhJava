package com.evdms.evm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.Vehicle;
import com.evdms.evm.service.VehicleService;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable("id") Long id) {
        return vehicleService.getVehicleById(id);
    }

    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
    return vehicleService.saveVehicle(vehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable("id") Long id) {
    try {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok("Vehicle with ID " + id + " has been deleted");
    } catch (ResponseStatusException e) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
    }
    }

    @PutMapping("/{id}")
        public ResponseEntity<Vehicle> updateVehicle(
        @PathVariable("id") Long id,
        @RequestBody Vehicle updatedVehicle) {

    try {
        Vehicle vehicle = vehicleService.updateVehicle(id, updatedVehicle);
        return ResponseEntity.ok(vehicle);
    } catch (ResponseStatusException e) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    }
    
}
