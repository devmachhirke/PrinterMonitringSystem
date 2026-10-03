package com.printermonitoring.dto.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrinterModelRequest {

    @NotBlank(message = "Manufacturer is required")
    @Size(max = 100, message = "Manufacturer cannot exceed 100 characters")
    private String manufacturer;

    @NotBlank(message = "Model name is required")
    @Size(max = 150, message = "Model name cannot exceed 150 characters")
    private String modelName;

    private Boolean supportsSnmp = true;

    private Boolean supportsToner = true;

    private Boolean supportsPageCount = true;

    private Boolean supportsPaperStatus = true;
}
