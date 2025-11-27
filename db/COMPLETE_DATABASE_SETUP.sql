-- =====================================================
-- ELECTRIC VEHICLE DEALER MANAGEMENT SYSTEM (EVDMS)
-- DATABASE COMPLETE SETUP SCRIPT
-- Ngày tạo: 2025-11-27
-- Phiên bản: 2.0 - Hoàn chỉnh
-- =====================================================
-- Hướng dẫn: Import file này vào phpMyAdmin để tạo database hoàn chỉnh
-- =====================================================

-- Tạo database
DROP DATABASE IF EXISTS ev_dealer_management_db;
CREATE DATABASE ev_dealer_management_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE ev_dealer_management_db;

-- Vô hiệu hóa kiểm tra khóa ngoại tạm thời
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+07:00";

-- =====================================================
-- PHẦN 1: TẠO CÁC BẢNG CƠ BẢN
-- =====================================================

-- 1. Bảng Dealers (Đại lý)
CREATE TABLE Dealers (
    dealer_id INT AUTO_INCREMENT PRIMARY KEY,
    dealer_name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    contract_start_date DATE,
    sales_quota DECIMAL(15, 2) DEFAULT 0.00,
    region VARCHAR(50) COMMENT 'Vùng miền: Miền Bắc, Miền Trung, Miền Nam',
    dealer_tier VARCHAR(20) DEFAULT 'Silver' COMMENT 'Phân hạng: Platinum, Gold, Silver, Bronze',
    credit_limit DECIMAL(15,2) DEFAULT 10000000000.00 COMMENT 'Hạn mức công nợ tối đa (VNĐ)',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái hoạt động của đại lý',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dealer_region (region),
    INDEX idx_dealer_tier (dealer_tier),
    INDEX idx_dealer_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Users (Người dùng)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'EVM Staff', 'Dealer Manager', 'Dealer Staff') NOT NULL,
    dealer_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE SET NULL,
    INDEX idx_user_role (role),
    INDEX idx_user_dealer (dealer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Vehicles (Xe điện)
CREATE TABLE Vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    color VARCHAR(30) NOT NULL,
    base_price DECIMAL(15, 2) NOT NULL,
    retail_price DECIMAL(15, 2) NOT NULL,
    description TEXT,
    manufacturer VARCHAR(100) DEFAULT 'VinFast' COMMENT 'Nhà sản xuất: VinFast, Tesla, BYD, etc.',
    year INT DEFAULT 2025 COMMENT 'Năm sản xuất',
    status VARCHAR(20) DEFAULT 'Active' COMMENT 'Trạng thái: Active, Discontinued, PreOrder',
    is_available BOOLEAN DEFAULT TRUE COMMENT 'Còn kinh doanh hay không',
    UNIQUE KEY uk_vehicle_version_color (model_name, version, color),
    INDEX idx_vehicle_manufacturer (manufacturer),
    INDEX idx_vehicle_status (status),
    INDEX idx_vehicle_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Inventory (Tồn kho)
CREATE TABLE Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    dealer_id INT NULL,
    quantity INT NOT NULL DEFAULT 0,
    vin_number VARCHAR(17) UNIQUE NULL,
    location ENUM('EVM_HQ', 'Dealer_Lot', 'In_Transit') NOT NULL,
    reserved_quantity INT DEFAULT 0 COMMENT 'Số lượng xe đã được đặt cọc',
    available_quantity INT COMMENT 'Số lượng còn có thể bán (quantity - reserved_quantity)',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    INDEX idx_inventory_vehicle (vehicle_id),
    INDEX idx_inventory_dealer (dealer_id),
    INDEX idx_inventory_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Customers (Khách hàng)
CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    address VARCHAR(255),
    customer_type VARCHAR(50) DEFAULT 'Individual' COMMENT 'Loại: Individual (Cá nhân), Corporate (Doanh nghiệp)',
    customer_source VARCHAR(50) DEFAULT 'Walk-in' COMMENT 'Nguồn: Website, Referral, Walk-in, Facebook, Zalo, Phone',
    customer_segment VARCHAR(50) DEFAULT 'Normal' COMMENT 'Phân khúc: VIP, Potential, Normal, Lost',
    tax_code VARCHAR(20) COMMENT 'Mã số thuế (cho khách hàng doanh nghiệp)',
    company_name VARCHAR(200) COMMENT 'Tên công ty (nếu là khách doanh nghiệp)',
    last_contact_date DATETIME COMMENT 'Ngày liên hệ gần nhất',
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_type (customer_type),
    INDEX idx_customer_source (customer_source),
    INDEX idx_customer_segment (customer_segment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng SalesOrders (Đơn hàng bán xe)
CREATE TABLE SalesOrders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id INT NOT NULL,
    dealer_id INT NOT NULL,
    salesperson_id INT NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('Quotation', 'Pending', 'Confirmed', 'Delivered', 'Cancelled') NOT NULL,
    payment_method ENUM('Cash', 'Installment') NOT NULL,
    delivery_date_expected DATE,
    delivery_date_actual DATE NULL,
    deposit_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Số tiền đặt cọc',
    financing_type VARCHAR(50) DEFAULT 'Cash' COMMENT 'Hình thức: Cash, Bank Loan, Leasing, Installment',
    discount_total DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Tổng số tiền chiết khấu',
    notes TEXT COMMENT 'Ghi chú đơn hàng',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE RESTRICT,
    FOREIGN KEY (salesperson_id) REFERENCES Users(user_id) ON DELETE RESTRICT,
    INDEX idx_salesorder_status (status),
    INDEX idx_salesorder_date (order_date),
    INDEX idx_salesorder_customer (customer_id),
    INDEX idx_salesorder_dealer (dealer_id),
    INDEX idx_salesorder_financing (financing_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng OrderItems (Chi tiết đơn hàng)
CREATE TABLE OrderItems (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (order_id) REFERENCES SalesOrders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE RESTRICT,
    INDEX idx_orderitem_order (order_id),
    INDEX idx_orderitem_vehicle (vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng DealerPayables (Công nợ đại lý)
CREATE TABLE DealerPayables (
    payable_id INT AUTO_INCREMENT PRIMARY KEY,
    dealer_id INT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE,
    amount_due DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Pending', 'Paid', 'Overdue') NOT NULL,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    INDEX idx_payable_dealer (dealer_id),
    INDEX idx_payable_status (status),
    INDEX idx_payable_duedate (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bảng TestDrives (Lịch lái thử)
CREATE TABLE TestDrives (
    test_drive_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    dealer_id INT,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE SET NULL,
    INDEX idx_testdrive_customer (customer_id),
    INDEX idx_testdrive_vehicle (vehicle_id),
    INDEX idx_testdrive_date (preferred_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Bảng Feedbacks (Phản hồi khách hàng)
CREATE TABLE Feedbacks (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    feedback_type VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'New',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
    INDEX idx_feedback_customer (customer_id),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_feedback_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHẦN 2: CÁC BẢNG NÂNG CAO (TỪ ENTITY MODELS)
-- =====================================================

-- 11. Promotions (Khuyến mãi)
CREATE TABLE Promotions (
    promotion_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    promotion_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    discount_percentage DOUBLE,
    discount_amount DECIMAL(15,2),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_promotion_dates (start_date, end_date),
    INDEX idx_promotion_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. WholesalePrices (Giá bán sỉ)
CREATE TABLE WholesalePrices (
    price_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    dealer_id INT,
    wholesale_price DECIMAL(15,2) NOT NULL,
    effective_from DATE,
    effective_to DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    INDEX idx_wholesale_vehicle (vehicle_id),
    INDEX idx_wholesale_dealer (dealer_id),
    INDEX idx_wholesale_dates (effective_from, effective_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. DiscountPolicies (Chính sách chiết khấu)
CREATE TABLE DiscountPolicies (
    policy_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dealer_id INT NOT NULL,
    min_quantity INT NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL,
    description VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    INDEX idx_discount_dealer (dealer_id),
    INDEX idx_discount_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. DealerTargets (Chỉ tiêu đại lý)
CREATE TABLE DealerTargets (
    target_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dealer_id INT NOT NULL,
    target_year INT NOT NULL,
    target_month INT NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    achieved_amount DECIMAL(15,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    UNIQUE KEY unique_dealer_month (dealer_id, target_year, target_month),
    INDEX idx_target_period (target_year, target_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. DealerContracts (Hợp đồng đại lý)
CREATE TABLE DealerContracts (
    contract_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dealer_id INT NOT NULL,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    details VARCHAR(1000),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    INDEX idx_contract_dealer (dealer_id),
    INDEX idx_contract_status (status),
    INDEX idx_contract_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. DealerAllowances (Phân bổ giá cho đại lý)
CREATE TABLE DealerAllowances (
    allowance_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dealer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    wholesale_price DECIMAL(15,2) NOT NULL,
    retail_price DECIMAL(15,2) NOT NULL,
    discount_percentage DOUBLE,
    allowed_quantity INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    INDEX idx_allowance_dealer (dealer_id),
    INDEX idx_allowance_vehicle (vehicle_id),
    INDEX idx_allowance_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHẦN 3: CÁC BẢNG BỔ TRỢ
-- =====================================================

-- 17. VehicleSpecifications (Thông số kỹ thuật xe)
CREATE TABLE VehicleSpecifications (
    spec_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    battery_capacity VARCHAR(50),
    range_km INT,
    charging_time VARCHAR(100),
    motor_power VARCHAR(50),
    max_speed INT,
    seats INT,
    trunk_capacity VARCHAR(50),
    ground_clearance VARCHAR(50),
    wheelbase VARCHAR(50),
    length_width_height VARCHAR(100),
    curb_weight VARCHAR(50),
    drive_type VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    UNIQUE KEY unique_vehicle_spec (vehicle_id),
    INDEX idx_spec_range (range_km),
    INDEX idx_spec_seats (seats)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. CustomerFinancing (Tài chính khách hàng)
CREATE TABLE CustomerFinancing (
    financing_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    bank_name VARCHAR(100),
    loan_amount DECIMAL(15,2),
    interest_rate DECIMAL(5,2),
    loan_term_months INT,
    monthly_payment DECIMAL(15,2),
    down_payment DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'Pending',
    application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    approval_date DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES SalesOrders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
    INDEX idx_financing_order (order_id),
    INDEX idx_financing_customer (customer_id),
    INDEX idx_financing_status (status),
    INDEX idx_financing_bank (bank_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. CustomerInteractions (Lịch sử tương tác)
CREATE TABLE CustomerInteractions (
    interaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    user_id INT,
    interaction_type VARCHAR(50) NOT NULL,
    interaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    subject VARCHAR(200),
    notes TEXT,
    next_follow_up DATETIME,
    status VARCHAR(20) DEFAULT 'Completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    INDEX idx_interaction_customer (customer_id),
    INDEX idx_interaction_user (user_id),
    INDEX idx_interaction_date (interaction_date),
    INDEX idx_interaction_type (interaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. InventoryTransactions (Lịch sử giao dịch kho)
CREATE TABLE InventoryTransactions (
    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    inventory_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    dealer_id INT,
    transaction_type ENUM('IN', 'OUT', 'TRANSFER', 'RETURN', 'ADJUSTMENT') NOT NULL,
    quantity INT NOT NULL,
    from_location VARCHAR(50),
    to_location VARCHAR(50),
    reference_type VARCHAR(50),
    reference_id BIGINT,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    performed_by INT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES Inventory(inventory_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES Users(user_id) ON DELETE SET NULL,
    INDEX idx_transaction_inventory (inventory_id),
    INDEX idx_transaction_vehicle (vehicle_id),
    INDEX idx_transaction_dealer (dealer_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_transaction_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. RegionalSales (Doanh số theo vùng)
CREATE TABLE RegionalSales (
    report_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region VARCHAR(50) NOT NULL,
    report_year INT NOT NULL,
    report_month INT NOT NULL,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_units INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_dealers INT DEFAULT 0,
    average_order_value DECIMAL(15,2),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_region_period (region, report_year, report_month),
    INDEX idx_regional_period (report_year, report_month),
    INDEX idx_regional_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. DealerPayments (Lịch sử thanh toán)
CREATE TABLE DealerPayments (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payable_id INT NOT NULL,
    dealer_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount_paid DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    bank_name VARCHAR(100),
    notes TEXT,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payable_id) REFERENCES DealerPayables(payable_id) ON DELETE CASCADE,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE SET NULL,
    INDEX idx_payment_payable (payable_id),
    INDEX idx_payment_dealer (dealer_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_reference (reference_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. VehicleComparisons (So sánh xe)
CREATE TABLE VehicleComparisons (
    comparison_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    vehicle_1_id INT NOT NULL,
    vehicle_2_id INT,
    vehicle_3_id INT,
    comparison_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    result VARCHAR(100),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_1_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_2_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_3_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    INDEX idx_comparison_customer (customer_id),
    INDEX idx_comparison_date (comparison_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. DealerPerformance (Hiệu suất đại lý)
CREATE TABLE DealerPerformance (
    performance_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dealer_id INT NOT NULL,
    report_year INT NOT NULL,
    report_month INT NOT NULL,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_units INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    target_achievement_percent DECIMAL(5,2),
    ranking INT,
    notes TEXT,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id) ON DELETE CASCADE,
    UNIQUE KEY unique_dealer_period (dealer_id, report_year, report_month),
    INDEX idx_performance_period (report_year, report_month),
    INDEX idx_performance_ranking (ranking)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- PHẦN 4: DỮ LIỆU MẪU
-- =====================================================

-- 4.1. Dealers
INSERT INTO Dealers (dealer_name, address, phone, contract_start_date, sales_quota, region, dealer_tier, credit_limit) VALUES
('Đại lý VinFast Hà Nội', '123 Đường Láng, Đống Đa, Hà Nội', '024-3333-4444', '2024-01-01', 5000000000.00, 'Miền Bắc', 'Gold', 15000000000.00),
('Đại lý VinFast TP.HCM', '456 Lê Lợi, Quận 1, TP.HCM', '028-3888-9999', '2024-01-01', 8000000000.00, 'Miền Nam', 'Platinum', 20000000000.00),
('Đại lý VinFast Đà Nẵng', '789 Nguyễn Văn Linh, Đà Nẵng', '0236-3777-8888', '2024-02-01', 3000000000.00, 'Miền Trung', 'Silver', 10000000000.00);

-- 4.2. Users  
INSERT INTO Users (username, password_hash, full_name, role, dealer_id, is_active) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye1hAJcZU.cqBEZo/7LwqNjLHZ8lQm6H2', 'Quản trị viên', 'Admin', NULL, TRUE),
('evmstaff1', '$2a$10$N9qo8uLOickgx2ZMRZoMye1hAJcZU.cqBEZo/7LwqNjLHZ8lQm6H2', 'Nguyễn Văn A', 'EVM Staff', NULL, TRUE),
('dealer1manager', '$2a$10$N9qo8uLOickgx2ZMRZoMye1hAJcZU.cqBEZo/7LwqNjLHZ8lQm6H2', 'Trần Thị B', 'Dealer Manager', 1, TRUE),
('dealer1staff', '$2a$10$N9qo8uLOickgx2ZMRZoMye1hAJcZU.cqBEZo/7LwqNjLHZ8lQm6H2', 'Lê Văn C', 'Dealer Staff', 1, TRUE);
-- Password cho tất cả: admin123

-- 4.3. Vehicles
INSERT INTO Vehicles (model_name, version, color, base_price, retail_price, description, manufacturer, year, status) VALUES
('VinFast VF8', 'Eco', 'Đen', 1100000000.00, 1200000000.00, 'SUV điện 5+2 chỗ', 'VinFast', 2025, 'Active'),
('VinFast VF9', 'Plus', 'Trắng', 1400000000.00, 1500000000.00, 'SUV điện 7 chỗ cao cấp', 'VinFast', 2025, 'Active'),
('VinFast VF e34', 'Standard', 'Xanh', 650000000.00, 690000000.00, 'SUV điện compact', 'VinFast', 2025, 'Active'),
('Tesla Model 3', 'Long Range', 'Đỏ', 1700000000.00, 1800000000.00, 'Sedan điện cao cấp', 'Tesla', 2025, 'Active'),
('BYD Atto 3', 'Extended', 'Xám', 800000000.00, 850000000.00, 'SUV điện giá tốt', 'BYD', 2025, 'Active');

-- 4.4. Inventory
INSERT INTO Inventory (vehicle_id, dealer_id, quantity, location, reserved_quantity, available_quantity) VALUES
(1, 1, 15, 'Dealer_Lot', 2, 13),
(2, 1, 8, 'Dealer_Lot', 1, 7),
(3, 1, 20, 'Dealer_Lot', 3, 17),
(1, 2, 25, 'Dealer_Lot', 5, 20),
(2, 2, 12, 'Dealer_Lot', 2, 10),
(4, 2, 5, 'Dealer_Lot', 1, 4),
(5, 3, 10, 'Dealer_Lot', 0, 10);

-- 4.5. Customers
INSERT INTO Customers (full_name, email, phone, address, customer_type, customer_source, customer_segment) VALUES
('Phạm Minh Đức', 'pmd@gmail.com', '0911111111', '10 Hoàng Hoa Thám, Ba Đình, Hà Nội', 'Individual', 'Website', 'VIP'),
('Hoàng Thị Mai', 'htm@gmail.com', '0922222222', '20 Lê Duẩn, Quận 1, TP.HCM', 'Individual', 'Referral', 'Normal'),
('Võ Văn Nam', 'vvn@gmail.com', '0933333333', '30 Trần Phú, Hải Châu, Đà Nẵng', 'Individual', 'Walk-in', 'Potential'),
('Ngô Thị Lan', 'ntl@gmail.com', '0944444444', '40 Nguyễn Trãi, Thanh Xuân, Hà Nội', 'Individual', 'Facebook', 'Normal'),
('Đặng Văn Hùng', 'dvh@gmail.com', '0955555555', '50 Điện Biên Phủ, Quận 3, TP.HCM', 'Individual', 'Phone', 'Potential');

-- 4.6. SalesOrders
INSERT INTO SalesOrders (order_date, customer_id, dealer_id, salesperson_id, total_amount, status, payment_method, delivery_date_expected, deposit_amount, financing_type) VALUES
('2024-10-15', 1, 1, 3, 1200000000.00, 'Delivered', 'Cash', '2024-11-01', 50000000.00, 'Cash'),
('2024-11-01', 2, 2, 4, 1500000000.00, 'Confirmed', 'Installment', '2024-12-01', 100000000.00, 'Bank Loan'),
('2024-11-10', 3, 3, 4, 850000000.00, 'Pending', 'Cash', '2024-12-10', 30000000.00, 'Cash'),
('2024-11-15', 4, 1, 3, 690000000.00, 'Confirmed', 'Installment', '2024-12-15', 50000000.00, 'Bank Loan'),
('2024-11-20', 5, 2, 4, 1800000000.00, 'Quotation', 'Cash', '2025-01-05', 0.00, 'Cash');

-- 4.7. OrderItems
INSERT INTO OrderItems (order_id, vehicle_id, quantity, unit_price, discount_amount) VALUES
(1, 1, 1, 1200000000.00, 0.00),
(2, 2, 1, 1500000000.00, 0.00),
(3, 5, 1, 850000000.00, 0.00),
(4, 3, 1, 690000000.00, 0.00),
(5, 4, 1, 1800000000.00, 0.00);

-- 4.8. TestDrives
INSERT INTO TestDrives (customer_id, vehicle_id, dealer_id, preferred_date, preferred_time, status, note) VALUES
(1, 1, 1, '2024-10-10', '10:00:00', 'Completed', 'Khách hàng rất hài lòng'),
(2, 2, 2, '2024-10-28', '14:00:00', 'Completed', 'Đã đặt mua sau lái thử'),
(3, 5, 3, '2024-11-08', '09:00:00', 'Completed', 'Cần tư vấn thêm về trả góp'),
(4, 3, 1, '2024-11-12', '15:30:00', 'Confirmed', ''),
(5, 4, 2, '2024-11-25', '11:00:00', 'Pending', 'Khách VIP, cần chuẩn bị kỹ');

-- 4.9. Feedbacks
INSERT INTO Feedbacks (customer_id, feedback_type, subject, content, rating, status) VALUES
(1, 'Service', 'Đánh giá dịch vụ', 'Dịch vụ tuyệt vời, nhân viên nhiệt tình!', 5, 'New'),
(2, 'Vehicle', 'Góp ý về xe VF9', 'Xe đẹp, giá hơi cao. Mong có thêm khuyến mãi.', 4, 'In Progress'),
(3, 'Service', 'Thời gian chờ', 'Thời gian chờ lái thử hơi lâu.', 3, 'New'),
(4, 'Dealer', 'Đánh giá tư vấn viên', 'Rất hài lòng với tư vấn viên!', 5, 'Resolved');

-- 4.10. DealerPayables
INSERT INTO DealerPayables (dealer_id, invoice_number, amount_due, due_date, status) VALUES
(1, 'INV-2024-001', 2400000000.00, '2024-12-01', 'Pending'),
(2, 'INV-2024-002', 4500000000.00, '2024-12-05', 'Pending'),
(3, 'INV-2024-003', 850000000.00, '2024-12-10', 'Paid'),
(1, 'INV-2024-004', 690000000.00, '2024-12-15', 'Pending');

-- 4.11. Promotions
INSERT INTO Promotions (promotion_name, description, discount_percentage, discount_amount, start_date, end_date, is_active) VALUES
('Khuyến mãi Tết 2025', 'Giảm giá mạnh dịp Tết Nguyên Đán', 10.00, NULL, '2025-01-01 00:00:00', '2025-02-15 23:59:59', TRUE),
('Giảm giá mùa hè', 'Ưu đãi đặc biệt tháng 6-7', 5.00, NULL, '2025-06-01 00:00:00', '2025-07-31 23:59:59', TRUE),
('Trợ giá 50 triệu', 'Hỗ trợ 50 triệu cho khách mua xe VF8', NULL, 50000000.00, '2025-03-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- 4.12. WholesalePrices
INSERT INTO WholesalePrices (vehicle_id, dealer_id, wholesale_price, effective_from, effective_to) VALUES
(1, 1, 1050000000.00, '2025-01-01', '2025-12-31'),
(1, 2, 1040000000.00, '2025-01-01', '2025-12-31'),
(2, 1, 1350000000.00, '2025-01-01', '2025-12-31'),
(2, 2, 1340000000.00, '2025-01-01', '2025-12-31'),
(3, 1, 630000000.00, '2025-01-01', '2025-12-31'),
(3, 3, 635000000.00, '2025-01-01', '2025-12-31');

-- 4.13. DiscountPolicies
INSERT INTO DiscountPolicies (dealer_id, min_quantity, discount_percent, description, is_active) VALUES
(1, 5, 2.00, 'Chiết khấu 2% khi mua từ 5 xe trở lên', TRUE),
(1, 10, 3.50, 'Chiết khấu 3.5% khi mua từ 10 xe trở lên', TRUE),
(2, 5, 2.50, 'Chiết khấu 2.5% khi mua từ 5 xe trở lên', TRUE),
(2, 15, 5.00, 'Chiết khấu 5% khi mua từ 15 xe trở lên', TRUE);

-- 4.14. DealerTargets
INSERT INTO DealerTargets (dealer_id, target_year, target_month, target_amount, achieved_amount) VALUES
(1, 2025, 1, 5000000000.00, 4200000000.00),
(1, 2025, 2, 5000000000.00, 3800000000.00),
(1, 2025, 3, 5500000000.00, 0.00),
(2, 2025, 1, 8000000000.00, 7500000000.00),
(2, 2025, 2, 8000000000.00, 6800000000.00),
(2, 2025, 3, 8500000000.00, 0.00),
(3, 2025, 1, 3000000000.00, 2100000000.00),
(3, 2025, 2, 3000000000.00, 0.00);

-- 4.15. DealerContracts
INSERT INTO DealerContracts (dealer_id, contract_number, start_date, end_date, status, details) VALUES
(1, 'CONTRACT-HN-2024-001', '2024-01-01', '2026-12-31', 'Active', 'Hợp đồng đại lý 3 năm - Khu vực Hà Nội'),
(2, 'CONTRACT-HCM-2024-001', '2024-01-01', '2026-12-31', 'Active', 'Hợp đồng đại lý 3 năm - Khu vực TP.HCM'),
(3, 'CONTRACT-DN-2024-002', '2024-02-01', '2026-01-31', 'Active', 'Hợp đồng đại lý 2 năm - Khu vực Đà Nẵng');

-- 4.16. DealerAllowances
INSERT INTO DealerAllowances (dealer_id, vehicle_id, wholesale_price, retail_price, discount_percentage, allowed_quantity, is_active) VALUES
(1, 1, 1050000000.00, 1200000000.00, 2.00, 20, TRUE),
(1, 2, 1350000000.00, 1500000000.00, 2.00, 15, TRUE),
(1, 3, 630000000.00, 690000000.00, 1.50, 30, TRUE),
(2, 1, 1040000000.00, 1200000000.00, 2.50, 30, TRUE),
(2, 2, 1340000000.00, 1500000000.00, 2.50, 20, TRUE),
(2, 4, 1600000000.00, 1800000000.00, 3.00, 10, TRUE);

-- 4.17. VehicleSpecifications
INSERT INTO VehicleSpecifications (vehicle_id, battery_capacity, range_km, charging_time, motor_power, max_speed, seats, trunk_capacity, ground_clearance, wheelbase, length_width_height, curb_weight, drive_type) VALUES
(1, '87.7 kWh', 420, '7h (AC 11kW) / 31 phút (DC 150kW)', '260 kW / 350 hp', 200, 7, '376L - 1373L', '175mm', '2950mm', '4750 x 1934 x 1667', '2100 kg', 'AWD'),
(2, '123 kWh', 594, '10h (AC 11kW) / 35 phút (DC 150kW)', '300 kW / 402 hp', 200, 7, '423L - 1610L', '198mm', '3050mm', '5123 x 1976 x 1750', '2450 kg', 'AWD'),
(3, '42 kWh', 285, '5h (AC 11kW) / 24 phút (DC 100kW)', '110 kW / 147 hp', 160, 5, '374L', '175mm', '2611mm', '4300 x 1793 x 1613', '1650 kg', 'FWD'),
(4, '60 kWh', 491, '8h (AC 11kW) / 27 phút (DC 170kW)', '208 kW / 283 hp', 233, 5, '682L', '140mm', '2875mm', '4720 x 1850 x 1443', '1844 kg', 'RWD'),
(5, '60.48 kWh', 420, '6.5h (AC 11kW) / 30 phút (DC 88kW)', '150 kW / 204 hp', 160, 5, '440L', '175mm', '2720mm', '4455 x 1875 x 1615', '1750 kg', 'FWD');

-- 4.18. CustomerFinancing
INSERT INTO CustomerFinancing (order_id, customer_id, bank_name, loan_amount, interest_rate, loan_term_months, monthly_payment, down_payment, status, approval_date) VALUES
(2, 2, 'Vietcombank', 1050000000.00, 8.50, 60, 21500000.00, 450000000.00, 'Approved', '2024-11-05'),
(4, 4, 'BIDV', 483000000.00, 9.00, 48, 12100000.00, 207000000.00, 'Approved', '2024-11-18');

-- 4.19. CustomerInteractions
INSERT INTO CustomerInteractions (customer_id, user_id, interaction_type, interaction_date, subject, notes, next_follow_up, status) VALUES
(1, 3, 'Call', '2024-10-05 10:30:00', 'Tư vấn xe VF8', 'Khách hàng quan tâm đến VF8, hỏi về pin và thời gian sạc', '2024-10-12 10:00:00', 'Completed'),
(1, 3, 'Meeting', '2024-10-10 14:00:00', 'Lái thử VF8', 'Khách đã lái thử và rất thích. Đặt cọc ngay sau đó.', NULL, 'Completed'),
(2, 4, 'Email', '2024-10-25 09:00:00', 'Gửi báo giá VF9', 'Đã gửi báo giá chi tiết qua email', '2024-11-01 10:00:00', 'Completed'),
(3, 4, 'Call', '2024-11-07 11:00:00', 'Theo dõi sau lái thử', 'Khách cần thêm thời gian suy nghĩ về giá', '2024-11-20 14:00:00', 'Scheduled'),
(5, 4, 'Chat', '2024-11-19 16:30:00', 'Hỏi về Tesla Model 3', 'Tư vấn về cấu hình và giá, khách quan tâm nhiều', '2024-11-26 10:00:00', 'Scheduled');

-- 4.20. InventoryTransactions
INSERT INTO InventoryTransactions (inventory_id, vehicle_id, dealer_id, transaction_type, quantity, from_location, to_location, reference_type, reference_id, transaction_date, performed_by, notes) VALUES
(1, 1, 1, 'IN', 20, 'EVM_HQ', 'Dealer_Lot', 'Purchase', NULL, '2024-09-01 08:00:00', 2, 'Nhập kho 20 xe VF8 từ hãng'),
(1, 1, 1, 'OUT', 1, 'Dealer_Lot', NULL, 'SalesOrder', 1, '2024-10-15 15:30:00', 3, 'Xuất kho giao xe cho đơn hàng #1'),
(3, 3, 1, 'IN', 25, 'EVM_HQ', 'Dealer_Lot', 'Purchase', NULL, '2024-09-15 09:00:00', 2, 'Nhập kho 25 xe VF e34'),
(3, 3, 1, 'OUT', 1, 'Dealer_Lot', NULL, 'SalesOrder', 4, '2024-11-15 16:00:00', 3, 'Xuất kho giao xe cho đơn hàng #4'),
(4, 1, 2, 'IN', 30, 'EVM_HQ', 'Dealer_Lot', 'Purchase', NULL, '2024-09-05 10:00:00', 2, 'Nhập kho 30 xe VF8 cho đại lý HCM');

-- 4.21. DealerPayments
INSERT INTO DealerPayments (payable_id, dealer_id, payment_date, amount_paid, payment_method, reference_number, bank_name, notes, created_by) VALUES
(3, 3, '2024-12-08', 850000000.00, 'Chuyển khoản', 'TXN-2024-1208-001', 'Vietcombank', 'Thanh toán đầy đủ công nợ tháng 11', 2),
(1, 1, '2024-11-15', 1000000000.00, 'Chuyển khoản', 'TXN-2024-1115-001', 'ACB', 'Thanh toán một phần công nợ', 2),
(2, 2, '2024-11-20', 2000000000.00, 'Chuyển khoản', 'TXN-2024-1120-001', 'Techcombank', 'Thanh toán một phần công nợ', 2);

-- 4.22. VehicleComparisons
INSERT INTO VehicleComparisons (customer_id, vehicle_1_id, vehicle_2_id, vehicle_3_id, comparison_date, notes, result) VALUES
(1, 1, 3, NULL, '2024-10-08 14:00:00', 'So sánh VF8 và VF e34, quan tâm đến khoảng cách di chuyển', 'Đã chọn VF8'),
(2, 2, 1, 4, '2024-10-26 11:00:00', 'So sánh VF9, VF8 và Tesla Model 3', 'Đã chọn VF9'),
(5, 4, 1, 2, '2024-11-19 10:30:00', 'So sánh Tesla Model 3 với các dòng VinFast', 'Chưa quyết định');

-- =====================================================
-- KẾT THÚC SETUP DATABASE
-- =====================================================

SELECT '✓ DATABASE SETUP HOÀN TẤT!' AS Status;
SELECT '24 bảng đã được tạo' AS Tables_Created;
SELECT 'Dữ liệu mẫu đã được thêm' AS Sample_Data;
SELECT 'Sẵn sàng cho Features 2-4' AS Next_Steps;
