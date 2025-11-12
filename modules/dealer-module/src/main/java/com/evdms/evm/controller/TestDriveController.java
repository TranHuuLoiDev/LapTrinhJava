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

import com.evdms.evm.model.TestDrive;
import com.evdms.evm.service.TestDriveService;

@RestController
@RequestMapping("/api/testdrives")
public class TestDriveController {

    private final TestDriveService testDriveService;

    public TestDriveController(TestDriveService testDriveService) {
        this.testDriveService = testDriveService;
    }

    // --- GET tất cả test drives ---
    @GetMapping
    public List<TestDrive> getAllTestDrives() {
        return testDriveService.getAllTestDrives();
    }

    // --- GET test drive theo ID ---
    @GetMapping("/{id}")
    public TestDrive getTestDriveById(@PathVariable("id") Long id) {
        return testDriveService.getTestDriveById(id);
    }

    // --- POST: thêm test drive ---
    @PostMapping
    public TestDrive addTestDrive(@RequestBody TestDrive testDrive) {
        return testDriveService.saveTestDrive(testDrive);
    }

    // --- DELETE test drive ---
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTestDrive(@PathVariable("id") Long id) {
        try {
            testDriveService.deleteTestDrive(id);
            return ResponseEntity.ok("TestDrive with ID " + id + " has been deleted");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        }
    }

    // --- PUT: cập nhật test drive ---
    @PutMapping("/{id}")
    public ResponseEntity<TestDrive> updateTestDrive(
            @PathVariable("id") Long id,
            @RequestBody TestDrive updatedTestDrive) {

        try {
            TestDrive testDrive = testDriveService.updateTestDrive(id, updatedTestDrive);
            return ResponseEntity.ok(testDrive);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
