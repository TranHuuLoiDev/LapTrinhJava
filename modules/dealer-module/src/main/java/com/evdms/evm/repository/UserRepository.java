package com.evdms.evm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evdms.evm.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // JpaRepository đã có sẵn các hàm CRUD cơ bản
}
