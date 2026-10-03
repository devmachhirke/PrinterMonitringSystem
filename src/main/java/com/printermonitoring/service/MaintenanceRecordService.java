package com.printermonitoring.service;

import com.printermonitoring.dto.maintenance.MaintenanceRecordRequest;
import com.printermonitoring.dto.maintenance.MaintenanceRecordResponse;

import java.util.List;

public interface MaintenanceRecordService {
    MaintenanceRecordResponse createMaintenanceRecord(MaintenanceRecordRequest request);
    List<MaintenanceRecordResponse> getRecordsByPrinter(Long printerId);
    List<MaintenanceRecordResponse> getAllMaintenanceRecords();
    MaintenanceRecordResponse getMaintenanceRecordById(Long id);
    MaintenanceRecordResponse updateMaintenanceRecord(Long id, MaintenanceRecordRequest request);
    void deleteMaintenanceRecord(Long id);
}
