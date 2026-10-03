package com.printermonitoring.service;

import com.printermonitoring.dto.printer.PrinterPingResultResponse;

import java.util.List;

public interface PrinterMonitoringService {

    PrinterPingResultResponse pingPrinter(Long printerId);

    List<PrinterPingResultResponse> pollAllPrinters();
}
