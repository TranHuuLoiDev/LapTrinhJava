package com.evdms.evm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evdms.evm.model.SalesOrder;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    java.util.List<SalesOrder> findByDealerId(Long dealerId);
}
