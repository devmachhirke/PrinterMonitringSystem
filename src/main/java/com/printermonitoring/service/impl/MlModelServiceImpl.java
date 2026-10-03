package com.printermonitoring.service.impl;

import com.printermonitoring.dto.ml.MlModelRequest;
import com.printermonitoring.dto.ml.MlModelResponse;
import com.printermonitoring.entity.MlModel;
import com.printermonitoring.repository.MlModelRepository;
import com.printermonitoring.service.MlModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MlModelServiceImpl implements MlModelService {

    private final MlModelRepository mlModelRepository;

    @Override
    public MlModelResponse registerModel(MlModelRequest request) {
        MlModel model = new MlModel();
        model.setModelName(request.getModelName());
        model.setModelType(request.getModelType());
        model.setVersion(request.getVersion());
        model.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        model.setTrainedAt(request.getTrainedAt());

        MlModel saved = mlModelRepository.save(model);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MlModelResponse> getAllModels() {
        return mlModelRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MlModelResponse getModelById(Long id) {
        MlModel model = mlModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ML model not found with id: " + id));
        return mapToResponse(model);
    }

    @Override
    public MlModelResponse updateModel(Long id, MlModelRequest request) {
        MlModel model = mlModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ML model not found with id: " + id));

        model.setModelName(request.getModelName());
        model.setModelType(request.getModelType());
        model.setVersion(request.getVersion());
        if (request.getStatus() != null) model.setStatus(request.getStatus());
        if (request.getTrainedAt() != null) model.setTrainedAt(request.getTrainedAt());

        MlModel updated = mlModelRepository.save(model);
        return mapToResponse(updated);
    }

    @Override
    public void deleteModel(Long id) {
        if (!mlModelRepository.existsById(id)) {
            throw new RuntimeException("ML model not found with id: " + id);
        }
        mlModelRepository.deleteById(id);
    }

    private MlModelResponse mapToResponse(MlModel model) {
        return MlModelResponse.builder()
                .id(model.getId())
                .modelName(model.getModelName())
                .modelType(model.getModelType())
                .version(model.getVersion())
                .status(model.getStatus())
                .trainedAt(model.getTrainedAt())
                .createdAt(model.getCreatedAt())
                .updatedAt(model.getUpdatedAt())
                .build();
    }
}
