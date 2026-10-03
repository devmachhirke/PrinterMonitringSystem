package com.printermonitoring.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "paper_status")
@Getter
@Setter
public class PaperStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @Column(name = "tray_number")
    private Integer trayNumber;

    @Column(name = "paper_level", precision = 5, scale = 2)
    private BigDecimal paperLevel;

    @Column(name = "paper_status", length = 30)
    private String paperStatus;

    @Column(name = "collected_at", nullable = false)
    private LocalDateTime collectedAt;
}