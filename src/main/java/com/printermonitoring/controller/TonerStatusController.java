package com.printermonitoring.controller;

import com.printermonitoring.dto.toner.TonerStatusRequest;
import com.printermonitoring.dto.toner.TonerStatusResponse;
import com.printermonitoring.service.TonerStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/toner-statuses")
@RequiredArgsConstructor
@Tag(name = "Toner Status Management", description = "APIs for tracking toner levels and cartridge telemetry")
public class TonerStatusController {

    private final TonerStatusService tonerStatusService;

    @PostMapping
    @Operation(summary = "Record new toner status reading")
    public ResponseEntity<TonerStatusResponse> recordTonerStatus(@Valid @RequestBody TonerStatusRequest request) {
        TonerStatusResponse response = tonerStatusService.recordTonerStatus(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all toner status readings")
    public ResponseEntity<List<TonerStatusResponse>> getAllTonerStatuses() {
        return ResponseEntity.ok(tonerStatusService.getAllTonerStatuses());
    }

    @GetMapping("/printer/{printerId}")
    @Operation(summary = "Get toner status history for a specific printer")
    public ResponseEntity<List<TonerStatusResponse>> getTonerStatusesByPrinter(@PathVariable Long printerId) {
        return ResponseEntity.ok(tonerStatusService.getTonerStatusesByPrinter(printerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get toner status reading by ID")
    public ResponseEntity<TonerStatusResponse> getTonerStatusById(@PathVariable Long id) {
        return ResponseEntity.ok(tonerStatusService.getTonerStatusById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete toner status reading by ID")
    public ResponseEntity<Void> deleteTonerStatus(@PathVariable Long id) {
        tonerStatusService.deleteTonerStatus(id);
        return ResponseEntity.noContent().build();
    }
}
