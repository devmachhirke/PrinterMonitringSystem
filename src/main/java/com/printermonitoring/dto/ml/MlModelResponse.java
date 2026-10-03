package com.printermonitoring.dto.ml;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MlModelResponse {

    private Long id;
    private String modelName;
    private String modelType;
    private String version;
    private String status;
    private LocalDateTime trainedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
