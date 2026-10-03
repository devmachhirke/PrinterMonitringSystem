package com.printermonitoring.controller;

import com.printermonitoring.dto.ml.MlModelRequest;
import com.printermonitoring.dto.ml.MlModelResponse;
import com.printermonitoring.service.MlModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ml-models")
@RequiredArgsConstructor
@Tag(name = "ML Model Management", description = "APIs for registering and tracking machine learning models")
public class MlModelController {

    private final MlModelService mlModelService;

    @PostMapping
    @Operation(summary = "Register a new ML model")
    public ResponseEntity<MlModelResponse> registerModel(@Valid @RequestBody MlModelRequest request) {
        MlModelResponse response = mlModelService.registerModel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all ML models")
    public ResponseEntity<List<MlModelResponse>> getAllModels() {
        return ResponseEntity.ok(mlModelService.getAllModels());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get ML model details by ID")
    public ResponseEntity<MlModelResponse> getModelById(@PathVariable Long id) {
        return ResponseEntity.ok(mlModelService.getModelById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update ML model metadata by ID")
    public ResponseEntity<MlModelResponse> updateModel(
            @PathVariable Long id,
            @Valid @RequestBody MlModelRequest request) {
        return ResponseEntity.ok(mlModelService.updateModel(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete ML model record by ID")
    public ResponseEntity<Void> deleteModel(@PathVariable Long id) {
        mlModelService.deleteModel(id);
        return ResponseEntity.noContent().build();
    }
}
