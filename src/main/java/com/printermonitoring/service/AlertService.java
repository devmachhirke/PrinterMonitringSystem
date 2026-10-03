package com.printermonitoring.service;

import com.printermonitoring.dto.alert.AlertRequest;
import com.printermonitoring.dto.alert.AlertResponse;
import com.printermonitoring.enums.AlertSeverity;
import com.printermonitoring.enums.AlertStatus;

import java.util.List;

public interface AlertService {
    AlertResponse createAlert(AlertRequest request);
    List<AlertResponse> getAlertsByPrinter(Long printerId);
    List<AlertResponse> getAlertsByStatus(AlertStatus status);
    List<AlertResponse> getAlertsBySeverity(AlertSeverity severity);
    List<AlertResponse> getAllAlerts();
    AlertResponse getAlertById(Long id);
    AlertResponse resolveAlert(Long id);
    void deleteAlert(Long id);
}
