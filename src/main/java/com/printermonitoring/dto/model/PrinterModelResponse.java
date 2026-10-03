package com.printermonitoring.dto.model;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PrinterModelResponse {

    private Long id;

    private String manufacturer;

    private String modelName;

    private Boolean supportsSnmp;

    private Boolean supportsToner;

    private Boolean supportsPageCount;

    private Boolean supportsPaperStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
