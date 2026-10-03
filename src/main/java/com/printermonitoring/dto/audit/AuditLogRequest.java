package com.printermonitoring.dto.audit;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogRequest {

    private Long userId;

    @NotBlank(message = "Action is required")
    private String action;

    private String entityType;
    private Long entityId;
    private String description;
}
