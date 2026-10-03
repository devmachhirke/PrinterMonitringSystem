package com.printermonitoring.entity;

import com.printermonitoring.enums.CartridgeColor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "toner_status",
        indexes = {
                @Index(
                        name = "idx_toner_printer_time",
                        columnList = "printer_id, collected_at"
                )
        }
)
@Getter
@Setter
public class TonerStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @Enumerated(EnumType.STRING)
    @Column(name = "cartridge_color", nullable = false, length = 30)
    private CartridgeColor cartridgeColor;

    @Column(name = "toner_level", precision = 5, scale = 2)
    private BigDecimal tonerLevel;

    @Column(name = "collected_at", nullable = false)
    private LocalDateTime collectedAt;
}