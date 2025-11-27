package com.evdms.evm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evdms.evm.model.TestDrive;

@Repository
public interface TestDriveRepository extends JpaRepository<TestDrive, Long> {

}
