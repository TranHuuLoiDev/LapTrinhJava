package com.evdms.evm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.TestDrive;
import com.evdms.evm.repository.TestDriveRepository;

@Service
public class TestDriveService {

    private final TestDriveRepository testDriveRepository;

    public TestDriveService(TestDriveRepository testDriveRepository) {
        this.testDriveRepository = testDriveRepository;
    }

    public List<TestDrive> getAllTestDrives() {
        return testDriveRepository.findAll();
    }

    public TestDrive getTestDriveById(Long id) {
        Optional<TestDrive> testDrive = testDriveRepository.findById(id);
        return testDrive.orElse(null);
    }

    public TestDrive saveTestDrive(TestDrive testDrive) {
        return testDriveRepository.save(testDrive);
    }

    public TestDrive updateTestDrive(Long id, TestDrive updatedTestDrive) {
        return testDriveRepository.findById(id)
                .map(testDrive -> {
                    testDrive.setCustomerId(updatedTestDrive.getCustomerId());
                    testDrive.setVehicleId(updatedTestDrive.getVehicleId());
                    testDrive.setDealerId(updatedTestDrive.getDealerId());
                    testDrive.setPreferredDate(updatedTestDrive.getPreferredDate());
                    testDrive.setPreferredTime(updatedTestDrive.getPreferredTime());
                    testDrive.setStatus(updatedTestDrive.getStatus());
                    testDrive.setNote(updatedTestDrive.getNote());
                    testDrive.setCreatedAt(updatedTestDrive.getCreatedAt());
                    return testDriveRepository.save(testDrive);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "TestDrive not found with id " + id));
    }

    public void deleteTestDrive(Long id) {
        if (!testDriveRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TestDrive not found with id " + id);
        }
        testDriveRepository.deleteById(id);
    }
}
