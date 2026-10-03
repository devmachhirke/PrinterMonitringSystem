package com.printermonitoring.service;

import com.printermonitoring.dto.ml.MlModelRequest;
import com.printermonitoring.dto.ml.MlModelResponse;

import java.util.List;

public interface MlModelService {
    MlModelResponse registerModel(MlModelRequest request);
    List<MlModelResponse> getAllModels();
    MlModelResponse getModelById(Long id);
    MlModelResponse updateModel(Long id, MlModelRequest request);
    void deleteModel(Long id);
}
