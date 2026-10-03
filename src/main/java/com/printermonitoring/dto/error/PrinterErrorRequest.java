package com.printermonitoring.dto.error;

import com.printermonitoring.enums.ErrorSeverity;
import com.printermonitoring.enums.ErrorStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrinterErrorRequest {

    @NotNull(message = "Printer ID is required")
    private Long printerId;

    private String errorCode;
    private String errorType;
    private String description;
    private ErrorSeverity severity;
    private ErrorStatus status;
}
