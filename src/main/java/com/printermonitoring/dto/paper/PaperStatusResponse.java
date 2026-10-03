package com.printermonitoring.dto.paper;

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
public class PaperStatusResponse {

    private Long id;
    private Long printerId;
    private String printerName;
    private Integer trayNumber;
    private BigDecimal paperLevel;
    private String paperStatus;
    private LocalDateTime collectedAt;
}
