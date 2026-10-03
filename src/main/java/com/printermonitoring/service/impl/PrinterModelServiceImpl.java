package com.printermonitoring.service.impl;

import com.printermonitoring.dto.model.PrinterModelRequest;
import com.printermonitoring.dto.model.PrinterModelResponse;
import com.printermonitoring.entity.PrinterModel;
import com.printermonitoring.repository.PrinterModelRepository;
import com.printermonitoring.service.PrinterModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrinterModelServiceImpl implements PrinterModelService {

    private final PrinterModelRepository modelRepository;

    @Override
    public PrinterModelResponse createModel(PrinterModelRequest request) {
        PrinterModel model = new PrinterModel();
        model.setManufacturer(request.getManufacturer());
        model.setModelName(request.getModelName());
        model.setSupportsSnmp(request.getSupportsSnmp() != null ? request.getSupportsSnmp() : true);
        model.setSupportsToner(request.getSupportsToner() != null ? request.getSupportsToner() : true);
        model.setSupportsPageCount(request.getSupportsPageCount() != null ? request.getSupportsPageCount() : true);
        model.setSupportsPaperStatus(request.getSupportsPaperStatus() != null ? request.getSupportsPaperStatus() : true);

        PrinterModel savedModel = modelRepository.save(model);
        return mapToResponse(savedModel);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrinterModelResponse> getAllModels() {
        return modelRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PrinterModelResponse getModelById(Long id) {
        PrinterModel model = modelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer model not found with id: " + id));

        return mapToResponse(model);
    }

    @Override
    public PrinterModelResponse updateModel(Long id, PrinterModelRequest request) {
        PrinterModel model = modelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer model not found with id: " + id));

        model.setManufacturer(request.getManufacturer());
        model.setModelName(request.getModelName());
        if (request.getSupportsSnmp() != null) model.setSupportsSnmp(request.getSupportsSnmp());
        if (request.getSupportsToner() != null) model.setSupportsToner(request.getSupportsToner());
        if (request.getSupportsPageCount() != null) model.setSupportsPageCount(request.getSupportsPageCount());
        if (request.getSupportsPaperStatus() != null) model.setSupportsPaperStatus(request.getSupportsPaperStatus());

        PrinterModel updatedModel = modelRepository.save(model);
        return mapToResponse(updatedModel);
    }

    @Override
    public void deleteModel(Long id) {
        if (!modelRepository.existsById(id)) {
            throw new RuntimeException("Printer model not found with id: " + id);
        }

        modelRepository.deleteById(id);
    }

    private PrinterModelResponse mapToResponse(PrinterModel model) {
        return PrinterModelResponse.builder()
                .id(model.getId())
                .manufacturer(model.getManufacturer())
                .modelName(model.getModelName())
                .supportsSnmp(model.getSupportsSnmp())
                .supportsToner(model.getSupportsToner())
                .supportsPageCount(model.getSupportsPageCount())
                .supportsPaperStatus(model.getSupportsPaperStatus())
                .createdAt(model.getCreatedAt())
                .updatedAt(model.getUpdatedAt())
                .build();
    }
}
