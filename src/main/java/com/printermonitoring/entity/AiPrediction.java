package com.printermonitoring.entity;

import com.printermonitoring.enums.PredictionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "ai_predictions",
        indexes = {
                @Index(
                        name = "idx_prediction_printer_time",
                        columnList = "printer_id, generated_at"
                )
        }
)
@Getter
@Setter
public class AiPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id")
    private MlModel model;

    @Enumerated(EnumType.STRING)
    @Column(name = "prediction_type", nullable = false, length = 100)
    private PredictionType predictionType;

    @Column(name = "prediction_value", precision = 12, scale = 4)
    private BigDecimal predictionValue;

    @Column(name = "predicted_date")
    private LocalDateTime predictedDate;

    @Column(name = "risk_level", length = 30)
    private String riskLevel;

    @Column(precision = 5, scale = 4)
    private BigDecimal confidence;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;
}