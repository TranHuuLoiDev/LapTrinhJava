package com.evdms.evm.dto;

import com.evdms.evm.model.Promotion;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public class PromotionDTO {
    private Long promotionId;
    private String promotionName;
    private String promotionCode;
    private String description;
    private String discountType;
    private Double discountValue; // Giá trị hiển thị (% hoặc số tiền)
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;

    public PromotionDTO() {}

    // Convert từ Promotion entity sang DTO
    public static PromotionDTO fromEntity(Promotion promotion) {
        PromotionDTO dto = new PromotionDTO();
        dto.setPromotionId(promotion.getPromotionId());
        dto.setPromotionName(promotion.getPromotionName());
        dto.setPromotionCode(promotion.getPromotionCode());
        dto.setDescription(promotion.getDescription());
        dto.setDiscountType(promotion.getDiscountType());
        dto.setStartDate(promotion.getStartDate());
        dto.setEndDate(promotion.getEndDate());
        dto.setIsActive(promotion.getIsActive());

        // Tính discountValue dựa trên discountType
        if ("Percentage".equals(promotion.getDiscountType()) && promotion.getDiscountPercentage() != null) {
            dto.setDiscountValue(promotion.getDiscountPercentage());
        } else if ("Fixed Amount".equals(promotion.getDiscountType()) && promotion.getDiscountAmount() != null) {
            dto.setDiscountValue(promotion.getDiscountAmount().doubleValue());
        } else {
            // Fallback: ưu tiên percentage nếu có
            if (promotion.getDiscountPercentage() != null && promotion.getDiscountPercentage() > 0) {
                dto.setDiscountValue(promotion.getDiscountPercentage());
            } else if (promotion.getDiscountAmount() != null && promotion.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
                dto.setDiscountValue(promotion.getDiscountAmount().doubleValue());
            } else {
                dto.setDiscountValue(0.0);
            }
        }

        return dto;
    }

    // Getters and Setters
    public Long getPromotionId() { return promotionId; }
    public void setPromotionId(Long promotionId) { this.promotionId = promotionId; }

    public String getPromotionName() { return promotionName; }
    public void setPromotionName(String promotionName) { this.promotionName = promotionName; }

    public String getPromotionCode() { return promotionCode; }
    public void setPromotionCode(String promotionCode) { this.promotionCode = promotionCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
