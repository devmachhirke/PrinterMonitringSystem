package com.printermonitoring.controller;

import com.printermonitoring.dto.audit.AuditLogRequest;
import com.printermonitoring.dto.audit.AuditLogResponse;
import com.printermonitoring.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Log Management", description = "APIs for system activity auditing and log tracking")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @PostMapping
    @Operation(summary = "Record an audit log entry")
    public ResponseEntity<AuditLogResponse> logAction(@Valid @RequestBody AuditLogRequest request) {
        AuditLogResponse response = auditLogService.logAction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all audit log entries")
    public ResponseEntity<List<AuditLogResponse>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get audit logs by user ID")
    public ResponseEntity<List<AuditLogResponse>> getLogsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(auditLogService.getLogsByUser(userId));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Get audit logs for a specific entity type and ID")
    public ResponseEntity<List<AuditLogResponse>> getLogsByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        return ResponseEntity.ok(auditLogService.getLogsByEntity(entityType, entityId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get audit log entry by ID")
    public ResponseEntity<AuditLogResponse> getLogById(@PathVariable Long id) {
        return ResponseEntity.ok(auditLogService.getLogById(id));
    }
}
