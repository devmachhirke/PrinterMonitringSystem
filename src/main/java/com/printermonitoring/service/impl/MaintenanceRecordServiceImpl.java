package com.printermonitoring.service.impl;

import com.printermonitoring.dto.maintenance.MaintenanceRecordRequest;
import com.printermonitoring.dto.maintenance.MaintenanceRecordResponse;
import com.printermonitoring.entity.MaintenanceRecord;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.entity.User;
import com.printermonitoring.repository.MaintenanceRecordRepository;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.repository.UserRepository;
import com.printermonitoring.service.MaintenanceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceRecordServiceImpl implements MaintenanceRecordService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final PrinterRepository printerRepository;
    private final UserRepository userRepository;

    @Override
    public MaintenanceRecordResponse createMaintenanceRecord(MaintenanceRecordRequest request) {
        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        User performedBy = null;
        if (request.getPerformedById() != null) {
            performedBy = userRepository.findById(request.getPerformedById())
                    .orElse(null);
        }

        MaintenanceRecord record = new MaintenanceRecord();
        record.setPrinter(printer);
        record.setMaintenanceType(request.getMaintenanceType());
        record.setDescription(request.getDescription());
        record.setPerformedBy(performedBy);
        record.setMaintenanceDate(request.getMaintenanceDate());
        record.setNextDueDate(request.getNextDueDate());

        MaintenanceRecord saved = maintenanceRecordRepository.save(record);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRecordResponse> getRecordsByPrinter(Long printerId) {
        return maintenanceRecordRepository.findByPrinterIdOrderByMaintenanceDateDesc(printerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRecordResponse> getAllMaintenanceRecords() {
        return maintenanceRecordRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceRecordResponse getMaintenanceRecordById(Long id) {
        MaintenanceRecord record = maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance record not found with id: " + id));
        return mapToResponse(record);
    }

    @Override
    public MaintenanceRecordResponse updateMaintenanceRecord(Long id, MaintenanceRecordRequest request) {
        MaintenanceRecord record = maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance record not found with id: " + id));

        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        User performedBy = null;
        if (request.getPerformedById() != null) {
            performedBy = userRepository.findById(request.getPerformedById()).orElse(null);
        }

        record.setPrinter(printer);
        record.setMaintenanceType(request.getMaintenanceType());
        record.setDescription(request.getDescription());
        record.setPerformedBy(performedBy);
        record.setMaintenanceDate(request.getMaintenanceDate());
        record.setNextDueDate(request.getNextDueDate());

        MaintenanceRecord updated = maintenanceRecordRepository.save(record);
        return mapToResponse(updated);
    }

    @Override
    public void deleteMaintenanceRecord(Long id) {
        if (!maintenanceRecordRepository.existsById(id)) {
            throw new RuntimeException("Maintenance record not found with id: " + id);
        }
        maintenanceRecordRepository.deleteById(id);
    }

    private MaintenanceRecordResponse mapToResponse(MaintenanceRecord record) {
        return MaintenanceRecordResponse.builder()
                .id(record.getId())
                .printerId(record.getPrinter().getId())
                .printerName(record.getPrinter().getName())
                .maintenanceType(record.getMaintenanceType())
                .description(record.getDescription())
                .performedById(record.getPerformedBy() != null ? record.getPerformedBy().getId() : null)
                .performedByName(record.getPerformedBy() != null ? record.getPerformedBy().getUsername() : null)
                .maintenanceDate(record.getMaintenanceDate())
                .nextDueDate(record.getNextDueDate())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}
