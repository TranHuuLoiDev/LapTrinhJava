package com.evdms.evm.service;

import com.evdms.evm.model.DealerContract;
import com.evdms.evm.repository.DealerContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@SuppressWarnings("null")
public class DealerContractService {
    @Autowired
    private DealerContractRepository dealerContractRepository;

    public List<DealerContract> getAllContracts() {
        return dealerContractRepository.findAll();
    }

    public DealerContract getContractById(Long id) {
        return dealerContractRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found"));
    }

    public DealerContract saveContract(DealerContract contract) {
        return dealerContractRepository.save(contract);
    }

    public DealerContract updateContract(Long id, DealerContract updatedContract) {
        DealerContract existing = getContractById(id);
        existing.setDealerId(updatedContract.getDealerId());
        existing.setContractNumber(updatedContract.getContractNumber());
        existing.setStartDate(updatedContract.getStartDate());
        existing.setEndDate(updatedContract.getEndDate());
        existing.setStatus(updatedContract.getStatus());
        existing.setDetails(updatedContract.getDetails());
        return dealerContractRepository.save(existing);
    }

    public void deleteContract(Long id) {
        if (!dealerContractRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found");
        }
        dealerContractRepository.deleteById(id);
    }
}
