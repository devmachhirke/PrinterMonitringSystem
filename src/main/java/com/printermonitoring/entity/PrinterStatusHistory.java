package com.printermonitoring.entity;

import com.printermonitoring.enums.PrinterStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "printer_status_history",
        indexes = {
                @Index(
                        name = "idx_status_printer_time",
                        columnList = "printer_id, checked_at"
                )
        }
)
@Getter
@Setter
public class PrinterStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PrinterStatus status;

    @Column(name = "response_time_ms")
    private Integer responseTimeMs;

    @Column(name = "checked_at", nullable = false)
    private LocalDateTime checkedAt;
}