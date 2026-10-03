package com.printermonitoring.controller;

import com.printermonitoring.dto.maintenance.MaintenanceRecordRequest;
import com.printermonitoring.dto.maintenance.MaintenanceRecordResponse;
import com.printermonitoring.service.MaintenanceRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-records")
@RequiredArgsConstructor
@Tag(name = "Maintenance Record Management", description = "APIs for logging technician servicing and repair activities")
public class MaintenanceRecordController {

    private final MaintenanceRecordService maintenanceRecordService;

    @PostMapping
    @Operation(summary = "Create a maintenance record")
    public ResponseEntity<MaintenanceRecordResponse> createMaintenanceRecord(@Valid @RequestBody MaintenanceRecordRequest request) {
        MaintenanceRecordResponse response = maintenanceRecordService.createMaintenanceRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all maintenance records")
    public ResponseEntity<List<MaintenanceRecordResponse>> getAllMaintenanceRecords() {
        return ResponseEntity.ok(maintenanceRecordService.getAllMaintenanceRecords());
    }

    @GetMapping("/printer/{printerId}")
    @Operation(summary = "Get maintenance records for a specific printer")
    public ResponseEntity<List<MaintenanceRecordResponse>> getRecordsByPrinter(@PathVariable Long printerId) {
        return ResponseEntity.ok(maintenanceRecordService.getRecordsByPrinter(printerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get maintenance record by ID")
    public ResponseEntity<MaintenanceRecordResponse> getMaintenanceRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceRecordService.getMaintenanceRecordById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update maintenance record by ID")
    public ResponseEntity<MaintenanceRecordResponse> updateMaintenanceRecord(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceRecordRequest request) {
        return ResponseEntity.ok(maintenanceRecordService.updateMaintenanceRecord(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete maintenance record by ID")
    public ResponseEntity<Void> deleteMaintenanceRecord(@PathVariable Long id) {
        maintenanceRecordService.deleteMaintenanceRecord(id);
        return ResponseEntity.noContent().build();
    }
}
