package com.printermonitoring.dto.ml;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MlModelRequest {

    @NotBlank(message = "Model name is required")
    private String modelName;

    @NotBlank(message = "Model type is required")
    private String modelType;

    @NotBlank(message = "Version is required")
    private String version;

    private String status;
    private LocalDateTime trainedAt;
}
