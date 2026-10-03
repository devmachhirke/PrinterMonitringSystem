package com.printermonitoring.service;

import com.printermonitoring.dto.print.PrintJobRequest;
import com.printermonitoring.dto.print.PrintJobResponse;

import java.util.List;

public interface PrintJobService {
    PrintJobResponse submitPrintJob(PrintJobRequest request);
    PrintJobResponse printTestPage(Long printerId, String printedBy);
    List<PrintJobResponse> getAllPrintJobs();
    List<PrintJobResponse> getPrintJobsByPrinter(Long printerId);
    PrintJobResponse getPrintJobById(Long id);
    void cancelPrintJob(Long id);
}
