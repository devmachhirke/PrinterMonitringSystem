package com.printermonitoring.service;

import com.printermonitoring.dto.model.PrinterModelRequest;
import com.printermonitoring.dto.model.PrinterModelResponse;

import java.util.List;

public interface PrinterModelService {

    PrinterModelResponse createModel(PrinterModelRequest request);

    List<PrinterModelResponse> getAllModels();

    PrinterModelResponse getModelById(Long id);

    PrinterModelResponse updateModel(Long id, PrinterModelRequest request);

    void deleteModel(Long id);
}
