package com.printermonitoring.service.impl;

import com.printermonitoring.dto.paper.PaperStatusRequest;
import com.printermonitoring.dto.paper.PaperStatusResponse;
import com.printermonitoring.entity.PaperStatus;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.repository.PaperStatusRepository;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.service.PaperStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaperStatusServiceImpl implements PaperStatusService {

    private final PaperStatusRepository paperStatusRepository;
    private final PrinterRepository printerRepository;

    @Override
    public PaperStatusResponse recordPaperStatus(PaperStatusRequest request) {
        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        PaperStatus paperStatus = new PaperStatus();
        paperStatus.setPrinter(printer);
        paperStatus.setTrayNumber(request.getTrayNumber());
        paperStatus.setPaperLevel(request.getPaperLevel());
        paperStatus.setPaperStatus(request.getPaperStatus());
        paperStatus.setCollectedAt(LocalDateTime.now());

        PaperStatus saved = paperStatusRepository.save(paperStatus);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaperStatusResponse> getPaperStatusesByPrinter(Long printerId) {
        return paperStatusRepository.findByPrinterIdOrderByCollectedAtDesc(printerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaperStatusResponse> getAllPaperStatuses() {
        return paperStatusRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaperStatusResponse getPaperStatusById(Long id) {
        PaperStatus status = paperStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper status not found with id: " + id));
        return mapToResponse(status);
    }

    @Override
    public void deletePaperStatus(Long id) {
        if (!paperStatusRepository.existsById(id)) {
            throw new RuntimeException("Paper status not found with id: " + id);
        }
        paperStatusRepository.deleteById(id);
    }

    private PaperStatusResponse mapToResponse(PaperStatus status) {
        return PaperStatusResponse.builder()
                .id(status.getId())
                .printerId(status.getPrinter().getId())
                .printerName(status.getPrinter().getName())
                .trayNumber(status.getTrayNumber())
                .paperLevel(status.getPaperLevel())
                .paperStatus(status.getPaperStatus())
                .collectedAt(status.getCollectedAt())
                .build();
    }
}
