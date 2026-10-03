package com.printermonitoring.service.impl;

import com.printermonitoring.dto.printer.PrinterRequest;
import com.printermonitoring.dto.printer.PrinterResponse;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.entity.PrinterLocation;
import com.printermonitoring.entity.PrinterModel;
import com.printermonitoring.enums.ConnectionType;
import com.printermonitoring.repository.PrinterLocationRepository;
import com.printermonitoring.repository.PrinterModelRepository;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.service.PrinterService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrinterServiceImpl implements PrinterService {

    private final PrinterRepository printerRepository;
    private final PrinterModelRepository printerModelRepository;
    private final PrinterLocationRepository printerLocationRepository;

    // CREATE
    @Override
    public PrinterResponse createPrinter(PrinterRequest request) {

        PrinterModel printerModel = request.getPrinterModelId() != null
                ? printerModelRepository.findById(request.getPrinterModelId()).orElse(null)
                : null;

        PrinterLocation location = request.getLocationId() != null
                ? printerLocationRepository.findById(request.getLocationId()).orElse(null)
                : null;


        Printer printer = new Printer();
        printer.setName(request.getName());
        printer.setSerialNumber(request.getSerialNumber());
        printer.setIpAddress(request.getIpAddress());
        printer.setMacAddress(request.getMacAddress());
        printer.setConnectionType(request.getConnectionType() != null ? request.getConnectionType() : ConnectionType.NETWORK);
        printer.setUsbPortName(request.getUsbPortName());
        printer.setOsPrinterName(request.getOsPrinterName());

        printer.setPrinterModel(printerModel);
        printer.setLocation(location);

        printer.setMonitoringEnabled(
                request.getMonitoringEnabled() != null ? request.getMonitoringEnabled() : true
        );

        printer.setMonitoringIntervalSeconds(
                request.getMonitoringIntervalSeconds() != null ? request.getMonitoringIntervalSeconds() : 60
        );

        Printer savedPrinter = printerRepository.save(printer);
        return mapToResponse(savedPrinter);
    }

    // GET ALL
    @Override
    @Transactional(readOnly = true)
    public List<PrinterResponse> getAllPrinters() {
        return printerRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // GET BY ID
    @Override
    @Transactional(readOnly = true)
    public PrinterResponse getPrinterById(Long id) {
        Printer printer = printerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + id));

        return mapToResponse(printer);
    }

    // UPDATE
    @Override
    public PrinterResponse updatePrinter(Long id, PrinterRequest request) {
        Printer printer = printerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + id));

        PrinterModel printerModel = printerModelRepository.findById(request.getPrinterModelId())
                .orElseThrow(() -> new RuntimeException("Printer model not found"));

        PrinterLocation location = printerLocationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        printer.setName(request.getName());
        printer.setSerialNumber(request.getSerialNumber());
        printer.setIpAddress(request.getIpAddress());
        printer.setMacAddress(request.getMacAddress());
        if (request.getConnectionType() != null) printer.setConnectionType(request.getConnectionType());
        printer.setUsbPortName(request.getUsbPortName());
        printer.setOsPrinterName(request.getOsPrinterName());

        printer.setPrinterModel(printerModel);
        printer.setLocation(location);
        printer.setMonitoringEnabled(request.getMonitoringEnabled());
        printer.setMonitoringIntervalSeconds(request.getMonitoringIntervalSeconds());

        Printer updatedPrinter = printerRepository.save(printer);
        return mapToResponse(updatedPrinter);
    }

    // DELETE
    @Override
    public void deletePrinter(Long id) {
        if (!printerRepository.existsById(id)) {
            throw new RuntimeException("Printer not found with id: " + id);
        }
        printerRepository.deleteById(id);
    }

    // ENTITY -> RESPONSE DTO
    private PrinterResponse mapToResponse(Printer printer) {
        return PrinterResponse.builder()
                .id(printer.getId())
                .name(printer.getName())
                .serialNumber(printer.getSerialNumber())
                .ipAddress(printer.getIpAddress())
                .macAddress(printer.getMacAddress())
                .connectionType(printer.getConnectionType())
                .usbPortName(printer.getUsbPortName())
                .osPrinterName(printer.getOsPrinterName())
                .printerModelId(printer.getPrinterModel() != null ? printer.getPrinterModel().getId() : null)
                .locationId(printer.getLocation() != null ? printer.getLocation().getId() : null)
                .monitoringEnabled(printer.getMonitoringEnabled())
                .monitoringIntervalSeconds(printer.getMonitoringIntervalSeconds())
                .lastSeenAt(printer.getLastSeenAt())
                .createdAt(printer.getCreatedAt())
                .updatedAt(printer.getUpdatedAt())
                .build();
    }
}