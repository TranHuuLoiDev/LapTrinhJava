package com.evdms.evm.service;

import com.evdms.evm.model.DealerTarget;
import com.evdms.evm.repository.DealerTargetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@SuppressWarnings("null")
public class DealerTargetService {
    @Autowired
    private DealerTargetRepository dealerTargetRepository;

    public List<DealerTarget> getAllTargets() {
        return dealerTargetRepository.findAll();
    }

    public DealerTarget getTargetById(Long id) {
        return dealerTargetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Target not found"));
    }

    public DealerTarget saveTarget(DealerTarget target) {
        return dealerTargetRepository.save(target);
    }

    public DealerTarget updateTarget(Long id, DealerTarget updatedTarget) {
        DealerTarget existing = getTargetById(id);
        existing.setDealerId(updatedTarget.getDealerId());
        existing.setTargetYear(updatedTarget.getTargetYear());
        existing.setTargetMonth(updatedTarget.getTargetMonth());
        existing.setTargetAmount(updatedTarget.getTargetAmount());
        existing.setAchievedAmount(updatedTarget.getAchievedAmount());
        return dealerTargetRepository.save(existing);
    }

    public void deleteTarget(Long id) {
        if (!dealerTargetRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Target not found");
        }
        dealerTargetRepository.deleteById(id);
    }
}
