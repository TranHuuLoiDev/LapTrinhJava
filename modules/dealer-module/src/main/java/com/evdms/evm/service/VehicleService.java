package com.evdms.evm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.evdms.evm.model.Vehicle;
import com.evdms.evm.repository.VehicleRepository;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        return vehicle.orElse(null); // hoặc ném exception nếu muốn
    }
}
