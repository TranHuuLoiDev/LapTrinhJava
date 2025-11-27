package com.evdms.evm.controller;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class DealerWebController {

    @GetMapping({"/", "/dealer", "/dealer/dashboard"})
    public String dashboard(Model model) {
        model.addAttribute("title", "Dashboard");
        return "dealer/dashboard";
    }

    @GetMapping("/dealer/vehicles")
    public String vehicles(Model model) {
        model.addAttribute("title", "Vehicles");
        return "dealer/vehicles";
    }

    @GetMapping("/dealer/customers")
    public String customers(Model model) {
        model.addAttribute("title", "Customers");
        return "dealer/customers";
    }

    @GetMapping("/dealer/salesorders")
    public String salesorders(Model model) {
        model.addAttribute("title", "Sales Orders");
        return "dealer/salesorders";
    }

    @GetMapping("/dealer/salesorders/{id}")
    public String salesOrderDetail(@PathVariable Long id, Model model) {
        model.addAttribute("title", "Order Detail");
        model.addAttribute("orderId", id);
        return "dealer/salesorder-detail";
    }

    @GetMapping("/dealer/testdrives")
    public String testdrives(Model model) {
        model.addAttribute("title", "Test Drives");
        return "dealer/testdrives";
    }

    @GetMapping("/dealer/feedbacks")
    public String feedbacks(Model model) {
        model.addAttribute("title", "Feedbacks");
        return "dealer/feedbacks";
    }

    @GetMapping("/dealer/reports")
    public String reports(Model model) {
        model.addAttribute("title", "Reports");
        return "dealer/reports";
    }
}
