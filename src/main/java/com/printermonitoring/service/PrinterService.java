package com.printermonitoring.service;

import com.printermonitoring.dto.printer.PrinterRequest;
import com.printermonitoring.dto.printer.PrinterResponse;

import java.util.List;

public interface PrinterService {

    PrinterResponse createPrinter(PrinterRequest request);

    List<PrinterResponse> getAllPrinters();

    PrinterResponse getPrinterById(Long id);

    PrinterResponse updatePrinter(Long id, PrinterRequest request);

    void deletePrinter(Long id);
}