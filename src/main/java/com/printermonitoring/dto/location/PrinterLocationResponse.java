package com.printermonitoring.dto.location;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PrinterLocationResponse {

    private Long id;

    private String name;

    private String building;

    private String floor;

    private String department;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
