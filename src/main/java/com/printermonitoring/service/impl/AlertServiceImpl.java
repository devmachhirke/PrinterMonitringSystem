package com.printermonitoring.service.impl;

import com.printermonitoring.dto.alert.AlertRequest;
import com.printermonitoring.dto.alert.AlertResponse;
import com.printermonitoring.entity.Alert;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.enums.AlertSeverity;
import com.printermonitoring.enums.AlertStatus;
import com.printermonitoring.repository.AlertRepository;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final PrinterRepository printerRepository;

    @Override
    public AlertResponse createAlert(AlertRequest request) {
        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        Alert alert = new Alert();
        alert.setPrinter(printer);
        alert.setAlertType(request.getAlertType());
        alert.setSeverity(request.getSeverity());
        alert.setTitle(request.getTitle());
        alert.setMessage(request.getMessage());
        alert.setStatus(request.getStatus() != null ? request.getStatus() : AlertStatus.OPEN);

        Alert saved = alertRepository.save(alert);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertsByPrinter(Long printerId) {
        return alertRepository.findByPrinterIdOrderByCreatedAtDesc(printerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertsByStatus(AlertStatus status) {
        return alertRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertsBySeverity(AlertSeverity severity) {
        return alertRepository.findBySeverity(severity)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AlertResponse getAlertById(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        return mapToResponse(alert);
    }

    @Override
    public AlertResponse resolveAlert(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));

        alert.setStatus(AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        Alert updated = alertRepository.save(alert);
        return mapToResponse(updated);
    }

    @Override
    public void deleteAlert(Long id) {
        if (!alertRepository.existsById(id)) {
            throw new RuntimeException("Alert not found with id: " + id);
        }
        alertRepository.deleteById(id);
    }

    private AlertResponse mapToResponse(Alert alert) {
        return AlertResponse.builder()
                .id(alert.getId())
                .printerId(alert.getPrinter().getId())
                .printerName(alert.getPrinter().getName())
                .alertType(alert.getAlertType())
                .severity(alert.getSeverity())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .status(alert.getStatus())
                .resolvedAt(alert.getResolvedAt())
                .createdAt(alert.getCreatedAt())
                .updatedAt(alert.getUpdatedAt())
                .build();
    }
}
