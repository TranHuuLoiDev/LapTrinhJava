package com.evdms.evm.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.DealerPayable;
import com.evdms.evm.repository.DealerPayableRepository;

@Service
public class DealerPayableService {

    private final DealerPayableRepository dealerPayableRepository;

    public DealerPayableService(DealerPayableRepository dealerPayableRepository) {
        this.dealerPayableRepository = dealerPayableRepository;
    }

    public List<DealerPayable> getAllDealerPayables() {
        return dealerPayableRepository.findAll();
    }

    public DealerPayable getDealerPayableById(Long id) {
        return dealerPayableRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "DealerPayable not found with id " + id));
    }

    public DealerPayable saveDealerPayable(DealerPayable dealerPayable) {
        return dealerPayableRepository.save(dealerPayable);
    }

    public DealerPayable updateDealerPayable(Long id, DealerPayable updatedPayable) {
        return dealerPayableRepository.findById(id)
                .map(payable -> {
                    payable.setDealerId(updatedPayable.getDealerId());
                    payable.setInvoiceNumber(updatedPayable.getInvoiceNumber());
                    payable.setAmountDue(updatedPayable.getAmountDue());
                    payable.setDueDate(updatedPayable.getDueDate());
                    payable.setStatus(updatedPayable.getStatus());
                    return dealerPayableRepository.save(payable);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "DealerPayable not found with id " + id));
    }

    public void deleteDealerPayable(Long id) {
        if (!dealerPayableRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DealerPayable not found with id " + id);
        }
        dealerPayableRepository.deleteById(id);
    }
}
