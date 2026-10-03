package com.printermonitoring.controller;

import com.printermonitoring.dto.alert.AlertRequest;
import com.printermonitoring.dto.alert.AlertResponse;
import com.printermonitoring.enums.AlertSeverity;
import com.printermonitoring.enums.AlertStatus;
import com.printermonitoring.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@Tag(name = "Alert Management", description = "APIs for managing system and printer alerts")
public class AlertController {

    private final AlertService alertService;

    @PostMapping
    @Operation(summary = "Create an alert")
    public ResponseEntity<AlertResponse> createAlert(@Valid @RequestBody AlertRequest request) {
        AlertResponse response = alertService.createAlert(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all alerts")
    public ResponseEntity<List<AlertResponse>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/printer/{printerId}")
    @Operation(summary = "Get alerts for a specific printer")
    public ResponseEntity<List<AlertResponse>> getAlertsByPrinter(@PathVariable Long printerId) {
        return ResponseEntity.ok(alertService.getAlertsByPrinter(printerId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get alerts filtered by status (OPEN, ACKNOWLEDGED, RESOLVED)")
    public ResponseEntity<List<AlertResponse>> getAlertsByStatus(@PathVariable AlertStatus status) {
        return ResponseEntity.ok(alertService.getAlertsByStatus(status));
    }

    @GetMapping("/severity/{severity}")
    @Operation(summary = "Get alerts filtered by severity (LOW, MEDIUM, HIGH, CRITICAL)")
    public ResponseEntity<List<AlertResponse>> getAlertsBySeverity(@PathVariable AlertSeverity severity) {
        return ResponseEntity.ok(alertService.getAlertsBySeverity(severity));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get alert details by ID")
    public ResponseEntity<AlertResponse> getAlertById(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.getAlertById(id));
    }

    @PutMapping("/{id}/resolve")
    @Operation(summary = "Resolve an alert by ID")
    public ResponseEntity<AlertResponse> resolveAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.resolveAlert(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an alert by ID")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }
}
