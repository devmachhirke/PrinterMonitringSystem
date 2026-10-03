package com.printermonitoring.dto.toner;

import com.printermonitoring.enums.CartridgeColor;
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
public class TonerStatusResponse {

    private Long id;
    private Long printerId;
    private String printerName;
    private CartridgeColor cartridgeColor;
    private BigDecimal tonerLevel;
    private LocalDateTime collectedAt;
}
