package com.printermonitoring.controller;

import com.printermonitoring.dto.paper.PaperStatusRequest;
import com.printermonitoring.dto.paper.PaperStatusResponse;
import com.printermonitoring.service.PaperStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paper-statuses")
@RequiredArgsConstructor
@Tag(name = "Paper Status Management", description = "APIs for paper tray levels and status telemetry")
public class PaperStatusController {

    private final PaperStatusService paperStatusService;

    @PostMapping
    @Operation(summary = "Record new paper status reading")
    public ResponseEntity<PaperStatusResponse> recordPaperStatus(@Valid @RequestBody PaperStatusRequest request) {
        PaperStatusResponse response = paperStatusService.recordPaperStatus(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all paper status readings")
    public ResponseEntity<List<PaperStatusResponse>> getAllPaperStatuses() {
        return ResponseEntity.ok(paperStatusService.getAllPaperStatuses());
    }

    @GetMapping("/printer/{printerId}")
    @Operation(summary = "Get paper status history for a specific printer")
    public ResponseEntity<List<PaperStatusResponse>> getPaperStatusesByPrinter(@PathVariable Long printerId) {
        return ResponseEntity.ok(paperStatusService.getPaperStatusesByPrinter(printerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get paper status reading by ID")
    public ResponseEntity<PaperStatusResponse> getPaperStatusById(@PathVariable Long id) {
        return ResponseEntity.ok(paperStatusService.getPaperStatusById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete paper status reading by ID")
    public ResponseEntity<Void> deletePaperStatus(@PathVariable Long id) {
        paperStatusService.deletePaperStatus(id);
        return ResponseEntity.noContent().build();
    }
}
