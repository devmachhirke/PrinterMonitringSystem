package com.printermonitoring.dto.usage;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrinterUsageRequest {

    @NotNull(message = "Printer ID is required")
    private Long printerId;

    private Long totalPages;
    private Long monochromePages;
    private Long colorPages;
}
