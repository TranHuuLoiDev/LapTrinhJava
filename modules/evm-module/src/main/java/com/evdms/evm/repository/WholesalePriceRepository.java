package com.evdms.evm.repository;

import com.evdms.evm.model.WholesalePrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WholesalePriceRepository extends JpaRepository<WholesalePrice, Long> {
}
