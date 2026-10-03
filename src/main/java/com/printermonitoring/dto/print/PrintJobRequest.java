package com.printermonitoring.dto.print;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrintJobRequest {

    @NotNull(message = "Printer ID is required")
    private Long printerId;

    @NotBlank(message = "Job name is required")
    private String jobName;

    private String documentType;

    @NotBlank(message = "Document content is required")
    private String content;

    @Min(value = 1, message = "Copies must be at least 1")
    private Integer copies;

    private String printedBy;
}
