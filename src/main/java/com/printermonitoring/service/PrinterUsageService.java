package com.printermonitoring.service;

import com.printermonitoring.dto.usage.PrinterUsageRequest;
import com.printermonitoring.dto.usage.PrinterUsageResponse;

import java.util.List;

public interface PrinterUsageService {
    PrinterUsageResponse recordUsage(PrinterUsageRequest request);
    List<PrinterUsageResponse> getUsageByPrinter(Long printerId);
    List<PrinterUsageResponse> getAllUsages();
    PrinterUsageResponse getUsageById(Long id);
    void deleteUsage(Long id);
}
