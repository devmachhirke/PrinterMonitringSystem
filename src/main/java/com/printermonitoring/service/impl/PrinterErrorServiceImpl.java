package com.printermonitoring.service.impl;

import com.printermonitoring.dto.error.PrinterErrorRequest;
import com.printermonitoring.dto.error.PrinterErrorResponse;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.entity.PrinterError;
import com.printermonitoring.enums.ErrorStatus;
import com.printermonitoring.repository.PrinterErrorRepository;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.service.PrinterErrorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrinterErrorServiceImpl implements PrinterErrorService {

    private final PrinterErrorRepository printerErrorRepository;
    private final PrinterRepository printerRepository;

    @Override
    public PrinterErrorResponse createError(PrinterErrorRequest request) {
        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        PrinterError error = new PrinterError();
        error.setPrinter(printer);
        error.setErrorCode(request.getErrorCode());
        error.setErrorType(request.getErrorType());
        error.setDescription(request.getDescription());
        error.setSeverity(request.getSeverity());
        error.setStatus(request.getStatus() != null ? request.getStatus() : ErrorStatus.OPEN);
        error.setDetectedAt(LocalDateTime.now());

        PrinterError saved = printerErrorRepository.save(error);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrinterErrorResponse> getErrorsByPrinter(Long printerId) {
        return printerErrorRepository.findByPrinterIdOrderByDetectedAtDesc(printerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrinterErrorResponse> getErrorsByStatus(ErrorStatus status) {
        return printerErrorRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrinterErrorResponse> getAllErrors() {
        return printerErrorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PrinterErrorResponse getErrorById(Long id) {
        PrinterError error = printerErrorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer error not found with id: " + id));
        return mapToResponse(error);
    }

    @Override
    public PrinterErrorResponse resolveError(Long id) {
        PrinterError error = printerErrorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer error not found with id: " + id));

        error.setStatus(ErrorStatus.RESOLVED);
        error.setResolvedAt(LocalDateTime.now());
        PrinterError updated = printerErrorRepository.save(error);
        return mapToResponse(updated);
    }

    @Override
    public void deleteError(Long id) {
        if (!printerErrorRepository.existsById(id)) {
            throw new RuntimeException("Printer error not found with id: " + id);
        }
        printerErrorRepository.deleteById(id);
    }

    private PrinterErrorResponse mapToResponse(PrinterError error) {
        return PrinterErrorResponse.builder()
                .id(error.getId())
                .printerId(error.getPrinter().getId())
                .printerName(error.getPrinter().getName())
                .errorCode(error.getErrorCode())
                .errorType(error.getErrorType())
                .description(error.getDescription())
                .severity(error.getSeverity())
                .detectedAt(error.getDetectedAt())
                .resolvedAt(error.getResolvedAt())
                .status(error.getStatus())
                .build();
    }
}
