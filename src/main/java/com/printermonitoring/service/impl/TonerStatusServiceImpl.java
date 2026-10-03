package com.printermonitoring.service.impl;

import com.printermonitoring.dto.toner.TonerStatusRequest;
import com.printermonitoring.dto.toner.TonerStatusResponse;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.entity.TonerStatus;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.repository.TonerStatusRepository;
import com.printermonitoring.service.TonerStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TonerStatusServiceImpl implements TonerStatusService {

    private final TonerStatusRepository tonerStatusRepository;
    private final PrinterRepository printerRepository;

    @Override
    public TonerStatusResponse recordTonerStatus(TonerStatusRequest request) {
        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        TonerStatus tonerStatus = new TonerStatus();
        tonerStatus.setPrinter(printer);
        tonerStatus.setCartridgeColor(request.getCartridgeColor());
        tonerStatus.setTonerLevel(request.getTonerLevel());
        tonerStatus.setCollectedAt(LocalDateTime.now());

        TonerStatus saved = tonerStatusRepository.save(tonerStatus);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TonerStatusResponse> getTonerStatusesByPrinter(Long printerId) {
        return tonerStatusRepository.findByPrinterIdOrderByCollectedAtDesc(printerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TonerStatusResponse> getAllTonerStatuses() {
        return tonerStatusRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TonerStatusResponse getTonerStatusById(Long id) {
        TonerStatus status = tonerStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Toner status not found with id: " + id));
        return mapToResponse(status);
    }

    @Override
    public void deleteTonerStatus(Long id) {
        if (!tonerStatusRepository.existsById(id)) {
            throw new RuntimeException("Toner status not found with id: " + id);
        }
        tonerStatusRepository.deleteById(id);
    }

    private TonerStatusResponse mapToResponse(TonerStatus status) {
        return TonerStatusResponse.builder()
                .id(status.getId())
                .printerId(status.getPrinter().getId())
                .printerName(status.getPrinter().getName())
                .cartridgeColor(status.getCartridgeColor())
                .tonerLevel(status.getTonerLevel())
                .collectedAt(status.getCollectedAt())
                .build();
    }
}
