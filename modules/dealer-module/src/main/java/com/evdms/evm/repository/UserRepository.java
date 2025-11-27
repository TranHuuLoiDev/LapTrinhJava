package com.evdms.evm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evdms.evm.model.User;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
        boolean existsByUsername(String username);
    
    java.util.List<User> findByRole(String role);
    
    java.util.List<User> findByDealerId(Long dealerId);
}
