package com.printermonitoring.repository;

import com.printermonitoring.entity.AiPrediction;
import com.printermonitoring.enums.PredictionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiPredictionRepository extends JpaRepository<AiPrediction, Long> {

    List<AiPrediction> findByPrinterIdOrderByGeneratedAtDesc(Long printerId);

    List<AiPrediction> findByPredictionType(PredictionType predictionType);

    List<AiPrediction> findByRiskLevel(String riskLevel);
}
