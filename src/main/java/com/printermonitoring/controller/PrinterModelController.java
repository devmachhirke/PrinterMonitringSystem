package com.printermonitoring.controller;

import com.printermonitoring.dto.model.PrinterModelRequest;
import com.printermonitoring.dto.model.PrinterModelResponse;
import com.printermonitoring.service.PrinterModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/printer-models")
@RequiredArgsConstructor
@Tag(name = "Printer Model Management", description = "APIs for managing printer hardware models and specs")
public class PrinterModelController {

    private final PrinterModelService modelService;

    // CREATE MODEL
    @PostMapping
    @Operation(summary = "Create a new printer model")
    public ResponseEntity<PrinterModelResponse> createModel(@Valid @RequestBody PrinterModelRequest request) {
        PrinterModelResponse response = modelService.createModel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET ALL MODELS
    @GetMapping
    @Operation(summary = "Get all printer models")
    public ResponseEntity<List<PrinterModelResponse>> getAllModels() {
        List<PrinterModelResponse> models = modelService.getAllModels();
        return ResponseEntity.ok(models);
    }

    // GET MODEL BY ID
    @GetMapping("/{id}")
    @Operation(summary = "Get printer model by ID")
    public ResponseEntity<PrinterModelResponse> getModelById(@PathVariable Long id) {
        PrinterModelResponse model = modelService.getModelById(id);
        return ResponseEntity.ok(model);
    }

    // UPDATE MODEL
    @PutMapping("/{id}")
    @Operation(summary = "Update printer model by ID")
    public ResponseEntity<PrinterModelResponse> updateModel(
            @PathVariable Long id,
            @Valid @RequestBody PrinterModelRequest request) {
        PrinterModelResponse updatedModel = modelService.updateModel(id, request);
        return ResponseEntity.ok(updatedModel);
    }

    // DELETE MODEL
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete printer model by ID")
    public ResponseEntity<Void> deleteModel(@PathVariable Long id) {
        modelService.deleteModel(id);
        return ResponseEntity.noContent().build();
    }
}
