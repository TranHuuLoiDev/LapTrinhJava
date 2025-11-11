package com.evdms.evm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.evdms")
public class EvmApplication {
    public static void main(String[] args) {
        SpringApplication.run(EvmApplication.class, args);
    }
}
