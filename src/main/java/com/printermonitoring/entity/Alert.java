package com.printermonitoring.entity;

import com.printermonitoring.enums.AlertSeverity;
import com.printermonitoring.enums.AlertStatus;
import com.printermonitoring.enums.AlertType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "alerts",
        indexes = {
                @Index(
                        name = "idx_alert_printer_status",
                        columnList = "printer_id, status"
                )
        }
)
@Getter
@Setter
public class Alert extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false, length = 50)
    private AlertType alertType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AlertSeverity severity;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AlertStatus status = AlertStatus.OPEN;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}