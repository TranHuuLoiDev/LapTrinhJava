package com.evdms.evm.service;

import com.evdms.evm.model.WholesalePrice;
import com.evdms.evm.repository.WholesalePriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@SuppressWarnings("null")
public class WholesalePriceService {
    @Autowired
    private WholesalePriceRepository wholesalePriceRepository;

    public List<WholesalePrice> getAllPrices() {
        return wholesalePriceRepository.findAll();
    }

    public WholesalePrice getPriceById(Long id) {
        return wholesalePriceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Price not found"));
    }

    public WholesalePrice savePrice(WholesalePrice price) {
        return wholesalePriceRepository.save(price);
    }

    public WholesalePrice updatePrice(Long id, WholesalePrice updatedPrice) {
        WholesalePrice existing = getPriceById(id);
        existing.setVehicleId(updatedPrice.getVehicleId());
        existing.setDealerId(updatedPrice.getDealerId());
        existing.setWholesalePrice(updatedPrice.getWholesalePrice());
        existing.setEffectiveFrom(updatedPrice.getEffectiveFrom());
        existing.setEffectiveTo(updatedPrice.getEffectiveTo());
        return wholesalePriceRepository.save(existing);
    }

    public void deletePrice(Long id) {
        if (!wholesalePriceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Price not found");
        }
        wholesalePriceRepository.deleteById(id);
    }
}
