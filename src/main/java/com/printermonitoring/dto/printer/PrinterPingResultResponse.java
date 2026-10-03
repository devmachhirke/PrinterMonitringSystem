package com.printermonitoring.dto.printer;

import com.printermonitoring.enums.PrinterStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PrinterPingResultResponse {

    private Long printerId;

    private String printerName;

    private String ipAddress;

    private PrinterStatus status;

    private Integer responseTimeMs;

    private LocalDateTime checkedAt;

    private String message;
}
