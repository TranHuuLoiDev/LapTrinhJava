-- Thêm các cột còn thiếu vào bảng promotions
-- Chạy file này trong phpMyAdmin hoặc MySQL client

USE ev_dealer_management_db;

-- Thêm cột promotion_code (Mã khuyến mãi)
ALTER TABLE `promotions` 
ADD COLUMN `promotion_code` VARCHAR(50) UNIQUE AFTER `promotion_name`;

-- Thêm cột discount_type (Loại giảm giá: Percentage hoặc Fixed Amount)
ALTER TABLE `promotions` 
ADD COLUMN `discount_type` VARCHAR(20) AFTER `description`;

-- Cập nhật dữ liệu hiện có với giá trị mặc định
UPDATE `promotions` 
SET 
  `promotion_code` = CONCAT('PROMO', LPAD(promotion_id, 4, '0')),
  `discount_type` = CASE 
    WHEN discount_percentage IS NOT NULL AND discount_percentage > 0 THEN 'Percentage'
    WHEN discount_amount IS NOT NULL AND discount_amount > 0 THEN 'Fixed Amount'
    ELSE 'Percentage'
  END
WHERE `promotion_code` IS NULL OR `discount_type` IS NULL;

-- Kiểm tra kết quả
SELECT 
  promotion_id,
  promotion_name,
  promotion_code,
  discount_type,
  COALESCE(discount_percentage, 0) as discount_percentage,
  COALESCE(discount_amount, 0) as discount_amount,
  start_date,
  end_date,
  is_active
FROM promotions;
