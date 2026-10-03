package com.printermonitoring.dto.alert;

import com.printermonitoring.enums.AlertSeverity;
import com.printermonitoring.enums.AlertStatus;
import com.printermonitoring.enums.AlertType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {

    private Long id;
    private Long printerId;
    private String printerName;
    private AlertType alertType;
    private AlertSeverity severity;
    private String title;
    private String message;
    private AlertStatus status;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
