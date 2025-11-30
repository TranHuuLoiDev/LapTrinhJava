package com.evdms.evm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evdms.evm.model.WholesalePrice;
import com.evdms.evm.service.WholesalePriceService;

@RestController
@RequestMapping("/api/wholesale-prices")
public class WholesalePriceController {
    @Autowired
    private WholesalePriceService wholesalePriceService;

    @GetMapping
    public List<WholesalePrice> getAllPrices() {
        return wholesalePriceService.getAllPrices();
    }

    @GetMapping("/{id}")
    public WholesalePrice getPriceById(@PathVariable Long id) {
        return wholesalePriceService.getPriceById(id);
    }

    @PostMapping
    public WholesalePrice savePrice(@RequestBody WholesalePrice price) {
        return wholesalePriceService.savePrice(price);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WholesalePrice> updatePrice(@PathVariable Long id, @RequestBody WholesalePrice price) {
        return ResponseEntity.ok(wholesalePriceService.updatePrice(id, price));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePrice(@PathVariable Long id) {
        wholesalePriceService.deletePrice(id);
        return ResponseEntity.ok("Price deleted successfully");
    }
}
