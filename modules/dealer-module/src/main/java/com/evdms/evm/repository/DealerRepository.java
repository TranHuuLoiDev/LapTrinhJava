package com.evdms.evm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evdms.evm.model.Dealer;

@Repository
public interface DealerRepository extends JpaRepository<Dealer, Long> {

}
