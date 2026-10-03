package com.printermonitoring.dto.ai;

import com.printermonitoring.enums.PredictionType;
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
public class AiPredictionResponse {

    private Long id;
    private Long printerId;
    private String printerName;
    private Long modelId;
    private String modelName;
    private PredictionType predictionType;
    private BigDecimal predictionValue;
    private LocalDateTime predictedDate;
    private String riskLevel;
    private BigDecimal confidence;
    private LocalDateTime generatedAt;
}
