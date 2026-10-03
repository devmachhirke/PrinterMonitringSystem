package com.printermonitoring.service;

import com.printermonitoring.dto.ai.AiPredictionRequest;
import com.printermonitoring.dto.ai.AiPredictionResponse;
import com.printermonitoring.enums.PredictionType;

import java.util.List;

public interface AiPredictionService {
    AiPredictionResponse createPrediction(AiPredictionRequest request);
    List<AiPredictionResponse> getPredictionsByPrinter(Long printerId);
    List<AiPredictionResponse> getPredictionsByType(PredictionType predictionType);
    List<AiPredictionResponse> getAllPredictions();
    AiPredictionResponse getPredictionById(Long id);
    void deletePrediction(Long id);
}
