package com.printermonitoring.dto.error;

import com.printermonitoring.enums.ErrorSeverity;
import com.printermonitoring.enums.ErrorStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrinterErrorResponse {

    private Long id;
    private Long printerId;
    private String printerName;
    private String errorCode;
    private String errorType;
    private String description;
    private ErrorSeverity severity;
    private LocalDateTime detectedAt;
    private LocalDateTime resolvedAt;
    private ErrorStatus status;
}
