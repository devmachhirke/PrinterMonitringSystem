package com.printermonitoring.entity;

import com.printermonitoring.enums.PrintJobStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "print_jobs")
@Getter
@Setter
@NoArgsConstructor
public class PrintJob extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @Column(name = "job_name", nullable = false)
    private String jobName;

    @Column(name = "document_type")
    private String documentType;

    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "copies", nullable = false)
    private Integer copies = 1;

    @Column(name = "page_count")
    private Integer pageCount = 1;

    @Column(name = "printed_by")
    private String printedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PrintJobStatus status = PrintJobStatus.PENDING;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "error_message")
    private String errorMessage;
}
