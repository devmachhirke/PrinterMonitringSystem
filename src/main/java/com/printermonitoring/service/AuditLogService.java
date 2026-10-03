package com.printermonitoring.service;

import com.printermonitoring.dto.audit.AuditLogRequest;
import com.printermonitoring.dto.audit.AuditLogResponse;

import java.util.List;

public interface AuditLogService {
    AuditLogResponse logAction(AuditLogRequest request);
    List<AuditLogResponse> getLogsByUser(Long userId);
    List<AuditLogResponse> getLogsByEntity(String entityType, Long entityId);
    List<AuditLogResponse> getAllLogs();
    AuditLogResponse getLogById(Long id);
}
