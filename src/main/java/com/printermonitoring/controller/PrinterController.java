package com.printermonitoring.controller;

import com.printermonitoring.dto.printer.PrinterPingResultResponse;
import com.printermonitoring.dto.printer.PrinterRequest;
import com.printermonitoring.dto.printer.PrinterResponse;
import com.printermonitoring.dto.printer.UsbPrinterInfoResponse;
import com.printermonitoring.service.PrinterMonitoringService;
import com.printermonitoring.service.PrinterService;
import com.printermonitoring.service.UsbPrinterDetectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/printers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Printer Management", description = "APIs for managing smart printers, network monitoring, and USB detection")
public class PrinterController {

    private final PrinterService printerService;
    private final PrinterMonitoringService monitoringService;
    private final UsbPrinterDetectionService usbDetectionService;

    // CREATE
    @PostMapping
    @Operation(summary = "Create a new printer (Network or USB)")
    public ResponseEntity<PrinterResponse> createPrinter(
            @Valid @RequestBody PrinterRequest request) {

        PrinterResponse response = printerService.createPrinter(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL
    @GetMapping
    @Operation(summary = "Get all printers")
    public ResponseEntity<List<PrinterResponse>> getAllPrinters() {

        List<PrinterResponse> printers = printerService.getAllPrinters();

        return ResponseEntity.ok(printers);
    }

    // GET BY ID
    @GetMapping("/{id}")
    @Operation(summary = "Get printer by ID")
    public ResponseEntity<PrinterResponse> getPrinterById(
            @PathVariable Long id) {

        PrinterResponse printer = printerService.getPrinterById(id);

        return ResponseEntity.ok(printer);
    }

    // UPDATE
    @PutMapping("/{id}")
    @Operation(summary = "Update printer details by ID")
    public ResponseEntity<PrinterResponse> updatePrinter(
            @PathVariable Long id,
            @Valid @RequestBody PrinterRequest request) {

        PrinterResponse updatedPrinter = printerService.updatePrinter(id, request);

        return ResponseEntity.ok(updatedPrinter);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete printer by ID")
    public ResponseEntity<Void> deletePrinter(
            @PathVariable Long id) {

        printerService.deletePrinter(id);

        return ResponseEntity.noContent().build();
    }

    // PING / STATUS CHECK PRINTER (Network or USB)
    @RequestMapping(value = "/{id}/ping", method = {RequestMethod.GET, RequestMethod.POST})
    @Operation(summary = "Ping or check status of a printer (Network ICMP/TCP or USB OS status)")
    public ResponseEntity<PrinterPingResultResponse> pingPrinter(@PathVariable Long id) {
        PrinterPingResultResponse result = monitoringService.pingPrinter(id);
        return ResponseEntity.ok(result);
    }


    // POLL ALL PRINTERS (Manual Telemetry Trigger)
    @PostMapping("/poll-all")
    @Operation(summary = "Trigger network ping & USB status poll across all monitored printers")
    public ResponseEntity<List<PrinterPingResultResponse>> pollAllPrinters() {
        List<PrinterPingResultResponse> results = monitoringService.pollAllPrinters();
        return ResponseEntity.ok(results);
    }

    // DETECT CONNECTED USB PRINTERS
    @GetMapping("/detect-usb")
    @Operation(summary = "Automatically scan and detect USB/local printers plugged into the system")
    public ResponseEntity<List<UsbPrinterInfoResponse>> detectUsbPrinters() {
        List<UsbPrinterInfoResponse> localPrinters = usbDetectionService.detectLocalUsbPrinters();
        return ResponseEntity.ok(localPrinters);
    }
}