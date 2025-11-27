package com.evdms.evm.controller;

import com.evdms.evm.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/sales-by-staff")
    public List<Map<String, Object>> getSalesByStaff() {
        return reportService.getSalesByStaff();
    }

    @GetMapping("/debt-by-customer")
    public List<Map<String, Object>> getDebtByCustomer() {
        return reportService.getDebtByCustomer();
    }

    @GetMapping("/debt-by-manufacturer")
    public List<Map<String, Object>> getDebtByManufacturer() {
        return reportService.getDebtByManufacturer();
    }
}
