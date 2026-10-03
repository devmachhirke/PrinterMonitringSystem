package com.printermonitoring.dto.alert;

import com.printermonitoring.enums.AlertSeverity;
import com.printermonitoring.enums.AlertStatus;
import com.printermonitoring.enums.AlertType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRequest {

    @NotNull(message = "Printer ID is required")
    private Long printerId;

    @NotNull(message = "Alert type is required")
    private AlertType alertType;

    @NotNull(message = "Severity is required")
    private AlertSeverity severity;

    private String title;
    private String message;
    private AlertStatus status;
}
