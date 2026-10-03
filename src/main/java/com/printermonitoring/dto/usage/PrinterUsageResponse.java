package com.printermonitoring.dto.usage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrinterUsageResponse {

    private Long id;
    private Long printerId;
    private String printerName;
    private Long totalPages;
    private Long monochromePages;
    private Long colorPages;
    private LocalDateTime collectedAt;
}
