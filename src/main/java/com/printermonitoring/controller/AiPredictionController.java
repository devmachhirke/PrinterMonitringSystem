package com.printermonitoring.controller;

import com.printermonitoring.dto.ai.AiPredictionRequest;
import com.printermonitoring.dto.ai.AiPredictionResponse;
import com.printermonitoring.enums.PredictionType;
import com.printermonitoring.service.AiPredictionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-predictions")
@RequiredArgsConstructor
@Tag(name = "AI Prediction Management", description = "APIs for managing AI/ML predictive maintenance insights")
public class AiPredictionController {

    private final AiPredictionService aiPredictionService;

    @PostMapping
    @Operation(summary = "Create an AI prediction record")
    public ResponseEntity<AiPredictionResponse> createPrediction(@Valid @RequestBody AiPredictionRequest request) {
        AiPredictionResponse response = aiPredictionService.createPrediction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all AI predictions")
    public ResponseEntity<List<AiPredictionResponse>> getAllPredictions() {
        return ResponseEntity.ok(aiPredictionService.getAllPredictions());
    }

    @GetMapping("/printer/{printerId}")
    @Operation(summary = "Get AI predictions for a specific printer")
    public ResponseEntity<List<AiPredictionResponse>> getPredictionsByPrinter(@PathVariable Long printerId) {
        return ResponseEntity.ok(aiPredictionService.getPredictionsByPrinter(printerId));
    }

    @GetMapping("/type/{predictionType}")
    @Operation(summary = "Get predictions by prediction type")
    public ResponseEntity<List<AiPredictionResponse>> getPredictionsByType(@PathVariable PredictionType predictionType) {
        return ResponseEntity.ok(aiPredictionService.getPredictionsByType(predictionType));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get prediction by ID")
    public ResponseEntity<AiPredictionResponse> getPredictionById(@PathVariable Long id) {
        return ResponseEntity.ok(aiPredictionService.getPredictionById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete AI prediction record by ID")
    public ResponseEntity<Void> deletePrediction(@PathVariable Long id) {
        aiPredictionService.deletePrediction(id);
        return ResponseEntity.noContent().build();
    }
}
