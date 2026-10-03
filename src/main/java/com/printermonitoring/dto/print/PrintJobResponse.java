package com.printermonitoring.dto.print;

import com.printermonitoring.enums.PrintJobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrintJobResponse {

    private Long id;
    private Long printerId;
    private String printerName;
    private String connectionType;
    private String jobName;
    private String documentType;
    private Integer copies;
    private Integer pageCount;
    private String printedBy;
    private PrintJobStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime completedAt;
    private String errorMessage;
    private String message;
}
