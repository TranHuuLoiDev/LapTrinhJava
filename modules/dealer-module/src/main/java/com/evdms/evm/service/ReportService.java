package com.evdms.evm.service;

import com.evdms.evm.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    public List<Map<String, Object>> getSalesByStaff() {
        return reportRepository.getSalesByStaff();
    }

    public List<Map<String, Object>> getDebtByCustomer() {
        return reportRepository.getDebtByCustomer();
    }

    public List<Map<String, Object>> getDebtByManufacturer() {
        return reportRepository.getDebtByManufacturer();
    }
}
