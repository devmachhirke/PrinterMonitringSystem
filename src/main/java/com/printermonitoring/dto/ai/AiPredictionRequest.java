package com.printermonitoring.dto.ai;

import com.printermonitoring.enums.PredictionType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiPredictionRequest {

    @NotNull(message = "Printer ID is required")
    private Long printerId;

    private Long modelId;

    @NotNull(message = "Prediction type is required")
    private PredictionType predictionType;

    private BigDecimal predictionValue;
    private LocalDateTime predictedDate;
    private String riskLevel;
    private BigDecimal confidence;
}
