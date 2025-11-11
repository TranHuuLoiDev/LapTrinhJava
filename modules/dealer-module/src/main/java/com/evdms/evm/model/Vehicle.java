    package com.evdms.evm.model;

    import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

    @Entity
    @Table(name = "vehicles")
    public class Vehicle {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String model;

        private String version;
        private String color;
        private Double price;

        @Column(length = 1000)
        private String description;

        // --- Constructors ---
        public Vehicle() {}

        public Vehicle(String model, String version, String color, Double price, String description) {
            this.model = model;
            this.version = version;
            this.color = color;
            this.price = price;
            this.description = description;
        }

        // --- Getters & Setters ---
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
