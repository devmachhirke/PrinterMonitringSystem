package com.printermonitoring.service.impl;

import com.printermonitoring.dto.ai.AiPredictionRequest;
import com.printermonitoring.dto.ai.AiPredictionResponse;
import com.printermonitoring.entity.AiPrediction;
import com.printermonitoring.entity.MlModel;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.enums.PredictionType;
import com.printermonitoring.repository.AiPredictionRepository;
import com.printermonitoring.repository.MlModelRepository;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.service.AiPredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AiPredictionServiceImpl implements AiPredictionService {

    private final AiPredictionRepository aiPredictionRepository;
    private final PrinterRepository printerRepository;
    private final MlModelRepository mlModelRepository;

    @Override
    public AiPredictionResponse createPrediction(AiPredictionRequest request) {
        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        MlModel model = null;
        if (request.getModelId() != null) {
            model = mlModelRepository.findById(request.getModelId()).orElse(null);
        }

        AiPrediction prediction = new AiPrediction();
        prediction.setPrinter(printer);
        prediction.setModel(model);
        prediction.setPredictionType(request.getPredictionType());
        prediction.setPredictionValue(request.getPredictionValue());
        prediction.setPredictedDate(request.getPredictedDate());
        prediction.setRiskLevel(request.getRiskLevel());
        prediction.setConfidence(request.getConfidence());
        prediction.setGeneratedAt(LocalDateTime.now());

        AiPrediction saved = aiPredictionRepository.save(prediction);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiPredictionResponse> getPredictionsByPrinter(Long printerId) {
        return aiPredictionRepository.findByPrinterIdOrderByGeneratedAtDesc(printerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiPredictionResponse> getPredictionsByType(PredictionType predictionType) {
        return aiPredictionRepository.findByPredictionType(predictionType)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiPredictionResponse> getAllPredictions() {
        return aiPredictionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AiPredictionResponse getPredictionById(Long id) {
        AiPrediction prediction = aiPredictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AI prediction not found with id: " + id));
        return mapToResponse(prediction);
    }

    @Override
    public void deletePrediction(Long id) {
        if (!aiPredictionRepository.existsById(id)) {
            throw new RuntimeException("AI prediction not found with id: " + id);
        }
        aiPredictionRepository.deleteById(id);
    }

    private AiPredictionResponse mapToResponse(AiPrediction prediction) {
        return AiPredictionResponse.builder()
                .id(prediction.getId())
                .printerId(prediction.getPrinter().getId())
                .printerName(prediction.getPrinter().getName())
                .modelId(prediction.getModel() != null ? prediction.getModel().getId() : null)
                .modelName(prediction.getModel() != null ? prediction.getModel().getModelName() : null)
                .predictionType(prediction.getPredictionType())
                .predictionValue(prediction.getPredictionValue())
                .predictedDate(prediction.getPredictedDate())
                .riskLevel(prediction.getRiskLevel())
                .confidence(prediction.getConfidence())
                .generatedAt(prediction.getGeneratedAt())
                .build();
    }
}
