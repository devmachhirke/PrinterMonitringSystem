package com.printermonitoring.service.impl;

import com.printermonitoring.dto.usage.PrinterUsageRequest;
import com.printermonitoring.dto.usage.PrinterUsageResponse;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.entity.PrinterUsage;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.repository.PrinterUsageRepository;
import com.printermonitoring.service.PrinterUsageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrinterUsageServiceImpl implements PrinterUsageService {

    private final PrinterUsageRepository printerUsageRepository;
    private final PrinterRepository printerRepository;

    @Override
    public PrinterUsageResponse recordUsage(PrinterUsageRequest request) {
        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        PrinterUsage usage = new PrinterUsage();
        usage.setPrinter(printer);
        usage.setTotalPages(request.getTotalPages());
        usage.setMonochromePages(request.getMonochromePages());
        usage.setColorPages(request.getColorPages());
        usage.setCollectedAt(LocalDateTime.now());

        PrinterUsage saved = printerUsageRepository.save(usage);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrinterUsageResponse> getUsageByPrinter(Long printerId) {
        return printerUsageRepository.findByPrinterIdOrderByCollectedAtDesc(printerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrinterUsageResponse> getAllUsages() {
        return printerUsageRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PrinterUsageResponse getUsageById(Long id) {
        PrinterUsage usage = printerUsageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer usage record not found with id: " + id));
        return mapToResponse(usage);
    }

    @Override
    public void deleteUsage(Long id) {
        if (!printerUsageRepository.existsById(id)) {
            throw new RuntimeException("Printer usage record not found with id: " + id);
        }
        printerUsageRepository.deleteById(id);
    }

    private PrinterUsageResponse mapToResponse(PrinterUsage usage) {
        return PrinterUsageResponse.builder()
                .id(usage.getId())
                .printerId(usage.getPrinter().getId())
                .printerName(usage.getPrinter().getName())
                .totalPages(usage.getTotalPages())
                .monochromePages(usage.getMonochromePages())
                .colorPages(usage.getColorPages())
                .collectedAt(usage.getCollectedAt())
                .build();
    }
}
