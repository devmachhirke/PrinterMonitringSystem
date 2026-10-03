package com.printermonitoring.entity;

import com.printermonitoring.enums.ErrorSeverity;
import com.printermonitoring.enums.ErrorStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "printer_errors",
        indexes = {
                @Index(
                        name = "idx_error_printer_time",
                        columnList = "printer_id, detected_at"
                )
        }
)
@Getter
@Setter
public class PrinterError {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @Column(name = "error_code", length = 100)
    private String errorCode;

    @Column(name = "error_type", length = 100)
    private String errorType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ErrorSeverity severity;

    @Column(name = "detected_at", nullable = false)
    private LocalDateTime detectedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ErrorStatus status = ErrorStatus.OPEN;
}