package com.printermonitoring.dto.paper;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaperStatusRequest {

    @NotNull(message = "Printer ID is required")
    private Long printerId;

    private Integer trayNumber;
    private BigDecimal paperLevel;
    private String paperStatus;
}
