package com.printermonitoring.dto.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrinterLocationRequest {

    @NotBlank(message = "Location name is required")
    @Size(max = 150, message = "Location name cannot exceed 150 characters")
    private String name;

    @Size(max = 150, message = "Building name cannot exceed 150 characters")
    private String building;

    @Size(max = 50, message = "Floor cannot exceed 50 characters")
    private String floor;

    @Size(max = 150, message = "Department cannot exceed 150 characters")
    private String department;
}
