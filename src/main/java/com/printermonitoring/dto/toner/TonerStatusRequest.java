package com.printermonitoring.dto.toner;

import com.printermonitoring.enums.CartridgeColor;
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
public class TonerStatusRequest {

    @NotNull(message = "Printer ID is required")
    private Long printerId;

    @NotNull(message = "Cartridge color is required")
    private CartridgeColor cartridgeColor;

    private BigDecimal tonerLevel;
}
