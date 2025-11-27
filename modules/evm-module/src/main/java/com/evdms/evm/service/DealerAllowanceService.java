package com.evdms.evm.service;

import com.evdms.evm.model.DealerAllowance;
import com.evdms.evm.repository.DealerAllowanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class DealerAllowanceService {

    private final DealerAllowanceRepository dealerAllowanceRepository;

    public DealerAllowanceService(DealerAllowanceRepository dealerAllowanceRepository) {
        this.dealerAllowanceRepository = dealerAllowanceRepository;
    }
    public List<DealerAllowance> getAllAllowances() {
        return dealerAllowanceRepository.findAll();
    }
    public DealerAllowance getAllowanceById(Long id) throws Exception {
        Optional<DealerAllowance> allowance = dealerAllowanceRepository.findById(id);
        if (allowance.isEmpty()) {
            throw new Exception("Dealer allowance not found!");
        }
        return allowance.get();
    }
    public List<DealerAllowance> getAllowancesByDealer(Long dealerId) {
        return dealerAllowanceRepository.findByDealerIdAndIsActiveTrue(dealerId);
    }
    public List<DealerAllowance> getAllowancesByVehicle(Long vehicleId) {
        return dealerAllowanceRepository.findByVehicleIdAndIsActiveTrue(vehicleId);
    }
    public DealerAllowance getAllowanceByDealerAndVehicle(Long dealerId, Long vehicleId) throws Exception {
        Optional<DealerAllowance> allowance = dealerAllowanceRepository.findByDealerIdAndVehicleIdAndIsActiveTrue(dealerId, vehicleId);
        if (allowance.isEmpty()) {
            throw new Exception("Dealer allowance cho vehicle này not found!");
        }
        return allowance.get();
    }
    public DealerAllowance createAllowance(DealerAllowance allowance) throws Exception {
        if (allowance.getWholesalePrice().compareTo(allowance.getRetailPrice()) >= 0) {
            throw new Exception("Wholesale price must be less than retail price");
        }
        return dealerAllowanceRepository.save(allowance);
    }
    public DealerAllowance updateAllowance(Long id, DealerAllowance allowanceDetails) throws Exception {
        DealerAllowance allowance = getAllowanceById(id);
        
        if (allowanceDetails.getWholesalePrice() != null) {
            allowance.setWholesalePrice(allowanceDetails.getWholesalePrice());
        }
        if (allowanceDetails.getRetailPrice() != null) {
            allowance.setRetailPrice(allowanceDetails.getRetailPrice());
        }
        if (allowanceDetails.getDiscountPercentage() != null) {
            allowance.setDiscountPercentage(allowanceDetails.getDiscountPercentage());
        }
        if (allowanceDetails.getAllowedQuantity() != null) {
            allowance.setAllowedQuantity(allowanceDetails.getAllowedQuantity());
        }
        
        return dealerAllowanceRepository.save(allowance);
    }
    public void deleteAllowance(Long id) throws Exception {
        DealerAllowance allowance = getAllowanceById(id);
        allowance.setIsActive(false);
        dealerAllowanceRepository.save(allowance);
    }
    public List<DealerAllowance> getActiveAllowances() {
        return dealerAllowanceRepository.findByIsActiveTrue();
    }
}
