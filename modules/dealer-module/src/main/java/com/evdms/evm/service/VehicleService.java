package com.evdms.evm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    @SuppressWarnings("null")
    public Vehicle getVehicleById(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        return vehicle.orElse(null); // hoặc ném exception nếu muốn
    }

    @SuppressWarnings("null")
    public Vehicle saveVehicle(Vehicle vehicle) {
    return vehicleRepository.save(vehicle);
    }

    @SuppressWarnings("null")
    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
    return vehicleRepository.findById(id)
        .map(vehicle -> {
            vehicle.setModelName(updatedVehicle.getModelName());
            vehicle.setColor(updatedVehicle.getColor());
            vehicle.setPrice(updatedVehicle.getPrice());
            vehicle.setBasePrice(updatedVehicle.getBasePrice());
            vehicle.setRetailPrice(updatedVehicle.getRetailPrice());
            vehicle.setDescription(updatedVehicle.getDescription());
            vehicle.setModel(updatedVehicle.getModel());
            return vehicleRepository.save(vehicle);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found with id " + id));

    }

    @SuppressWarnings("null")
    public void deleteVehicle(Long id) {
    if (!vehicleRepository.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found with id " + id);
    }
    vehicleRepository.deleteById(id);
    }



}
