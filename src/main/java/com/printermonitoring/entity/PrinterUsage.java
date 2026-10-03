package com.printermonitoring.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "printer_usage",
        indexes = {
                @Index(
                        name = "idx_usage_printer_time",
                        columnList = "printer_id, collected_at"
                )
        }
)
@Getter
@Setter
public class PrinterUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @Column(name = "total_pages")
    private Long totalPages;

    @Column(name = "monochrome_pages")
    private Long monochromePages;

    @Column(name = "color_pages")
    private Long colorPages;

    @Column(name = "collected_at", nullable = false)
    private LocalDateTime collectedAt;
}