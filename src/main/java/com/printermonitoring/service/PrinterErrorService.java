package com.printermonitoring.service;

import com.printermonitoring.dto.error.PrinterErrorRequest;
import com.printermonitoring.dto.error.PrinterErrorResponse;
import com.printermonitoring.enums.ErrorStatus;

import java.util.List;

public interface PrinterErrorService {
    PrinterErrorResponse createError(PrinterErrorRequest request);
    List<PrinterErrorResponse> getErrorsByPrinter(Long printerId);
    List<PrinterErrorResponse> getErrorsByStatus(ErrorStatus status);
    List<PrinterErrorResponse> getAllErrors();
    PrinterErrorResponse getErrorById(Long id);
    PrinterErrorResponse resolveError(Long id);
    void deleteError(Long id);
}
