package com.printermonitoring.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRecordResponse {

    private Long id;
    private Long printerId;
    private String printerName;
    private String maintenanceType;
    private String description;
    private Long performedById;
    private String performedByName;
    private LocalDateTime maintenanceDate;
    private LocalDateTime nextDueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
