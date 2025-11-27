package com.evdms.evm.service;

import com.evdms.evm.model.Promotion;
import com.evdms.evm.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }
    public Promotion getPromotionById(Long id) throws Exception {
        Optional<Promotion> promotion = promotionRepository.findById(id);
        if (promotion.isEmpty()) {
            throw new Exception("Promotion not found!");
        }
        return promotion.get();
    }
    public List<Promotion> getActivePromotions() {
        return promotionRepository.findByIsActiveTrueOrderByStartDateDesc();
    }
    public List<Promotion> getEffectivePromotions() {
        LocalDateTime now = LocalDateTime.now();
        return promotionRepository.findByIsActiveTrueAndStartDateBeforeAndEndDateAfter(now, now);
    }
    public List<Promotion> searchPromotions(String name) {
        return promotionRepository.findByPromotionNameContainingIgnoreCase(name);
    }
    public Promotion createPromotion(Promotion promotion) throws Exception {
        if (promotion.getStartDate().isAfter(promotion.getEndDate())) {
            throw new Exception("Start date must be before end date");
        }
        return promotionRepository.save(promotion);
    }
    public Promotion updatePromotion(Long id, Promotion promotionDetails) throws Exception {
        Promotion promotion = getPromotionById(id);
        
        if (promotionDetails.getPromotionName() != null) {
            promotion.setPromotionName(promotionDetails.getPromotionName());
        }
        if (promotionDetails.getDescription() != null) {
            promotion.setDescription(promotionDetails.getDescription());
        }
        if (promotionDetails.getDiscountPercentage() != null) {
            promotion.setDiscountPercentage(promotionDetails.getDiscountPercentage());
        }
        if (promotionDetails.getDiscountAmount() != null) {
            promotion.setDiscountAmount(promotionDetails.getDiscountAmount());
        }
        if (promotionDetails.getStartDate() != null) {
            promotion.setStartDate(promotionDetails.getStartDate());
        }
        if (promotionDetails.getEndDate() != null) {
            promotion.setEndDate(promotionDetails.getEndDate());
        }
        if (promotionDetails.getIsActive() != null) {
            promotion.setIsActive(promotionDetails.getIsActive());
        }
        
        return promotionRepository.save(promotion);
    }
    public void deletePromotion(Long id) throws Exception {
        Promotion promotion = getPromotionById(id);
        promotion.setIsActive(false);
        promotionRepository.save(promotion);
    }
    public Promotion togglePromotion(Long id) throws Exception {
        Promotion promotion = getPromotionById(id);
        promotion.setIsActive(!promotion.getIsActive());
        return promotionRepository.save(promotion);
    }
}
