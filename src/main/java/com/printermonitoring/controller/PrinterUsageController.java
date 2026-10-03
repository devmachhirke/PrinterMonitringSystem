package com.printermonitoring.controller;

import com.printermonitoring.dto.usage.PrinterUsageRequest;
import com.printermonitoring.dto.usage.PrinterUsageResponse;
import com.printermonitoring.service.PrinterUsageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/printer-usages")
@RequiredArgsConstructor
@Tag(name = "Printer Usage Management", description = "APIs for recording page count and print volume statistics")
public class PrinterUsageController {

    private final PrinterUsageService printerUsageService;

    @PostMapping
    @Operation(summary = "Record printer page usage entry")
    public ResponseEntity<PrinterUsageResponse> recordUsage(@Valid @RequestBody PrinterUsageRequest request) {
        PrinterUsageResponse response = printerUsageService.recordUsage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all printer usage entries")
    public ResponseEntity<List<PrinterUsageResponse>> getAllUsages() {
        return ResponseEntity.ok(printerUsageService.getAllUsages());
    }

    @GetMapping("/printer/{printerId}")
    @Operation(summary = "Get usage history for a specific printer")
    public ResponseEntity<List<PrinterUsageResponse>> getUsageByPrinter(@PathVariable Long printerId) {
        return ResponseEntity.ok(printerUsageService.getUsageByPrinter(printerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get usage entry by ID")
    public ResponseEntity<PrinterUsageResponse> getUsageById(@PathVariable Long id) {
        return ResponseEntity.ok(printerUsageService.getUsageById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete printer usage entry by ID")
    public ResponseEntity<Void> deleteUsage(@PathVariable Long id) {
        printerUsageService.deleteUsage(id);
        return ResponseEntity.noContent().build();
    }
}
