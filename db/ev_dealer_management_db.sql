-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 30, 2025 lúc 09:33 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ev_dealer_management_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`customer_id`, `full_name`, `phone`, `email`, `address`, `date_created`) VALUES
(1, 'Phạm Minh Đức', '0911111111', 'pmd@gmail.com', '10 Hoàng Hoa Thám, Ba Đình, Hà Nội', '2025-11-27 08:47:39'),
(2, 'Hoàng Thị Mai', '0922222222', 'htm@gmail.com', '20 Lê Duẩn, Quận 1, TP.HCM', '2025-11-27 08:47:39'),
(3, 'Võ Văn Nam', '0933333333', 'vvn@gmail.com', '30 Trần Phú, Hải Châu, Đà Nẵng', '2025-11-27 08:47:39'),
(4, 'Ngô Thị Lan', '0944444444', 'ntl@gmail.com', '40 Nguyễn Trãi, Thanh Xuân, Hà Nội', '2025-11-27 08:47:39'),
(5, 'Đặng Văn Hùng', '0955555555', 'dvh@gmail.com', '50 Điện Biên Phủ, Quận 3, TP.HCM', '2025-11-27 08:47:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dealerpayables`
--

CREATE TABLE `dealerpayables` (
  `payable_id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `amount_due` decimal(15,2) NOT NULL,
  `due_date` date NOT NULL,
  `status` enum('Pending','Paid','Overdue') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dealerpayables`
--

INSERT INTO `dealerpayables` (`payable_id`, `dealer_id`, `invoice_number`, `amount_due`, `due_date`, `status`) VALUES
(1, 1, 'INV-2024-001', 2400000000.00, '2024-12-01', 'Pending'),
(2, 2, 'INV-2024-002', 4500000000.00, '2024-12-05', 'Pending'),
(3, 3, 'INV-2024-003', 850000000.00, '2024-12-10', 'Paid'),
(4, 1, 'INV-2024-004', 690000000.00, '2024-12-15', 'Pending');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dealers`
--

CREATE TABLE `dealers` (
  `dealer_id` int(11) NOT NULL,
  `dealer_name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `contract_start_date` date DEFAULT NULL,
  `sales_quota` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dealers`
--

INSERT INTO `dealers` (`dealer_id`, `dealer_name`, `address`, `phone`, `contract_start_date`, `sales_quota`) VALUES
(1, 'Đại lý VinFast Hà Nội', '123 Đường Láng, Đống Đa, Hà Nội', '024-3333-4444', '2024-01-01', 5000000000.00),
(2, 'Đại lý VinFast TP.HCM', '456 Lê Lợi, Quận 1, TP.HCM', '028-3888-9999', '2024-01-01', 8000000000.00),
(3, 'Đại lý VinFast Đà Nẵng', '789 Nguyễn Văn Linh, Đà Nẵng', '0236-3777-8888', '2024-02-01', 3000000000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `feedback_type` varchar(50) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `submission_date` datetime DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'New',
  `handled_by` int(11) DEFAULT NULL,
  `handled_date` datetime DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `feedbacks`
--

INSERT INTO `feedbacks` (`feedback_id`, `customer_id`, `feedback_type`, `subject`, `content`, `rating`, `submission_date`, `status`, `handled_by`, `handled_date`, `resolution_notes`) VALUES
(1, 1, 'Service', 'Đánh giá dịch vụ', 'Dịch vụ tuyệt vời, nhân viên nhiệt tình!', 5, '2025-11-27 15:47:39', 'New', NULL, NULL, NULL),
(2, 2, 'Vehicle', 'Góp ý về xe VF9', 'Xe đẹp, giá hơi cao. Mong có thêm khuyến mãi.', 4, '2025-11-27 15:47:39', 'New', NULL, NULL, NULL),
(3, 3, 'Service', 'Thời gian chờ', 'Thời gian chờ lái thử hơi lâu.', 3, '2025-11-27 15:47:39', 'New', NULL, NULL, NULL),
(4, 4, 'Dealer', 'Đánh giá tư vấn viên', 'Rất hài lòng với tư vấn viên!', 5, '2025-11-27 15:47:39', 'New', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `vin_number` varchar(17) DEFAULT NULL,
  `location` enum('EVM_HQ','Dealer_Lot','In_Transit') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `vehicle_id`, `dealer_id`, `quantity`, `vin_number`, `location`) VALUES
(1, 1, 1, 15, NULL, 'Dealer_Lot'),
(2, 2, 1, 8, NULL, 'Dealer_Lot'),
(3, 3, 1, 20, NULL, 'Dealer_Lot'),
(4, 1, 2, 25, NULL, 'Dealer_Lot'),
(5, 2, 2, 12, NULL, 'Dealer_Lot'),
(6, 4, 2, 5, NULL, 'Dealer_Lot'),
(7, 5, 3, 10, NULL, 'Dealer_Lot');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderitems`
--

CREATE TABLE `orderitems` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(15,2) NOT NULL,
  `discount_amount` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orderitems`
--

INSERT INTO `orderitems` (`order_item_id`, `order_id`, `vehicle_id`, `quantity`, `unit_price`, `discount_amount`) VALUES
(1, 1, 1, 1, 1200000000.00, 0.00),
(2, 2, 2, 1, 1500000000.00, 0.00),
(3, 3, 5, 1, 850000000.00, 0.00),
(4, 4, 3, 1, 690000000.00, 0.00),
(5, 5, 4, 1, 1800000000.00, 0.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quotations`
--

CREATE TABLE `quotations` (
  `quotation_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `quoted_price` decimal(15,2) NOT NULL,
  `discount_amount` decimal(15,2) DEFAULT 0.00,
  `final_price` decimal(15,2) NOT NULL,
  `quotation_date` date NOT NULL,
  `valid_until` date NOT NULL,
  `status` enum('Draft','Sent','Accepted','Rejected','Expired') DEFAULT 'Draft',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `salescontracts`
--

CREATE TABLE `salescontracts` (
  `contract_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `contract_number` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `contract_date` date NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `contract_value` decimal(15,2) NOT NULL,
  `payment_terms` text DEFAULT NULL,
  `warranty_terms` text DEFAULT NULL,
  `status` enum('Draft','Active','Completed','Cancelled') DEFAULT 'Draft',
  `signed_by_customer` tinyint(1) DEFAULT 0,
  `signed_by_dealer` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `salesorders`
--

CREATE TABLE `salesorders` (
  `order_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `customer_id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `salesperson_id` int(11) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('Quotation','Pending','Confirmed','Delivered','Cancelled') NOT NULL,
  `payment_method` enum('Cash','Installment') NOT NULL,
  `delivery_date_expected` date DEFAULT NULL,
  `delivery_date_actual` date DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `salesorders`
--

INSERT INTO `salesorders` (`order_id`, `order_date`, `customer_id`, `dealer_id`, `salesperson_id`, `total_amount`, `status`, `payment_method`, `delivery_date_expected`, `delivery_date_actual`, `staff_id`) VALUES
(1, '2024-10-14 17:00:00', 1, 1, 3, 1200000000.00, 'Delivered', 'Cash', '2024-11-01', NULL, NULL),
(2, '2024-10-31 17:00:00', 2, 2, 4, 1500000000.00, 'Confirmed', 'Installment', '2024-12-01', NULL, NULL),
(3, '2024-11-09 17:00:00', 3, 3, 4, 850000000.00, 'Pending', 'Cash', '2024-12-10', NULL, NULL),
(4, '2024-11-14 17:00:00', 4, 1, 3, 690000000.00, 'Confirmed', 'Installment', '2024-12-15', NULL, NULL),
(5, '2024-11-19 17:00:00', 5, 2, 4, 1800000000.00, 'Quotation', 'Cash', '2025-01-05', NULL, NULL),
(12, '2025-02-24 17:00:00', 2, 1, 4, 533.00, 'Pending', 'Cash', '2025-12-25', '2025-12-20', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `testdrives`
--

CREATE TABLE `testdrives` (
  `test_drive_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `preferred_date` date NOT NULL,
  `preferred_time` time NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `note` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `testdrives`
--

INSERT INTO `testdrives` (`test_drive_id`, `customer_id`, `vehicle_id`, `dealer_id`, `preferred_date`, `preferred_time`, `status`, `note`, `created_at`) VALUES
(1, 1, 1, NULL, '2024-10-10', '10:00:00', 'Completed', 'Khách hàng rất hài lòng với dịch ', NULL),
(2, 2, 2, 2, '2024-10-28', '14:00:00', 'Completed', 'Đã đặt mua sau lái thử', '2025-11-27 15:47:39'),
(3, 3, 5, 3, '2024-11-08', '09:00:00', 'Completed', 'Cần tư vấn thêm về trả góp', '2025-11-27 15:47:39'),
(4, 4, 3, 1, '2024-11-12', '15:30:00', 'Confirmed', '', '2025-11-27 15:47:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('Admin','EVM Staff','Dealer Manager','Dealer Staff') NOT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `full_name`, `role`, `dealer_id`, `is_active`) VALUES
(2, 'evmstaff1', '$2a$12$LQv3c1yqBW/PIe.LIbqEJOIX6sXp.L6U1LLIqN0r3Z4s1CnqKdPXe', 'Nguyễn Văn A', 'EVM Staff', NULL, 1),
(3, 'dealer1manager', '$2a$12$LQv3c1yqBW/PIe.LIbqEJOIX6sXp.L6U1LLIqN0r3Z4s1CnqKdPXe', 'Trần Thị B', 'Dealer Manager', 1, 1),
(4, 'dealer1staff', '$2a$12$LQv3c1yqBW/PIe.LIbqEJOIX6sXp.L6U1LLIqN0r3Z4s1CnqKdPXe', 'Lê Văn C', 'Dealer Staff', 1, 1),
(8, 'admin', '$2a$12$rHQh3EGNVdLw4VLF0BEAEOdqNWz7LRN8mKFE0eqPvLRxLqC6qGhXC', 'Quản trị viên Hệ thống', 'Admin', NULL, 1),
(9, 'evm_staff', '$2a$12$LQv3c1yqBW/PIe.LIbqEJOIX6sXp.L6U1LLIqN0r3Z4s1CnqKdPXe', 'Nhân viên Nhà máy EVM', 'EVM Staff', NULL, 1),
(10, 'dealer_manager', '$2a$12$LQv3c1yqBW/PIe.LIbqEJOIX6sXp.L6U1LLIqN0r3Z4s1CnqKdPXe', 'Quản lý Đại lý', 'Dealer Manager', 1, 1),
(11, 'dealer_staff', '$2a$12$LQv3c1yqBW/PIe.LIbqEJOIX6sXp.L6U1LLIqN0r3Z4s1CnqKdPXe', 'Nhân viên Đại lý', 'Dealer Staff', 1, 1),
(12, 'test1', '$2a$10$ZKUXlIdmxzPLM0BaiRJYDu1M9xyxX0Wx9YViv544Z.lDvAcX1oL0S', 'Test User', 'Dealer Staff', NULL, 1),
(13, 'adminn', '$2a$10$34PJRE9DRpVo2UR4Z2tKferru2bCxuzvKsMtW5Fi4sM4BgyNHXyWq', 'Admin', 'Admin', NULL, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` int(11) NOT NULL,
  `model_name` varchar(100) NOT NULL,
  `version` varchar(50) NOT NULL,
  `color` varchar(30) NOT NULL,
  `base_price` decimal(15,2) NOT NULL,
  `retail_price` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `model_name`, `version`, `color`, `base_price`, `retail_price`, `description`) VALUES
(1, 'VinFast VF8', 'Eco', 'Đen', 1100000000.00, 1200000000.00, 'SUV điện 5+2 chỗ'),
(2, 'VinFast VF9', 'Plus', 'Trắng', 1400000000.00, 1500000000.00, 'SUV điện 7 chỗ cao cấp'),
(3, 'VinFast VF e34', 'Standard', 'Xanh', 650000000.00, 690000000.00, 'SUV điện compact'),
(4, 'Tesla Model 3', 'Long Range', 'Đỏ', 1700000000.00, 1800000000.00, 'Sedan điện cao cấp'),
(5, 'BYD Atto 3', 'Extended', 'Xám', 800000000.00, 850000000.00, 'SUV điện giá tốt');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `dealerpayables`
--
ALTER TABLE `dealerpayables`
  ADD PRIMARY KEY (`payable_id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `dealer_id` (`dealer_id`);

--
-- Chỉ mục cho bảng `dealers`
--
ALTER TABLE `dealers`
  ADD PRIMARY KEY (`dealer_id`);

--
-- Chỉ mục cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `handled_by` (`handled_by`);

--
-- Chỉ mục cho bảng `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD UNIQUE KEY `vin_number` (`vin_number`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `dealer_id` (`dealer_id`);

--
-- Chỉ mục cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- Chỉ mục cho bảng `quotations`
--
ALTER TABLE `quotations`
  ADD PRIMARY KEY (`quotation_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `dealer_id` (`dealer_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Chỉ mục cho bảng `salescontracts`
--
ALTER TABLE `salescontracts`
  ADD PRIMARY KEY (`contract_id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD UNIQUE KEY `contract_number` (`contract_number`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `dealer_id` (`dealer_id`);

--
-- Chỉ mục cho bảng `salesorders`
--
ALTER TABLE `salesorders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `dealer_id` (`dealer_id`),
  ADD KEY `salesperson_id` (`salesperson_id`);

--
-- Chỉ mục cho bảng `testdrives`
--
ALTER TABLE `testdrives`
  ADD PRIMARY KEY (`test_drive_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `dealer_id` (`dealer_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `dealer_id` (`dealer_id`);

--
-- Chỉ mục cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD UNIQUE KEY `uk_vehicle_version_color` (`model_name`,`version`,`color`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `dealerpayables`
--
ALTER TABLE `dealerpayables`
  MODIFY `payable_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `dealers`
--
ALTER TABLE `dealers`
  MODIFY `dealer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `quotations`
--
ALTER TABLE `quotations`
  MODIFY `quotation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `salescontracts`
--
ALTER TABLE `salescontracts`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `salesorders`
--
ALTER TABLE `salesorders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `testdrives`
--
ALTER TABLE `testdrives`
  MODIFY `test_drive_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `dealerpayables`
--
ALTER TABLE `dealerpayables`
  ADD CONSTRAINT `dealerpayables_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`);

--
-- Các ràng buộc cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`handled_by`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`),
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`);

--
-- Các ràng buộc cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `salesorders` (`order_id`),
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`);

--
-- Các ràng buộc cho bảng `quotations`
--
ALTER TABLE `quotations`
  ADD CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `quotations_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`),
  ADD CONSTRAINT `quotations_ibfk_3` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`),
  ADD CONSTRAINT `quotations_ibfk_4` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `salescontracts`
--
ALTER TABLE `salescontracts`
  ADD CONSTRAINT `salescontracts_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `salesorders` (`order_id`),
  ADD CONSTRAINT `salescontracts_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `salescontracts_ibfk_3` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`);

--
-- Các ràng buộc cho bảng `salesorders`
--
ALTER TABLE `salesorders`
  ADD CONSTRAINT `salesorders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `salesorders_ibfk_2` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`),
  ADD CONSTRAINT `salesorders_ibfk_3` FOREIGN KEY (`salesperson_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `testdrives`
--
ALTER TABLE `testdrives`
  ADD CONSTRAINT `testdrives_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `testdrives_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`),
  ADD CONSTRAINT `testdrives_ibfk_3` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`);

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
