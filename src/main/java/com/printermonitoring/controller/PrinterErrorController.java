package com.printermonitoring.controller;

import com.printermonitoring.dto.error.PrinterErrorRequest;
import com.printermonitoring.dto.error.PrinterErrorResponse;
import com.printermonitoring.enums.ErrorStatus;
import com.printermonitoring.service.PrinterErrorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/printer-errors")
@RequiredArgsConstructor
@Tag(name = "Printer Error Management", description = "APIs for reporting and tracking printer hardware errors")
public class PrinterErrorController {

    private final PrinterErrorService printerErrorService;

    @PostMapping
    @Operation(summary = "Report a printer error")
    public ResponseEntity<PrinterErrorResponse> createError(@Valid @RequestBody PrinterErrorRequest request) {
        PrinterErrorResponse response = printerErrorService.createError(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all printer errors")
    public ResponseEntity<List<PrinterErrorResponse>> getAllErrors() {
        return ResponseEntity.ok(printerErrorService.getAllErrors());
    }

    @GetMapping("/printer/{printerId}")
    @Operation(summary = "Get errors for a specific printer")
    public ResponseEntity<List<PrinterErrorResponse>> getErrorsByPrinter(@PathVariable Long printerId) {
        return ResponseEntity.ok(printerErrorService.getErrorsByPrinter(printerId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get errors filtered by status (OPEN, RESOLVED, IGNORED)")
    public ResponseEntity<List<PrinterErrorResponse>> getErrorsByStatus(@PathVariable ErrorStatus status) {
        return ResponseEntity.ok(printerErrorService.getErrorsByStatus(status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get error details by ID")
    public ResponseEntity<PrinterErrorResponse> getErrorById(@PathVariable Long id) {
        return ResponseEntity.ok(printerErrorService.getErrorById(id));
    }

    @PutMapping("/{id}/resolve")
    @Operation(summary = "Mark a printer error as resolved")
    public ResponseEntity<PrinterErrorResponse> resolveError(@PathVariable Long id) {
        return ResponseEntity.ok(printerErrorService.resolveError(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete printer error record by ID")
    public ResponseEntity<Void> deleteError(@PathVariable Long id) {
        printerErrorService.deleteError(id);
        return ResponseEntity.noContent().build();
    }
}
