package com.printermonitoring.dto.maintenance;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRecordRequest {

    @NotNull(message = "Printer ID is required")
    private Long printerId;

    private String maintenanceType;
    private String description;
    private Long performedById;
    private LocalDateTime maintenanceDate;
    private LocalDateTime nextDueDate;
}
